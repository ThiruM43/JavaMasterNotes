# Java Interview Podcast — Episode: Memory Leaks
### Hosts: Mahi & Thiru

---

**Mahi:** Memory Leaks பத்தி கொஞ்சம் detail-ஆ சொல்லுங்க.

**Thiru:** கண்டிப்பா Mahi. **Memory Leak** [நினைவக கசிவு] என்பது application-க்கு தேவையில்லாத objects-ஐ Garbage Collector-ஆல remove பண்ண முடியாத நிலை. இதனால கொஞ்சமா memory fill ஆகி கடைசில `OutOfMemoryError` வரும்.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு bucket-ல தண்ணி ஊத்திட்டே இருக்கோம்னு வெச்சுக்கோ. ஆனா bucket-ல சின்ன ஓட்டை இருக்கு, தண்ணி வீணா போகுது. அத கவனிக்காம விட்டா, நம்மகிட்ட தண்ணியே இருக்காது. அதேபோல, தேவையற்ற objects memory-ஐ occupy பண்ணிட்டே இருந்தா application-க்கு memory பத்தாம போயிடும்.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Java-ல memory leak பெரும்பாலும் strong references மூலமா நடக்குது. ஒரு object-ஐ collection-ல add பண்ணிட்டு அத remove பண்ணாம விட்டா, GC அந்த object-ஐ தொடாது.

```java
public class MemoryLeakDemo {
    private static List<Object> list = new ArrayList<>();
    
    public void addToList() {
        while (true) {
            list.add(new Object()); // Leak: objects are never removed
        }
    }
}
```
இங்க `list` static-ஆ இருக்கு, சோ அது application முடியும் வரைக்கும் memory-ல இருக்கும். Objects add ஆயிட்டே இருந்தா leak கன்பார்ம்.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Normal Object | Leaked Object |
|--------|----------|----------|
| GC Eligibility | Yes (when unreferenced) | No (still referenced) |
| Impact | Frees memory | Consumes memory continuously |
| Result | Stable application | OutOfMemoryError |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** ThreadLocal variables-ல memory leak எப்படி நடக்கும்னு கேட்பாங்க. ThreadLocal-ல data store பண்ணிட்டு அத remove (`remove()`) பண்ணலன்னா, Thread pool use பண்ணும்போது leak ஆகும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Application மெதுவா slow ஆகும், CPU spike ஆகும் (ஏன்னா GC அடிக்கடி run ஆகும்), கடைசில crash ஆகிடும். இதை கண்டுபிடிக்க Heap Dump எடுத்து Eclipse MAT மாதிரியான tools-ல analyze பண்ணுவோம்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க connections மற்றும் streams-ஐ close பண்ணாம விட்டப்போ memory leak வந்துச்சு. அதனால `try-with-resources` use பண்ணி எல்லா resources-ஐயும் proper-ஆ close பண்ணுறோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Architect-ஆ static variables usage-ஐ குறைக்கணும். Caching implement பண்ணும்போது WeakHashMap அல்லது Guava/Caffeine cache use பண்ணனும், அப்போதான் பழைய entries தானா remove ஆகும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Java-ல memory leak எப்படி நடக்கும்?
*Answer:* Unclosed resources, static collections, மற்றும் unremoved ThreadLocal variables மூலமா memory leak நடக்கும்.

**Q:** Memory leak-ஐ எப்படி debug பண்ணுவீங்க?
*Answer:* VisualVM அல்லது JConsole use பண்ணி memory graph-ஐ monitor பண்ணுவேன். Heap dump எடுத்து Eclipse MAT (Memory Analyzer Tool) வழியா leak suspects-ஐ கண்டுபிடிப்பேன்.

---

## Quick Revision Summary

- Memory leaks happen when unused objects remain referenced.
- Static collections are a common source of leaks.
- Always close resources using try-with-resources.
- Use heap dumps to find leak suspects.
