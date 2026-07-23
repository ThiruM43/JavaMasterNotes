"""
Tanglish Podcast Audio Generator
Uses edge-tts (free, no API key) to generate MP3 audio for podcast episodes.

Voices:
  Mahi (Host/Female)  -> ta-IN-PallaviNeural
  Thiru (Expert/Male) -> ta-IN-ValluvarNeural

Usage:
  python generate_audio.py --slug monolith-vs-microservices
  python generate_audio.py --module 1   (generates all episodes in module 1)
  python generate_audio.py --all        (generates all episodes)
"""

import asyncio
import re
import sys
import os
import json
import argparse
import tempfile
import shutil
from pathlib import Path

# Force UTF-8 output on Windows
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# ─── Config ──────────────────────────────────────────────────────────────────
PODCASTS_DIR = Path(__file__).parent.parent / "public" / "data" / "podcasts"
AUDIO_DIR    = Path(__file__).parent.parent / "public" / "data" / "audio"
INDEX_FILE   = Path(__file__).parent.parent / "public" / "data" / "podcast-index.json"

VOICE_MAHI  = "ta-IN-ValluvarNeural"   # Tamil Male — Mahi (higher pitch, slightly faster)
VOICE_THIRU = "ta-IN-ValluvarNeural"   # Tamil Male — Thiru (normal, authoritative)

RATE_MAHI   = "+8%"    # Mahi speaks slightly faster (host energy)
PITCH_MAHI  = "+4Hz"   # Mahi slightly higher pitch to sound distinct
RATE_THIRU  = "+0%"    # Thiru at normal rate (expert, measured)
PITCH_THIRU = "-2Hz"   # Thiru slightly deeper pitch (authoritative)

PAUSE_BETWEEN_LINES_MS = 600   # ms of silence between speaker turns
PAUSE_AFTER_HEADING_MS = 400   # ms of silence after section headings

# ─── Helpers ─────────────────────────────────────────────────────────────────

def clean_text(text: str) -> str:
    """Strip markdown syntax, code blocks, links, bold, italic, emojis for TTS."""
    # Remove code blocks
    text = re.sub(r'```[\s\S]*?```', '', text)
    text = re.sub(r'`[^`]*`', '', text)
    # Remove markdown links but keep link text
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)
    # Remove bold/italic markers
    text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)
    text = re.sub(r'\*([^*]+)\*', r'\1', text)
    text = re.sub(r'__([^_]+)__', r'\1', text)
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    # Remove markdown headings hashes
    text = re.sub(r'^#+\s*', '', text, flags=re.MULTILINE)
    # Remove horizontal rules
    text = re.sub(r'^---+$', '', text, flags=re.MULTILINE)
    # Remove bullet markers
    text = re.sub(r'^\s*[-*+]\s+', '', text, flags=re.MULTILINE)
    # Remove common emojis (basic removal)
    emoji_pattern = re.compile(
        "[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF"
        "\U0001F680-\U0001F6FF\U0001F1E0-\U0001F1FF"
        "\U00002702-\U000027B0\U000024C2-\U0001F251]+", flags=re.UNICODE)
    text = emoji_pattern.sub('', text)
    # Collapse whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def parse_segments(md_path: Path):
    """
    Parse a podcast markdown file into a list of (voice, text) segments.
    Returns list of dicts: {'voice': str, 'text': str}
    """
    segments = []
    
    with open(md_path, encoding='utf-8') as f:
        lines = f.readlines()
    
    current_speaker = None
    current_lines = []
    
    def flush():
        if current_speaker and current_lines:
            text = clean_text(' '.join(current_lines))
            if text.strip():
                voice = VOICE_MAHI if current_speaker == 'mahi' else VOICE_THIRU
                segments.append({'voice': voice, 'text': text, 'speaker': current_speaker})
    
    for line in lines:
        stripped = line.strip()
        
        # Skip empty lines and code block lines
        if not stripped or stripped.startswith('```'):
            continue
        
        # Detect speaker lines: **Mahi:** or **Thiru:**
        mahi_match  = re.match(r'^\*\*Mahi\s*:\*\*\s*(.*)', stripped, re.IGNORECASE)
        thiru_match = re.match(r'^\*\*Thiru\s*:\*\*\s*(.*)', stripped, re.IGNORECASE)
        
        if mahi_match:
            flush()
            current_lines = []
            current_speaker = 'mahi'
            rest = mahi_match.group(1).strip()
            if rest:
                current_lines.append(rest)
        elif thiru_match:
            flush()
            current_lines = []
            current_speaker = 'thiru'
            rest = thiru_match.group(1).strip()
            if rest:
                current_lines.append(rest)
        elif current_speaker:
            # continuation line for the current speaker
            current_lines.append(stripped)
        # else: preamble / headings before any speaker — skip
    
    flush()
    return segments


async def generate_segment_audio(text: str, voice: str, out_path: Path, rate: str = "+0%", pitch: str = "+0Hz"):
    """Generate a single audio segment using edge-tts."""
    import edge_tts
    communicate = edge_tts.Communicate(text=text, voice=voice, rate=rate, pitch=pitch)
    await communicate.save(str(out_path))


def concat_mp3_files(input_files: list, output_path: Path, pause_ms: int = 600):
    """
    Concatenate MP3 files using pydub (no ffmpeg needed for simple concat).
    Falls back to raw byte concat if pydub fails.
    """
    try:
        from pydub import AudioSegment
        combined = AudioSegment.empty()
        silence = AudioSegment.silent(duration=pause_ms)
        
        for i, f in enumerate(input_files):
            seg = AudioSegment.from_mp3(str(f))
            if i > 0:
                combined += silence
            combined += seg
        
        output_path.parent.mkdir(parents=True, exist_ok=True)
        combined.export(str(output_path), format="mp3", bitrate="64k")
        return True
    except Exception as e:
        print(f"  [pydub] {e} — trying raw concat...")
        # Fallback: raw byte join (works only if all files same encoding)
        try:
            output_path.parent.mkdir(parents=True, exist_ok=True)
            with open(output_path, 'wb') as out:
                for f in input_files:
                    with open(f, 'rb') as inp:
                        out.write(inp.read())
            return True
        except Exception as e2:
            print(f"  [raw] {e2}")
            return False


async def generate_episode(slug: str) -> bool:
    """Generate MP3 for a single episode slug."""
    md_path = PODCASTS_DIR / f"{slug}.md"
    out_path = AUDIO_DIR / f"{slug}.mp3"
    
    if not md_path.exists():
        print(f"  ✗ Markdown not found: {md_path}")
        return False
    
    if out_path.exists():
        print(f"  [SKIP] Already exists: {slug}.mp3")
        return True
    
    print(f"\n[TTS] Generating: {slug}")
    segments = parse_segments(md_path)
    
    if not segments:
        print(f"  [ERROR] No speaker segments found in {slug}.md")
        return False
    
    print(f"  Found {len(segments)} speaker segments")
    
    # Generate individual segment MP3s in a temp dir
    tmp_dir = Path(tempfile.mkdtemp())
    segment_files = []
    
    try:
        for i, seg in enumerate(segments):
            text = seg['text']
            if not text or len(text) < 3:
                continue
            
            # Truncate very long segments to avoid TTS timeouts
            if len(text) > 2000:
                text = text[:2000] + "."
            
            seg_path = tmp_dir / f"seg_{i:04d}.mp3"
            print(f"  [{i+1}/{len(segments)}] {seg['speaker'].capitalize()}: segment {i+1}")
            
            try:
                rate  = RATE_MAHI   if seg['speaker'] == 'mahi' else RATE_THIRU
                pitch = PITCH_MAHI  if seg['speaker'] == 'mahi' else PITCH_THIRU
                await generate_segment_audio(text, seg['voice'], seg_path, rate=rate, pitch=pitch)
                if seg_path.exists() and seg_path.stat().st_size > 0:
                    segment_files.append(seg_path)
                else:
                    print(f"    [WARN] Empty output for segment {i}")
            except Exception as e:
                print(f"    [SKIP] segment {i}: {e}")
            
            # Small delay to avoid rate limiting
            await asyncio.sleep(0.3)
        
        if not segment_files:
            print(f"  [ERROR] No segments generated for {slug}")
            return False
        
        # Concatenate all segments
        print(f"  Concatenating {len(segment_files)} segments...")
        success = concat_mp3_files(segment_files, out_path, pause_ms=PAUSE_BETWEEN_LINES_MS)
        
        if success and out_path.exists():
            size_kb = out_path.stat().st_size // 1024
            print(f"  [DONE] {slug}.mp3 ({size_kb} KB)")
            return True
        else:
            print(f"  [ERROR] Failed to create {slug}.mp3")
            return False
    
    finally:
        # Cleanup temp files
        shutil.rmtree(tmp_dir, ignore_errors=True)


async def main():
    parser = argparse.ArgumentParser(description='Generate Tanglish podcast audio')
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--slug', help='Single episode slug (e.g. monolith-vs-microservices)')
    group.add_argument('--module', type=int, help='Module number (1-16)')
    group.add_argument('--all', action='store_true', help='Generate all episodes')
    
    args = parser.parse_args()
    
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    
    # Load index for module-based generation
    with open(INDEX_FILE, encoding='utf-8') as f:
        index = json.load(f)
    
    slugs = []
    
    if args.slug:
        slugs = [args.slug]
    elif args.module:
        mod = next((m for m in index['modules'] if m['id'] == str(args.module)), None)
        if not mod:
            print(f"Module {args.module} not found")
            sys.exit(1)
        slugs = [ep['slug'] for ep in mod['episodes']]
        print(f"[MODULE] Generating Module {args.module}: {mod['title']} ({len(slugs)} episodes)")
    elif args.all:
        for mod in index['modules']:
            slugs.extend([ep['slug'] for ep in mod['episodes']])
        print(f"[ALL] Generating all {len(slugs)} episodes")
    
    success_count = 0
    for slug in slugs:
        ok = await generate_episode(slug)
        if ok:
            success_count += 1
    
    print(f"{'='*50}")
    print(f"[COMPLETE] {success_count}/{len(slugs)} episodes generated")
    print(f"[OUTPUT] Audio files saved to: {AUDIO_DIR}")


if __name__ == "__main__":
    asyncio.run(main())
