#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import xml.etree.ElementTree as ET
import pandas as pd
import re
from html import unescape

def remove_html_tags(text):
    """Remove HTML tags from text"""
    if not text:
        return ""
    # Unescape HTML entities first
    text = unescape(text)
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    # Clean up extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def process_conditional(text):
    """
    Process conditional expressions like {if(instType=="inst1",'przedszkola','szkoły')}
    and replace them with both options using proper Polish grammar forms
    """
    if not text:
        return ""
    
    # Pattern to match if statements
    pattern = r'\{if\(instType=="inst1",\'([^\']+)\',\'([^\']+)\'\)\}'
    
    def replace_conditional(match):
        option1 = match.group(1)  # przedszkola, dzieci
        option2 = match.group(2)  # szkoły, uczniów
        
        # Get the context around the conditional
        full_text = text
        match_start = match.start()
        
        # Check what comes after to determine grammar case
        after_text = full_text[match.end():match.end()+30].lower()
        before_text = full_text[max(0, match_start-30):match_start].lower()
        
        # Determine the grammatical case needed
        # Dopełniacz (genitive) - when preceded by words like "nazwa", "typ", etc.
        # or in context like "ORGANIZACJA [przedszkola] sprzyjająca"
        if 'sprzyjająca' in after_text or 'zapewniająca' in after_text or 'umożliwiające' in after_text:
            # For "ORGANIZACJA {if} sprzyjająca dostępności" - use genitive
            if option1 == 'przedszkola':
                return 'przedszkoli/szkół'
            elif option1 == 'dzieci':
                return 'dzieci/uczniów'  # "dzieci" doesn't change in genitive
            elif option1.endswith('e'):  # przedszkole -> przedszkola
                return option1 + '/' + option2
        
        # For verbs and participles that should stay
        # Keep the verb/participle in the output
        # Example: "dzieci otrzymujących" -> "dzieci/uczniów otrzymujących"
        if 'otrzymujących' in option1 or 'otrzymujących' in option2:
            # Extract the base noun
            base1 = option1.replace('otrzymujących', '').strip()
            base2 = option2.replace('otrzymujących', '').strip()
            # Return combined form with the participle at the end
            return base1 + '/' + base2 + ' otrzymujących'
        
        if 'uczęszcza' in option1 or 'uczęszcza' in option2:
            base1 = option1.replace('uczęszcza', '').strip()
            base2 = option2.replace('uczęszcza', '').strip()
            return base1 + '/' + base2 + ' uczęszcza'
        
        # Default: just combine with slash
        return option1 + '/' + option2
    
    # Replace all conditional expressions
    text = re.sub(pattern, replace_conditional, text)
    
    return text

def extract_survey_data(xml_file):
    """Extract sections and questions from survey XML"""
    
    tree = ET.parse(xml_file)
    root = tree.getroot()
    
    data = []
    
    # Main dimension names
    dimension_keywords = [
        'ORGANIZACJA', 'ARCHITEKTURA', 'CYFROWA', 'KOMUNIKACJA',
        'ZASOBY', 'KADRY', 'DYDAKTYKA', 'UCZESTNICTWO', 'OSIĄGNIĘCIA'
    ]
    
    current_area = None
    current_area_full_name = None
    
    for section in root.findall('.//section'):
        # Get section title
        section_title_elem = section.find('.//sectionInfo/text')
        
        if section_title_elem is not None and section_title_elem.text:
            section_title = section_title_elem.text.strip()
            
            # Check if this is a main dimension section
            is_dimension = any(keyword in section_title for keyword in dimension_keywords)
            
            if is_dimension:
                # This is a main area/dimension
                current_area_full_name = section_title
                
                # Extract the main keyword for the area name
                for keyword in dimension_keywords:
                    if keyword in section_title:
                        current_area = keyword
                        break
                
                # Process conditional expressions and HTML
                current_area_full_name = remove_html_tags(current_area_full_name)
                current_area_full_name = process_conditional(current_area_full_name)
        
        # Extract questions from this section
        if current_area:
            for question in section.findall('.//question'):
                # Get ALL text elements (questions can have multiple <text> tags)
                text_elements = question.findall('./text')
                
                # Combine all text elements
                question_texts = []
                for text_elem in text_elements:
                    if text_elem is not None and text_elem.text:
                        text = text_elem.text.strip()
                        # Clean HTML and process conditionals
                        text = remove_html_tags(text)
                        text = process_conditional(text)
                        if text and len(text) > 3:
                            question_texts.append(text)
                
                # Join multiple texts with a space or newline
                question_text = ' | '.join(question_texts) if len(question_texts) > 1 else (question_texts[0] if question_texts else '')
                
                # Get variable name if exists
                response = question.find('./response')
                var_name = response.get('varName') if response is not None else ''
                
                # Also check labels in responses for additional context
                labels = []
                for resp in question.findall('.//response'):
                    label_elem = resp.find('.//label')
                    if label_elem is not None and label_elem.text:
                        label_text = label_elem.text.strip()
                        label_text = remove_html_tags(label_text)
                        label_text = process_conditional(label_text)
                        if label_text and label_text not in question_text and len(label_text) > 5:
                            labels.append(label_text)
                
                # Add labels to question if they provide additional context
                if labels and question_text:
                    question_text += ' [' + '; '.join(labels[:2]) + ']'  # Limit to 2 labels
                
                # Skip if question is empty after cleaning
                if question_text and len(question_text) > 3:
                    data.append({
                        'Obszar': current_area,
                        'Pełna nazwa obszaru': current_area_full_name,
                        'Pytanie': question_text,
                        'Zmienna': var_name
                    })
    
    return data

def main():
    print("🔍 Analizuję plik survey_137791_pl.xml...")
    
    # Extract data
    data = extract_survey_data('survey_137791_pl.xml')
    
    print(f"✅ Znaleziono {len(data)} pytań")
    
    # Create DataFrame
    df = pd.DataFrame(data)
    
    # Group by area to show summary
    print("\n📊 Podsumowanie:")
    summary = df.groupby('Obszar').size().sort_values(ascending=False)
    for area, count in summary.items():
        area_name = df[df['Obszar'] == area]['Pełna nazwa obszaru'].iloc[0]
        print(f"  {area}: {count} pytań - {area_name}")
    
    # Save to Excel
    output_file = 'SORED_ankieta_obszary_pytania.xlsx'
    
    with pd.ExcelWriter(output_file, engine='xlsxwriter') as writer:
        df.to_excel(writer, sheet_name='Wszystkie pytania', index=False)
        
        # Get workbook and worksheet
        workbook = writer.book
        worksheet = writer.sheets['Wszystkie pytania']
        
        # Set column widths
        worksheet.set_column('A:A', 20)  # Obszar
        worksheet.set_column('B:B', 50)  # Pełna nazwa obszaru
        worksheet.set_column('C:C', 80)  # Pytanie
        worksheet.set_column('D:D', 15)  # Zmienna
        
        # Add header format
        header_format = workbook.add_format({
            'bold': True,
            'bg_color': '#4472C4',
            'font_color': 'white',
            'border': 1
        })
        
        # Create separate sheets for each area
        for area in df['Obszar'].unique():
            if area:
                area_df = df[df['Obszar'] == area].copy()
                sheet_name = area[:31]  # Excel sheet name limit
                area_df.to_excel(writer, sheet_name=sheet_name, index=False)
                
                ws = writer.sheets[sheet_name]
                ws.set_column('A:A', 20)
                ws.set_column('B:B', 50)
                ws.set_column('C:C', 80)
                ws.set_column('D:D', 15)
    
    print(f"\n💾 Zapisano do pliku: {output_file}")
    print(f"\n📋 Arkusze:")
    print(f"  - Wszystkie pytania (wszystkie obszary)")
    for area in df['Obszar'].unique():
        if area:
            print(f"  - {area}")

if __name__ == '__main__':
    main()

