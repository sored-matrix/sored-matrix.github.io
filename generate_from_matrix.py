#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import json
import re

def get_dimension_key(wymiar_name):
    """Map full wymiar name to short key used in website"""
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
    
    wymiar_upper = wymiar_name.upper()
    for key, value in mapping.items():
        if key in wymiar_upper:
            return value
    
    return None

def extract_short_name(wymiar_full):
    """Extract short dimension name from full name
    e.g. 'ORGANIZACJA sprzyjająca dostępności' -> 'ORGANIZACJA'
    """
    keywords = ['ORGANIZACJA', 'ARCHITEKTURA', 'CYFROWA', 'KOMUNIKACJA', 
                'ZASOBY', 'KADRY', 'DYDAKTYKA', 'UCZESTNICTWO', 'OSIĄGNIĘCIA']
    
    for keyword in keywords:
        if keyword in wymiar_full.upper():
            return keyword
    
    return wymiar_full.split()[0]

def main():
    print("🔍 Przetwarzam matrix_framework.xlsx...\n")
    
    # Read Excel file
    df = pd.read_excel('matrix_framework.xlsx')
    
    print(f"📊 Znaleziono {len(df)} wierszy")
    print(f"Kolumny: {list(df.columns)}\n")
    
    # Process data
    indicators_data = {}
    definitions_data = {}
    
    # Group by Wymiar
    for wymiar_full in df['Wymiar'].unique():
        if pd.isna(wymiar_full):
            continue
        
        # Get dimension key
        dim_key = get_dimension_key(wymiar_full)
        if not dim_key:
            print(f"⚠️  Nie znaleziono klucza dla wymiaru: {wymiar_full}")
            continue
        
        # Get definition (first row for this wymiar)
        wymiar_df = df[df['Wymiar'] == wymiar_full]
        definicja = wymiar_df['Definicja'].iloc[0]
        
        # Extract short name for title
        short_name = extract_short_name(wymiar_full)
        
        # Analyze structure: check if we have categories (Wskaźnik1) or just flat indicators
        # Group by Wskaźnik1 to see if we have categories
        categories_dict = {}
        flat_indicators = []
        
        for idx, row in wymiar_df.iterrows():
            wskaznik1 = row.get('Wskaźnik1', '')
            wskaznik2 = row.get('Wskaźnik2', '')
            
            # Skip if both are empty
            if pd.isna(wskaznik1) and pd.isna(wskaznik2):
                continue
            
            # Clean strings
            wskaznik1_str = str(wskaznik1).strip() if not pd.isna(wskaznik1) else ''
            wskaznik2_str = str(wskaznik2).strip() if not pd.isna(wskaznik2) else ''
            
            # If we have both levels, use hierarchical structure
            if wskaznik1_str and wskaznik2_str:
                if wskaznik1_str not in categories_dict:
                    categories_dict[wskaznik1_str] = []
                if wskaznik2_str not in categories_dict[wskaznik1_str]:
                    categories_dict[wskaznik1_str].append(wskaznik2_str)
            # If only wskaznik1, it's a flat indicator
            elif wskaznik1_str:
                if wskaznik1_str not in flat_indicators:
                    flat_indicators.append(wskaznik1_str)
            # If only wskaznik2, it's also a flat indicator
            elif wskaznik2_str:
                if wskaznik2_str not in flat_indicators:
                    flat_indicators.append(wskaznik2_str)
        
        # Decide on structure based on what we found
        if categories_dict:
            # We have hierarchical structure
            categories_list = []
            for category_name, indicators in categories_dict.items():
                categories_list.append({
                    "name": category_name,
                    "indicators": indicators
                })
            
            indicators_data[dim_key] = {
                "title": wymiar_full,
                "short_name": short_name,
                "has_categories": True,
                "categories": categories_list
            }
            
            total_indicators = sum(len(cat["indicators"]) for cat in categories_list)
            print(f"✅ {short_name}: {len(categories_list)} kategorii, {total_indicators} wskaźników")
        else:
            # Flat structure
            indicators_data[dim_key] = {
                "title": wymiar_full,
                "short_name": short_name,
                "has_categories": False,
                "indicators": flat_indicators
            }
            
            print(f"✅ {short_name}: {len(flat_indicators)} wskaźników (bez kategorii)")
        
        # Store definition with wymiar name as key
        if not pd.isna(definicja):
            definitions_data[wymiar_full] = str(definicja).strip()
    
    # Save indicators to JSON
    with open('static/indicators_for_website.json', 'w', encoding='utf-8') as f:
        json.dump(indicators_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n💾 Zapisano: static/indicators_for_website.json")
    
    # Save definitions to JSON
    with open('static/indicator_definitions.json', 'w', encoding='utf-8') as f:
        json.dump(definitions_data, f, ensure_ascii=False, indent=2)
    
    print(f"💾 Zapisano: static/indicator_definitions.json")
    
    # Create summary
    print(f"\n📋 Podsumowanie:")
    print(f"  - Wymiary: {len(indicators_data)}")
    print(f"  - Definicje: {len(definitions_data)}")
    
    # Show sample data
    print(f"\n📄 Przykładowe dane:")
    for dim_key, data in list(indicators_data.items())[:2]:
        print(f"\n  {data['title']}")
        print(f"    Definicja: {definitions_data.get(data['title'], 'Brak')[:100]}...")
        if data.get('has_categories'):
            print(f"    Kategorie ({len(data['categories'])}):")
            for cat in data['categories'][:2]:
                print(f"      📁 {cat['name'][:60]}... ({len(cat['indicators'])} wskaźników)")
                for ind in cat['indicators'][:2]:
                    print(f"         • {ind[:70]}...")
        else:
            print(f"    Wskaźniki ({len(data['indicators'])}):")
            for ind in data['indicators'][:3]:
                print(f"      • {ind[:80]}...")

if __name__ == '__main__':
    main()
