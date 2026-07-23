# Java Interview Podcast — Episode: HashMap vs ConcurrentHashMap
### Hosts: Mahi & Thiru

---

**Mahi:** இன்னைக்கு நாம HashMap vs ConcurrentHashMap பத்தி பேசலாம். Multi-threading-ல Map use பண்ணனும்னா என்ன பண்ணுவீங்க?

**Thiru:** நல்ல கேள்வி Mahi. **HashTable** [பழைய synchronized map], **HashMap** [thread-safe இல்லாத map], **ConcurrentHashMap** [thread-safe ஆன, highly concurrent map]. இது மூணும் தான் options.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** HashTable ஒரு ATM machine மாதிரி, ஒரு நேரத்துல ஒருத்தர் தான் use பண்ண முடியும். HashMap ஒரு open ground மாதிரி, யார் வேணாலும் எப்ப வேணாலும் வரலாம் ஆனா இடிச்சுக்குவாங்க (data corruption). ConcurrentHashMap ஒரு supermarket மாதிரி, நிறைய counters இருக்கும், ஒரு counter-ல ஆள் இருந்தா இன்னொரு counter-ஐ use பண்ணலாம்.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** HashTable முழு Map-ஐயும் lock பண்ணும். ஆனா ConcurrentHashMap Segment level lock (Java 7) அல்லது Node level lock (Java 8) use பண்ணும்.

```java
// Java 8 ConcurrentHashMap put logic
if (casTabAt(tab, i, null, new Node<K,V>(hash, key, value, null)))
    break; // no lock when adding to empty bucket
else {
    synchronized (f) { // lock only the specific bucket
        // add logic
    }
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | HashMap | HashTable | ConcurrentHashMap |
|--------|---------|-----------|-------------------|
| Thread Safe | No | Yes | Yes |
| Null Key/Value | Allows 1 null key, multiple null values | No nulls allowed | No nulls allowed |
| Locking Mechanism | None | Full Map Lock | Bucket level lock (CAS + Synchronized) |
| Performance | Fast | Very Slow | Very Fast in concurrent env |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Nulls பத்தி கேப்பாங்க. ConcurrentHashMap-ல ஏன் null allow பண்ணலன்னு? ஏன்னா multi-threading environment-ல `get(key)` null குடுத்தா, அது key இல்லாம இருக்கலாம், அல்லது value null-ஆ இருக்கலாம் (Ambiguity issue).

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** HashTable use பண்ணா application ரொம்ப slow ஆகிடும், ஏன்னா thread contention அதிகம். அதனால production-ல எப்பவுமே ConcurrentHashMap தான் use பண்ணுவோம்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) background threads நிறைய ஓடும். Incoming IMAP emails-ஐ process பண்ணும்போது, message ID-ஐ duplicate செக் பண்ண ConcurrentHashMap-ஐ ஒரு cache-ஆ use பண்றோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Read heavy vs Write heavy-ஆன்னு பாக்கணும். ConcurrentHashMap-ல read operations-க்கு lock கிடையாது (volatile use பண்றாங்க). அதனால read heavy system-க்கு இது ரொம்ப சூப்பரா work ஆகும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Java 8-ல ConcurrentHashMap-ல என்ன மாற்றம் செஞ்சாங்க?
*Answer:* Segment locking-ஐ தூக்கிட்டு, CAS (Compare And Swap) மற்றும் `synchronized` block-ஐ Node level-ல use பண்ண ஆரம்பிச்சாங்க.

**Q:** `putIfAbsent` ConcurrentHashMap-ல எப்படி work ஆகுது?
*Answer:* இது atomic operation. ரெண்டு thread ஒரே நேரத்துல வந்தாலும், ஒன்னு தான் value-ஐ put பண்ண முடியும்.

---

## Quick Revision Summary

- HashMap is not thread-safe.
- HashTable is fully synchronized and slow.
- ConcurrentHashMap locks only a portion (bucket), making it fast.
- ConcurrentHashMap does not allow null keys or values.
