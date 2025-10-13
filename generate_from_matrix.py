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
        
        # Collect indicators
        wskazniki = []
        
        for idx, row in wymiar_df.iterrows():
            # Combine Wskaźnik1 and Wskaźnik2
            wskaznik1 = row.get('Wskaźnik1', '')
            wskaznik2 = row.get('Wskaźnik2', '')
            
            # Skip if both are empty
            if pd.isna(wskaznik1) and pd.isna(wskaznik2):
                continue
            
            # Create indicator text
            if not pd.isna(wskaznik2) and str(wskaznik2).strip():
                # If wskaznik2 exists, use it (it's the actual indicator)
                indicator = str(wskaznik2).strip()
            elif not pd.isna(wskaznik1) and str(wskaznik1).strip():
                # Otherwise use wskaznik1
                indicator = str(wskaznik1).strip()
            else:
                continue
            
            # Only add if not already in list (avoid duplicates)
            if indicator and indicator not in wskazniki:
                wskazniki.append(indicator)
        
        # Store data
        indicators_data[dim_key] = {
            "title": wymiar_full,
            "short_name": short_name,
            "indicators": wskazniki
        }
        
        # Store definition with wymiar name as key
        if not pd.isna(definicja):
            definitions_data[wymiar_full] = str(definicja).strip()
        
        print(f"✅ {short_name}: {len(wskazniki)} wskaźników")
    
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
    print(f"  - Łącznie wskaźników: {sum(len(v['indicators']) for v in indicators_data.values())}")
    
    # Show sample data
    print(f"\n📄 Przykładowe dane:")
    for dim_key, data in list(indicators_data.items())[:2]:
        print(f"\n  {data['title']}")
        print(f"    Definicja: {definitions_data.get(data['title'], 'Brak')[:100]}...")
        print(f"    Wskaźniki ({len(data['indicators'])}):")
        for ind in data['indicators'][:3]:
            print(f"      • {ind[:80]}...")

if __name__ == '__main__':
    main()

