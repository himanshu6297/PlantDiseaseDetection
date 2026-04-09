import json

# Load the notebook
with open('38Class_Final_Dataset.ipynb', 'r', encoding='utf-8') as f:
    notebook = json.load(f)

# Extract all text from cells
all_text = ""
for cell in notebook['cells']:
    source = ''.join(cell.get('source', []))
    all_text += source + "\n"

# Find and print output cells that might contain class names
print("Looking for class information in notebook...\n")

for i, cell in enumerate(notebook['cells']):
    source = ''.join(cell.get('source', []))
    
    # Look for cells that mention classes
    if 'class_names' in source:
        print(f"\n=== CELL {i} (Code) ===")
        print(source[:500])  # First 500 chars
        print("...")
        
    # Check for output cells
    if cell.get('cell_type') == 'code' and cell.get('outputs'):
        for output in cell.get('outputs', []):
            if output.get('output_type') == 'stream':
                text = ''.join(output.get('text', []))
                if 'Apple' in text or 'Tomato' in text or 'Total classes' in text:
                    print(f"\n=== OUTPUT from CELL {i} ===")
                    print(text)
