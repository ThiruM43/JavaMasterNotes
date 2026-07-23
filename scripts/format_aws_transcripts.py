import os
import shutil
from pathlib import Path

# The 8 standard sections we want to inject
HEADINGS = [
    "Introduction",
    "Core Concept",
    "Real-world Example",
    "Under the Hood",
    "Edge Cases & Scenarios",
    "Performance & Trade-offs",
    "Summary",
    "Interview Deep-Dive Q&A"
]

AWS_FILES = {
    "AWS_1_Foundations & Identity.md": "aws-1-foundations.md",
    "AWS_2_High Availability, Scaling & Compute Patterns.md": "aws-2-scaling.md",
    "AWS_3_Data Layer — Databases, Caching & Storage.md": "aws-3-data-layer.md",
    "AWS_4_Networking & Global Content Delivery.md": "aws-4-networking.md",
    "AWS_5_Security, Monitoring & Governance.md": "aws-5-security.md",
    "AWS_6_Solutions Architecture & Exam Scenarios.md": "aws-6-architecture.md"
}

SRC_DIR = Path("D:/Interview/JavaNotesWebApp/AWS")
DEST_DIR = Path("D:/Interview/JavaNotesWebApp/public/data/podcasts/aws")
DEST_DIR.mkdir(parents=True, exist_ok=True)

def process_file(src_name, dest_name):
    src_path = SRC_DIR / src_name
    dest_path = DEST_DIR / dest_name
    
    with open(src_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    paragraphs = [p.strip() for p in content.split('\n\n') if p.strip()]
    
    # We want to distribute the 8 headings across the paragraphs (excluding title)
    body_paragraphs = [p for p in paragraphs if not p.startswith('#')]
    title = [p for p in paragraphs if p.startswith('#')][0] if paragraphs[0].startswith('#') else "# AWS Podcast"
    
    chunk_size = max(1, len(body_paragraphs) // len(HEADINGS))
    
    structured_content = [title]
    speaker_toggle = True # True = Mahi, False = Thiru
    heading_idx = 0
    
    for i, p in enumerate(body_paragraphs):
        # Inject heading
        if i % chunk_size == 0 and heading_idx < len(HEADINGS):
            structured_content.append(f"## {HEADINGS[heading_idx]}")
            heading_idx += 1
            
        # Add speaker tags
        speaker = "Mahi" if speaker_toggle else "Thiru"
        structured_content.append(f"**{speaker}:** {p}")
        speaker_toggle = not speaker_toggle
        
    # Write to destination
    with open(dest_path, 'w', encoding='utf-8') as f:
        f.write('\n\n'.join(structured_content))
    
    print(f"Processed: {src_name} -> {dest_name}")

if __name__ == "__main__":
    for src, dest in AWS_FILES.items():
        process_file(src, dest)
    print("Done formatting AWS transcripts!")
