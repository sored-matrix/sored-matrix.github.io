#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from bs4 import BeautifulSoup
import json
import re

def clean_conditional(text):
    """Process conditional expressions like {if(...)} to combined forms"""
    if not text:
        return ""
    
    # Remove asterisks (required fields markers) first
    text = text.replace('*', '')
    
    # Process conditional expressions with proper spacing
    # Pattern: {if(instType=="inst1",'option1','option2')}
    def replace_conditional(match):
        full_match = match.group(0)
        try:
            # Extract the two options from the conditional
            pattern = r"\{if\([^,]+,'([^']+)','([^']+)'\)\}"
            m = re.match(pattern, full_match)
            if m:
                option1 = m.group(1)
                option2 = m.group(2)
                # Always add spaces around to prevent word concatenation
                return f" {option1}/{option2} "
            return full_match
        except:
            return full_match
    
    # Replace conditionals
    text = re.sub(r'\{if\([^}]+\)\}', replace_conditional, text)
    
    # Fix specific known errors in original HTML
    text = text.replace('naponiższych', 'na poniższych')
    text = text.replace('wprowadzonaprocedura', 'wprowadzona procedura')
    text = text.replace('inetrnetowych', 'internetowych')
    text = text.replace('inetrnetowe', 'internetowe')
    
    # Clean up multiple spaces (consolidate to single space)
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

def get_dimension_key(section_title):
    """Map section title to dimension key"""
    mapping = {
        'ORGANIZACJA': 'organizacja',
        'ARCHITEKTURA': 'architektura',
        'CYFROWA': 'cyfrowa',
        'KOMUNIKACJA': 'komunikacja',
        'ZASOBY': 'zasoby',
        'KADRY': 'kadry',
        'DYDAKTYKA': 'dydaktyka',
        'UCZESTNICTWO': 'uczestnictwo',
        'OSIĄGNIĘCIA': 'osiagniecia'
    }
    
    section_upper = section_title.upper()
    for key, value in mapping.items():
        if key in section_upper:
            return value
    
    return None

def extract_questions():
    """Extract questions from HTML file"""
    
    with open('questionnaire_137791_pl.html', 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f, 'html.parser')
    
    print("🔍 Przetwarzam questionnaire_137791_pl.html...\n")
    
    # Find all question wrappers
    all_question_wrappers = soup.find_all('div', class_='question-wrapper')
    print(f"📊 Znaleziono {len(all_question_wrappers)} pytań w całym dokumencie\n")
    
    # Group questions by dimension
    questions_by_dimension = {}
    
    for wrapper in all_question_wrappers:
        # Find the nearest preceding h2 (dimension)
        prev_h2 = wrapper.find_previous('h2')
        
        if not prev_h2:
            continue
        
        section_title = prev_h2.get_text(strip=True)
        
        # Skip "Informacje wstępne"
        if 'Informacje wstępne' in section_title or 'Informacje wstepne' in section_title:
            continue
        
        # Check if this is a dimension section
        dim_key = get_dimension_key(section_title)
        
        if not dim_key:
            continue
        
        # Initialize dimension if not exists
        if dim_key not in questions_by_dimension:
            clean_title = clean_conditional(section_title)
            questions_by_dimension[dim_key] = {
                'title': clean_title,
                'questions': []
            }
            print(f"📌 Znaleziono wymiar: {clean_title}")
        
        # Extract question text
        q_text_div = wrapper.find('div', class_='q-text')
        if q_text_div:
            h3 = q_text_div.find('h3')
            if h3:
                question_text = h3.get_text(strip=True)
                
                # Clean the question
                question_text = clean_conditional(question_text)
                
                # Skip very short questions or helpers
                if len(question_text) > 10 and not question_text.startswith('Pomocnik'):
                    # Extract answers
                    answers = []
                    answers_list = wrapper.find('ul', class_='list-print-answers')
                    if answers_list:
                        answer_items = answers_list.find_all('li')
                        for item in answer_items:
                            answer_text = item.get_text(strip=True)
                            if answer_text:
                                # Clean answer text
                                answer_text = clean_conditional(answer_text)
                                answers.append(answer_text)
                    
                    # Store question with answers
                    questions_by_dimension[dim_key]['questions'].append({
                        'question': question_text,
                        'answers': answers
                    })
    
    # Print summary
    print(f"\n📋 Wyniki:")
    for dim_key, data in questions_by_dimension.items():
        print(f"  {dim_key}: {len(data['questions'])} pytań")
        # Show first 2 examples
        for q_data in data['questions'][:2]:
            q_text = q_data['question']
            num_answers = len(q_data['answers'])
            print(f"    ✓ {q_text[:80]}... ({num_answers} odpowiedzi)")
    
    return questions_by_dimension

def main():
    # Extract questions
    questions_data = extract_questions()
    
    # Save to JSON
    output_file = 'static/questions_by_dimension.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(questions_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n💾 Zapisano do: {output_file}")
    
    # Summary
    print(f"\n📊 Podsumowanie końcowe:")
    total_questions = sum(len(data['questions']) for data in questions_data.values())
    print(f"  - Wymiary: {len(questions_data)}")
    print(f"  - Łącznie pytań: {total_questions}")

if __name__ == '__main__':
    main()
