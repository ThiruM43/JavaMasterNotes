# Java Interview Podcast — Episode: Garbage Collectors
### Hosts: Mahi & Thiru

---

**Mahi:** Garbage Collectors பத்தி கொஞ்சம் detail-ஆ சொல்லுங்க.

**Thiru:** கண்டிப்பா Mahi. **Garbage Collector** [GC] என்பது Java-ல தானாகவே memory-ஐ clean பண்ற ஒரு process. Unreachable objects-ஐ find பண்ணி memory-ஐ free பண்ணும். G1, ZGC, Serial, மற்றும் Parallel என பல types இருக்கு.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு movie theatre-ஐ எடுத்துக்கோ. Show முடிஞ்சதும் cleaning staff வந்து குப்பைகளை அப்புறப்படுத்துவாங்க. Garbage Collector-ம் அதேதான் பண்ணுது, use ஆகாத objects-ஐ (குப்பைகளை) memory-ல இருந்து remove பண்ணி புது data-க்கு space உருவாக்குது.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** GC ரெண்டு முக்கிய steps follow பண்ணும்: Mark மற்றும் Sweep. முதலில் use-ல இருக்குற objects-ஐ mark பண்ணும். அப்புறம் mark ஆகாத objects-ஐ sweep பண்ணி delete பண்ணும்.

```java
public class GCExample {
    public static void main(String[] args) {
        GCExample obj1 = new GCExample();
        GCExample obj2 = new GCExample();
        obj1 = null; // Eligible for GC
        System.gc(); // Requesting garbage collection
    }
}
```
இங்க `obj1` null ஆகுறதால அது Garbage Collector-ஆல remove பண்ணப்படும்.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | G1 GC | ZGC |
|--------|----------|----------|
| Strategy | Region-based | Concurrent |
| Pause Time | Predictable | Very low (<10ms) |
| Best For | Large heap sizes | Ultra-low latency apps |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** `System.gc()` call பண்ணா உடனே GC நடக்குமானு கேட்பாங்க. அதுக்கு guarantee கிடையாது, அது வெறும் request மட்டும்தான். JVM தான் decide பண்ணும் எப்ப GC run பண்ணனும்னு.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Stop-The-World (STW) pauses தான் பெரிய problem. GC run ஆகும்போது application threads pause ஆகும். இது latency-ஐ ரொம்ப affect பண்ணும், அதனால சரியான GC algorithm-ஐ select பண்ணனும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க G1 GC-ஐ default-ஆ use பண்றோம். ஏன்னா இது latency மற்றும் throughput ரெண்டுக்கும் நல்ல balance கொடுக்குது, குறிப்பா பெரிய FHIR payloads process பண்ணும்போது.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Architect-ஆ pause time goals, heap size, மற்றும் application throughput-ஐ consider பண்ணனும். Low latency வேணும்னா ZGC போகலாம், ஆனா CPU overhead கொஞ்சம் அதிகமா இருக்கும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Minor GC-க்கும் Major GC-க்கும் என்ன வித்தியாசம்?
*Answer:* Young Generation-ல நடக்குறது Minor GC. Old Generation-ல நடக்குறது Major GC. Major GC ரொம்ப நேரம் எடுக்கும்.

**Q:** G1 GC எப்படி வேலை செய்யுது?
*Answer:* Heap-ஐ பல regions-ஆ பிரிச்சு, எந்த region-ல அதிக garbage இருக்கோ அத முதல்ல collect பண்ணும் (Garbage First).

---

## Quick Revision Summary

- GC automates memory management.
- Mark and Sweep are the fundamental phases.
- G1 GC is the default in newer Java versions.
- ZGC aims for extremely low pause times.
