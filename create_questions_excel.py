#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import pandas as pd

def create_questions_excel():
    """Create Excel file with questions and answers from JSON"""
    
    print("🔍 Wczytuję pytania z JSON...\n")
    
    with open('static/questions_by_dimension.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Prepare data for Excel
    rows = []
    
    for dim_key, dim_data in data.items():
        dim_title = dim_data['title']
        questions = dim_data['questions']
        
        print(f"📌 {dim_key}: {len(questions)} pytań")
        
        for idx, q_data in enumerate(questions):
            question = q_data['question']
            answers = q_data.get('answers', [])
            
            # Create row
            row = {
                'Wymiar': dim_key,
                'Pełna nazwa wymiaru': dim_title,
                'Nr pytania': idx + 1,
                'Pytanie': question,
                'Liczba odpowiedzi': len(answers),
                'Odpowiedzi': '; '.join(answers) if answers else '[pytanie otwarte]'
            }
            
            rows.append(row)
    
    # Create DataFrame
    df = pd.DataFrame(rows)
    
    # Save to Excel
    output_file = 'SORED_pytania_i_odpowiedzi.xlsx'
    df.to_excel(output_file, index=False, sheet_name='Pytania')
    
    print(f"\n💾 Zapisano: {output_file}")
    print(f"\n📊 Statystyki:")
    print(f"  - Łącznie pytań: {len(df)}")
    print(f"  - Pytań z odpowiedziami: {len(df[df['Liczba odpowiedzi'] > 0])}")
    print(f"  - Pytań otwartych: {len(df[df['Liczba odpowiedzi'] == 0])}")
    
    # Group by dimension
    print(f"\n📋 Podział według wymiarów:")
    dimension_counts = df.groupby('Wymiar').size()
    for dim, count in dimension_counts.items():
        print(f"  - {dim}: {count} pytań")

if __name__ == '__main__':
    create_questions_excel()

