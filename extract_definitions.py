import pandas as pd
import json

# Read the original Excel file
df = pd.read_excel('SORED_obszary_wskaźniki_MATRYCA.xlsx')

# Create a mapping of indicators to definitions
indicator_definitions = {}

for idx, row in df.iterrows():
    indicator = row['Wskaźnik']
    definition = row['Definicja']
    
    if pd.notna(indicator) and pd.notna(definition):
        indicator_str = str(indicator).strip()
        definition_str = str(definition).strip()
        
        if indicator_str and definition_str:
            # Store the definition for this indicator
            indicator_definitions[indicator_str] = definition_str

print(f"Found {len(indicator_definitions)} indicators with definitions")

# Save to JSON
with open('indicator_definitions.json', 'w', encoding='utf-8') as f:
    json.dump(indicator_definitions, f, ensure_ascii=False, indent=2)

print("\nSaved to indicator_definitions.json")

# Show first few examples
print("\nExample definitions:")
for i, (indicator, definition) in enumerate(list(indicator_definitions.items())[:3]):
    print(f"\n{i+1}. Indicator: {indicator[:80]}...")
    print(f"   Definition: {definition[:100]}...")

