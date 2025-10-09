import pandas as pd
import json

# Read the mapping file (after user corrections)
df = pd.read_excel('SORED_mapowanie_wymiary_wskazniki.xlsx', sheet_name='Mapowanie')

# Remove rows without dimension assignment
df = df[df['Wymiar na stronie (popraw jeśli trzeba)'].notna()]
df = df[df['Wymiar na stronie (popraw jeśli trzeba)'] != '']

# Group indicators by dimension
dimension_map = {
    'OSIĄGNIĘCIA EDUKACYJNE': 'osiagniecia',
    'UCZESTNICTWO': 'uczestnictwo',
    'DYDAKTYKA': 'dydaktyka',
    'KADRY': 'kadry',
    'ZASOBY': 'zasoby',
    'ORGANIZACJA': 'organizacja',
    'ARCHITEKTURA': 'architektura',
    'CYFROWA': 'cyfrowa',
    'KOMUNIKACJA': 'komunikacja'
}

# Build the indicators data structure for JavaScript
indicators_for_js = {}

for dimension_name, dimension_key in dimension_map.items():
    # Get all indicators for this dimension
    dimension_indicators = df[df['Wymiar na stronie (popraw jeśli trzeba)'] == dimension_name]['Wskaźnik'].tolist()
    
    indicators_for_js[dimension_key] = {
        'title': dimension_name,
        'indicators': dimension_indicators
    }

# Save as JSON for the website
with open('static/indicators_for_website.json', 'w', encoding='utf-8') as f:
    json.dump(indicators_for_js, f, ensure_ascii=False, indent=2)

print("✅ Generated static/indicators_for_website.json")
print("\nSummary:")
for dim_name, dim_key in dimension_map.items():
    count = len(indicators_for_js[dim_key]['indicators'])
    print(f"  {dim_name}: {count} wskaźników")

print("\n✅ Wskaźniki zostały zaktualizowane!")
print("💡 Strona internetowa automatycznie wczyta nowe dane.")

