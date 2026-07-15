"""
Java Master Notes PDF Extractor — v3 (Dual Format Handler)

PDF has two block layouts:
  Format A: LEFT narrow block (x1<200) = term name only
            RIGHT block (x0>=140) = What/Why/How/Where/When + Issue/Fix/STAR
  Format B: FULL-WIDTH block (x0~42, x1>200) = "TermName\nWhat:... Why:..."
            RIGHT blocks (x0>=140) = Issue/Fix/STAR
"""

import fitz
import json
import re
import os
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

PDF_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "Java_Master_Notes_WithSTAR_COMPLETE.pdf")
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "src", "data")
os.makedirs(OUTPUT_DIR, exist_ok=True)

SECTION_META = {
    1:  {"icon": "☕", "color": "#d97706", "slug": "core-java",       "file": "section-01-core-java.json",       "title": "Core Java Fundamentals"},
    2:  {"icon": "🏗️", "color": "#7c3aed", "slug": "oop",             "file": "section-02-oop.json",             "title": "Object-Oriented Programming"},
    3:  {"icon": "📦", "color": "#0891b2", "slug": "collections",     "file": "section-03-collections.json",     "title": "Collections Framework"},
    4:  {"icon": "⚡", "color": "#dc2626", "slug": "concurrency",     "file": "section-04-concurrency.json",     "title": "Concurrency & Multithreading"},
    5:  {"icon": "🔧", "color": "#059669", "slug": "jvm-gc",          "file": "section-05-jvm-gc.json",          "title": "JVM Internals & Garbage Collection"},
    6:  {"icon": "🔷", "color": "#6366f1", "slug": "generics",        "file": "section-06-generics.json",        "title": "Generics"},
    7:  {"icon": "λ",  "color": "#0284c7", "slug": "lambda",          "file": "section-07-lambda.json",          "title": "Lambda & Functional Programming"},
    8:  {"icon": "🌊", "color": "#0d9488", "slug": "streams",         "file": "section-08-streams.json",         "title": "Streams API & Optional"},
    9:  {"icon": "⚠️", "color": "#ea580c", "slug": "exceptions",      "file": "section-09-exceptions.json",      "title": "Exception Handling"},
    10: {"icon": "📁", "color": "#65a30d", "slug": "java-io",         "file": "section-10-java-io.json",         "title": "Java I/O"},
    11: {"icon": "🗄️", "color": "#ca8a04", "slug": "jdbc",            "file": "section-11-jdbc.json",            "title": "JDBC & Database Access"},
    12: {"icon": "🗃️", "color": "#9333ea", "slug": "jpa-hibernate",   "file": "section-12-jpa-hibernate.json",   "title": "JPA & Hibernate"},
    13: {"icon": "🍃", "color": "#16a34a", "slug": "spring",          "file": "section-13-spring.json",          "title": "Spring Framework"},
    14: {"icon": "🧪", "color": "#2563eb", "slug": "testing",         "file": "section-14-testing.json",         "title": "Testing"},
    15: {"icon": "🔬", "color": "#db2777", "slug": "microservices",   "file": "section-15-microservices.json",   "title": "Microservices"},
    16: {"icon": "📨", "color": "#b45309", "slug": "kafka",           "file": "section-16-kafka.json",           "title": "Apache Kafka & Messaging"},
    17: {"icon": "🚀", "color": "#7c3aed", "slug": "modern-java",     "file": "section-17-modern-java.json",     "title": "Modern Java (8 → 21)"},
    18: {"icon": "🌲", "color": "#0f766e", "slug": "dsa",             "file": "section-18-dsa.json",             "title": "Data Structures & Algorithms"},
    19: {"icon": "🏛️", "color": "#1d4ed8", "slug": "system-design",  "file": "section-19-system-design.json",  "title": "System Design"},
    20: {"icon": "🛠️", "color": "#475569", "slug": "devops",          "file": "section-20-devops.json",          "title": "Code Quality & Best Practices"},
}

# ─────────────────────────────────────────────
# STAR parser
# ─────────────────────────────────────────────
def parse_star(text):
    text = re.sub(r'^⭐\s*STAR:\s*', '', text.strip())
    result = {"s": "", "t": "", "a": "", "r": ""}
    parts = re.split(r'\b(S|T|A|R):\s*', text)
    current = None
    for part in parts:
        if part in ('S', 'T', 'A', 'R'):
            current = part.lower()
        elif current:
            result[current] = re.sub(r'\s+', ' ', part).strip()
            current = None
    return result

# ─────────────────────────────────────────────
# Parse combined content block (What/Why/How/Where/When + possibly Issue/Fix/STAR)
# ─────────────────────────────────────────────
def parse_content(text):
    fields = {'what':'','why':'','how':'','where':'','when':'','issue':'','fix':'','star':{'s':'','t':'','a':'','r':''}}
    splitter = re.compile(r'(What|Why|How|Where|When|⚠\s*Issue|✔\s*Fix|⭐\s*STAR)\s*:')
    parts = splitter.split(text)
    i = 0
    while i < len(parts):
        seg = parts[i].strip()
        if splitter.match(seg + ':') or seg in ('What','Why','How','Where','When') or re.match(r'⚠\s*Issue|✔\s*Fix|⭐\s*STAR', seg):
            label = seg
            value = parts[i+1].strip() if i+1 < len(parts) else ''
            value = re.sub(r'\s+', ' ', value).strip()
            if label == 'What': fields['what'] = value
            elif label == 'Why': fields['why'] = value
            elif label == 'How': fields['how'] = value
            elif label == 'Where': fields['where'] = value
            elif label == 'When': fields['when'] = value
            elif re.match(r'⚠\s*Issue', label): fields['issue'] = value
            elif re.match(r'✔\s*Fix', label): fields['fix'] = value
            elif re.match(r'⭐\s*STAR', label): fields['star'] = parse_star(value)
            i += 2
        else:
            i += 1
    return fields

def clean(text):
    return re.sub(r'\s+', ' ', text).strip()

# ─────────────────────────────────────────────
# Extract blocks from PDF with metadata
# ─────────────────────────────────────────────
def extract_page_blocks(pdf_path):
    doc = fitz.open(pdf_path)
    all_blocks = []
    for page_num, page in enumerate(doc):
        raw_blocks = page.get_text('blocks')
        for b in raw_blocks:
            x0, y0, x1, y1, text, *_ = b
            text = text.strip()
            if not text or y0 < 42 or y0 > 785:
                continue
            all_blocks.append({
                'x0': x0, 'y0': y0, 'x1': x1, 'y1': y1,
                'text': text,
                'page': page_num + 1,
            })
    return all_blocks

# ─────────────────────────────────────────────
# Section / subsection detection helpers
# ─────────────────────────────────────────────
SEC_PAT = re.compile(r'^(\d{1,2})\.\s+[A-Z][\w\s\&\(\)→\-\.]+$')
SUB_PAT = re.compile(r'^(\d{1,2}\.\d[a-z]?[b-z]?)\s{1,6}(.{3,80})$')
NOISE = re.compile(r'^(TERM\s*(MEANING)?|MEANING|KEY RULE|Java Master Interview Notes|Page \d+)$', re.I)

def match_section(text):
    m = SEC_PAT.match(text.strip())
    return int(m.group(1)) if m else None

def match_subsection(text):
    m = SUB_PAT.match(text.strip())
    if m:
        return m.group(1), m.group(2).strip()
    return None, None

# ─────────────────────────────────────────────
# Main parser
# ─────────────────────────────────────────────
def build_sections(blocks):
    # State
    cur_sec = None
    cur_sub_id = None
    cur_sub_title = None

    # Data store
    # section_data[sec_num] = { subsections: { sub_id: {title, key_rule, terms:[]} } , order: [sub_id...] }
    section_data = {n: {'subsections': {}, 'order': []} for n in SECTION_META}

    i = 0
    while i < len(blocks):
        blk = blocks[i]
        text = blk['text']
        x0 = blk['x0']
        x1 = blk['x1']

        # ── Detect main section ──────────────────
        single_line = text.replace('\n', ' ').strip()
        sec_num = match_section(single_line)
        if sec_num and sec_num in SECTION_META and x0 < 100:
            cur_sec = sec_num
            cur_sub_id = None
            i += 1
            continue

        # ── Detect subsection ────────────────────
        sub_id, sub_title = match_subsection(single_line)
        if sub_id and cur_sec and x0 < 200:
            cur_sub_id = sub_id
            cur_sub_title = sub_title
            sd = section_data[cur_sec]
            if sub_id not in sd['subsections']:
                sd['subsections'][sub_id] = {'title': sub_title, 'key_rule': '', 'terms': []}
                sd['order'].append(sub_id)
            i += 1
            continue

        # ── KEY RULE ─────────────────────────────
        if text.startswith('KEY RULE') and cur_sec and cur_sub_id:
            # The key rule text may be in same block or next block
            kr_text = text.replace('KEY RULE', '').strip()
            if not kr_text and i+1 < len(blocks):
                kr_text = clean(blocks[i+1]['text'])
                i += 1
            if cur_sub_id in section_data[cur_sec]['subsections']:
                section_data[cur_sec]['subsections'][cur_sub_id]['key_rule'] = clean(kr_text)
            i += 1
            continue

        # ── Skip noise ───────────────────────────
        if NOISE.match(text.strip()):
            i += 1
            continue

        # ── No active subsection → skip ──────────
        if not cur_sub_id or not cur_sec:
            i += 1
            continue

        sub_entry = section_data[cur_sec]['subsections'].get(cur_sub_id)
        if not sub_entry:
            i += 1
            continue

        # ── Format A: narrow LEFT block (term name only) ─────────────────────────
        # x0 < 140 AND x1 < 210 AND no "What:" in text
        if x0 < 140 and x1 < 210 and 'What:' not in text and 'What' not in text[:10]:
            term_name = clean(text)
            if len(term_name) > 2 and len(term_name) < 100:
                # Collect right-column blocks that follow (until next left-column block)
                j = i + 1
                right_parts = []
                while j < len(blocks):
                    nb = blocks[j]
                    # Stop at next left-column block (narrow, no What:)
                    if nb['x0'] < 140 and nb['x1'] < 210 and 'What:' not in nb['text']:
                        break
                    # Stop at section/subsection markers
                    nl = nb['text'].replace('\n',' ').strip()
                    if match_section(nl) or match_subsection(nl)[0]:
                        break
                    right_parts.append(nb['text'])
                    j += 1

                content_text = '\n'.join(right_parts)
                fields = parse_content(content_text)

                if fields['what']:
                    term_id = f"{cur_sub_id}.{re.sub(r'[^a-z0-9]+','-', term_name.lower())[:45].strip('-')}"
                    sub_entry['terms'].append({
                        'id': term_id, 'term': term_name, **fields,
                        'difficulty': 'intermediate', 'tags': []
                    })
                i = j
                continue

        # ── Format B: full-width LEFT block (term name + What/Why/How) ──────────
        # x0 ~ 42 AND x1 > 210 AND contains "What:"
        if x0 < 140 and x1 > 210 and 'What:' in text:
            # First line(s) before "What:" = term name
            what_idx = text.find('What:')
            term_name = clean(text[:what_idx])
            # Remove trailing garbage from term_name
            term_name = term_name.strip().rstrip('\n').strip()
            # Get term name as first meaningful line
            term_lines = [l.strip() for l in term_name.split('\n') if l.strip()]
            term_name = term_lines[-1] if term_lines else term_name

            content_from_block = text[what_idx:]

            # Collect following RIGHT blocks for Issue/Fix/STAR
            j = i + 1
            extra_parts = []
            while j < len(blocks):
                nb = blocks[j]
                nl = nb['text'].replace('\n',' ').strip()
                # Stop at next term or section/subsection
                if nb['x0'] < 140 and nb['x1'] < 210:
                    break
                if nb['x0'] < 140 and nb['x1'] > 210 and 'What:' in nb['text']:
                    break
                if match_section(nl) or match_subsection(nl)[0]:
                    break
                extra_parts.append(nb['text'])
                j += 1

            full_content = content_from_block + '\n' + '\n'.join(extra_parts)
            fields = parse_content(full_content)

            if fields['what'] and term_name and len(term_name) > 1 and len(term_name) < 100:
                term_id = f"{cur_sub_id}.{re.sub(r'[^a-z0-9]+','-', term_name.lower())[:45].strip('-')}"
                sub_entry['terms'].append({
                    'id': term_id, 'term': term_name, **fields,
                    'difficulty': 'intermediate', 'tags': []
                })
            i = j
            continue

        i += 1

    # Build final section objects
    result = {}
    for sec_num, sd in section_data.items():
        meta = SECTION_META[sec_num]
        subsections = []
        seen_terms = set()
        for sub_id in sd['order']:
            se = sd['subsections'][sub_id]
            # Deduplicate terms
            unique_terms = []
            for t in se['terms']:
                if t['id'] not in seen_terms:
                    seen_terms.add(t['id'])
                    unique_terms.append(t)
            subsections.append({
                'id': sub_id,
                'slug': re.sub(r'[^a-z0-9]+','-', se['title'].lower()).strip('-'),
                'title': se['title'],
                'keyRule': se['key_rule'],
                'terms': unique_terms
            })

        result[sec_num] = {
            'id': str(sec_num),
            'slug': meta['slug'],
            'title': meta['title'],
            'icon': meta['icon'],
            'accentColor': meta['color'],
            'subsections': subsections
        }
    return result

# ─────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────
def main():
    print(f"Extracting: {PDF_PATH}")
    blocks = extract_page_blocks(PDF_PATH)
    print(f"Total blocks: {len(blocks)}")

    sections = build_sections(blocks)

    index = []
    for sec_num in sorted(sections.keys()):
        sec = sections[sec_num]
        meta = SECTION_META[sec_num]
        out_path = os.path.join(OUTPUT_DIR, meta['file'])
        total_terms = sum(len(s['terms']) for s in sec['subsections'])
        total_subs = len(sec['subsections'])
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(sec, f, ensure_ascii=False, indent=2)
        print(f"  §{sec_num:2d} {sec['title']:<48} {total_subs:2d} subs {total_terms:3d} terms")
        index.append({
            'id': sec['id'], 'slug': sec['slug'], 'title': sec['title'],
            'icon': sec['icon'], 'accentColor': sec['accentColor'],
            'file': meta['file'], 'subsectionCount': total_subs, 'termCount': total_terms,
        })

    with open(os.path.join(OUTPUT_DIR, 'index.json'), 'w', encoding='utf-8') as f:
        json.dump(index, f, ensure_ascii=False, indent=2)

    print(f"\n✅ {len(index)} sections, {sum(s['termCount'] for s in index)} total terms → {OUTPUT_DIR}")

if __name__ == '__main__':
    main()
