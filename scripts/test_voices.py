"""
Test different voice combinations for Tanglish TTS.
Generates short sample clips to compare voice quality.
"""
import asyncio
import sys
import edge_tts
from pathlib import Path

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

OUTPUT_DIR = Path(__file__).parent.parent / "public" / "data" / "audio" / "voice-tests"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Sample Tanglish text (mix of Tamil script + English technical terms)
SAMPLE_TEXT = """
நான் Thiru. Today நாம் Microservices பத்தி பேசலாம். 
Monolith architecture-ல எல்லாம் ஒரே JVM process-ல run ஆகும்.
Microservices-ல, ஒவ்வொரு service தன்னோட own database use பண்ணும்.
API Gateway through-ஆ request route ஆகும். 
Circuit Breaker pattern use பண்ணி system resilient-ஆ வைக்கலாம்.
"""

VOICES_TO_TEST = [
    ("ta-IN-ValluvarNeural",          "ta_valluvar_normal"),
    ("ta-IN-ValluvarNeural+rate-10%", "ta_valluvar_slow"),
    ("ta-IN-PallaviNeural",           "ta_pallavi_normal"),
    ("en-IN-NeerjaExpressiveNeural",  "en_neerja_expressive"),
    ("en-IN-NeerjaNeural",            "en_neerja_normal"),
    ("en-IN-PrabhatNeural",           "en_prabhat_normal"),
    ("hi-IN-MadhurNeural",            "hi_madhur_normal"),
    ("hi-IN-SwaraNeural",             "hi_swara_normal"),
]

async def test_voice(voice_spec: str, name: str):
    out = OUTPUT_DIR / f"{name}.mp3"
    voice = voice_spec.split("+")[0]
    rate = "+0%"
    if "rate" in voice_spec:
        rate_part = voice_spec.split("rate")[1]
        rate = rate_part  # e.g. -10%

    print(f"  Generating: {name} ({voice}) ...")
    try:
        communicate = edge_tts.Communicate(text=SAMPLE_TEXT, voice=voice, rate=rate)
        await communicate.save(str(out))
        size = out.stat().st_size // 1024
        print(f"  [OK] {name}.mp3 ({size} KB)")
    except Exception as e:
        print(f"  [FAIL] {name}: {e}")

async def main():
    print("Generating voice test samples...")
    print(f"Output: {OUTPUT_DIR}\n")
    for voice_spec, name in VOICES_TO_TEST:
        await test_voice(voice_spec, name)
        await asyncio.sleep(0.5)
    
    print(f"\nDone! Listen to the files in:")
    print(f"  {OUTPUT_DIR}")
    print("\nFiles to compare:")
    for _, name in VOICES_TO_TEST:
        print(f"  - {name}.mp3")

if __name__ == "__main__":
    asyncio.run(main())
