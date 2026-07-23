import os
import re
from pathlib import Path
from collections import Counter

folder = Path(r"D:\Interview\New folder (2)")
files = list(folder.glob("*.md"))

headers_counter = Counter()
bracket_terms = set()
has_analogy = 0
has_table = 0
has_code = 0
edge_cases_count = 0

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        
        # Headers
        headers = re.findall(r'^(#{2,3})\s+(.*)$', content, re.MULTILINE)
        for h in headers:
            # strip leading numbers if present e.g. "1. Real World Analogy" -> "Real World Analogy"
            header_text = re.sub(r'^\d+\.\s*', '', h[1]).strip()
            headers_counter[header_text] += 1
            
            if "Analogy" in header_text:
                has_analogy += 1
            if "Table" in header_text or "Comparison" in header_text:
                has_table += 1
            if "Edge Case" in header_text:
                edge_cases_count += 1
                
        # Tables
        if "|" in content and "-|-" in content:
            pass # already counted via headers or we can double check
            
        # Code blocks
        if "```" in content:
            has_code += 1
            
        # Bracket terms
        brackets = re.findall(r'\[([^\]]+-[^\]]+)\]', content)
        for b in brackets:
            bracket_terms.add(b.strip())

print(f"Analyzed {len(files)} files.")
print(f"Files with Analogy: {has_analogy}")
print(f"Files with Code Blocks: {has_code}")
print(f"Files with Edge Cases: {edge_cases_count}")

print("\n--- Common Headers ---")
for h, count in headers_counter.most_common(10):
    print(f"{count}x: {h}")

print("\n--- Sample Bracket Definitions Extracted ---")
for b in list(bracket_terms)[:20]:
    print("-", b)
