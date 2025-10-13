import pandas as pd
import json

# Read the extracted indicators
with open('indicators_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# The 9 main dimensions from the website
website_dimensions = [
    'OSIĄGNIĘCIA EDUKACYJNE',
    'UCZESTNICTWO',
    'DYDAKTYKA',
    'KADRY',
    'ZASOBY',
    'ORGANIZACJA',
    'ARCHITEKTURA',
    'CYFROWA',
    'KOMUNIKACJA'
]

# Create mapping data
rows = []

for key, value in data.items():
    source_dimension = value['title']
    indicators = value['indicators']
    
    # Try to map to website dimension (you can correct this later)
    suggested_mapping = ''
    
    # Simple keyword matching for suggestions
    if 'architekton' in source_dimension.lower():
        suggested_mapping = 'ARCHITEKTURA'
    elif 'kadr' in source_dimension.lower():
        suggested_mapping = 'KADRY'
    elif 'cyfrowa' in source_dimension.lower() or 'cyfrowy' in source_dimension.lower():
        suggested_mapping = 'CYFROWA'
    elif 'komunikacyj' in source_dimension.lower():
        suggested_mapping = 'KOMUNIKACJA'
    elif 'dydaktycz' in source_dimension.lower() or 'nauczani' in source_dimension.lower():
        suggested_mapping = 'DYDAKTYKA'
    elif 'organizacyj' in source_dimension.lower() or 'współprac' in source_dimension.lower():
        suggested_mapping = 'ORGANIZACJA'
    elif 'osiągnięc' in source_dimension.lower() or 'kompetencj' in source_dimension.lower():
        suggested_mapping = 'OSIĄGNIĘCIA EDUKACYJNE'
    elif 'uczestni' in source_dimension.lower() or 'obecność' in source_dimension.lower() or 'emocjonalno' in source_dimension.lower() or 'społeczno' in source_dimension.lower():
        suggested_mapping = 'UCZESTNICTWO'
    elif 'zasoby' in source_dimension.lower() or 'wydatk' in source_dimension.lower():
        suggested_mapping = 'ZASOBY'
    
    for indicator in indicators:
        rows.append({
            'Wymiar na stronie (popraw jeśli trzeba)': suggested_mapping,
            'Źródłowy wymiar z matrycy': source_dimension,
            'Wskaźnik': indicator
        })

# Create DataFrame
df = pd.DataFrame(rows)

# Save to Excel with formatting
with pd.ExcelWriter('SORED_mapowanie_wymiary_wskazniki.xlsx', engine='xlsxwriter') as writer:
    df.to_excel(writer, sheet_name='Mapowanie', index=False)
    
    # Get workbook and worksheet
    workbook = writer.book
    worksheet = writer.sheets['Mapowanie']
    
    # Add formats
    header_format = workbook.add_format({
        'bold': True,
        'bg_color': '#4472C4',
        'font_color': 'white',
        'border': 1,
        'text_wrap': True,
        'valign': 'vcenter'
    })
    
    # Format headers
    for col_num, value in enumerate(df.columns.values):
        worksheet.write(0, col_num, value, header_format)
    
    # Set column widths
    worksheet.set_column('A:A', 30)  # Wymiar na stronie
    worksheet.set_column('B:B', 50)  # Źródłowy wymiar
    worksheet.set_column('C:C', 80)  # Wskaźnik
    
    # Add data validation for first column (dropdown with website dimensions)
    worksheet.data_validation('A2:A1000', {
        'validate': 'list',
        'source': website_dimensions
    })

print(f"Created Excel file: SORED_mapowanie_wymiary_wskazniki.xlsx")
print(f"Total rows: {len(df)}")
print(f"\nSummary of suggested mappings:")
print(df['Wymiar na stronie (popraw jeśli trzeba)'].value_counts())

