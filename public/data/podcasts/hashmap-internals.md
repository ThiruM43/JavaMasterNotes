# Java Interview Podcast — Episode: HashMap Internals
### Hosts: Mahi & Thiru

---

**Mahi:** இன்னைக்கு நாம HashMap internals பத்தி பேசலாம். Interview-ல ரொம்ப முக்கியமான topic இது, இல்லையா?

**Thiru:** ஆமா Mahi. **HashMap** [key-value pair-ஆ data-வை store பண்ணும் data structure]. இது hashing concept-ஐ use பண்ணுது.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு post office-ஐ நினைச்சுக்கோங்க. Pincode வச்சு letter-ஐ correct-ஆன area-க்கு அனுப்புவாங்க. இங்க Pincode தான் HashCode. Area தான் Bucket. ஒரே area-ல நிறைய letters போனா (collision), postman ஒவ்வொரு letter-ஆ போய் குடுப்பார் (LinkedList/Tree).

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** HashMap internally ஒரு Node array (`Node<K,V>[] table`) maintain பண்ணும். Default size 16. Load factor 0.75. 
`put(key, value)` கூப்பிடும்போது, key-ஓட `hashCode()` calculate பண்ணி, அதுக்கு bitwise AND போட்டு bucket index-ஐ கண்டுபிடிக்கும்.

```java
// Index calculation
int index = (n - 1) & hash;

// Node structure
static class Node<K,V> implements Map.Entry<K,V> {
    final int hash;
    final K key;
    V value;
    Node<K,V> next;
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. Java 7 vs Java 8 HashMap internals table-ஐ பாரு:
| Aspect | Java 7 | Java 8 |
|--------|--------|--------|
| Data Structure | Array of LinkedList | Array of LinkedList + Red-Black Tree |
| Collision Handling | LinkedList | LinkedList, turns to Tree if size > 8 |
| Worst Case Time | O(n) | O(log n) |
| Insert Node | At the head of LinkedList | At the tail of LinkedList |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** `hashCode()` same-ஆ இருந்தா என்ன ஆகும்னு கேப்பாங்க. Same bucket-ல போய் சேரும் (Collision). `equals()` method-ஐ use பண்ணி correct-ஆன key-ஐ கண்டுபிடிக்கும். இன்னொன்னு, custom object-ஐ key-ஆ use பண்ணும் போது, `equals()` & `hashCode()` override பண்ணலனா memory leak வர வாய்ப்பு இருக்கு.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Initial capacity சரியா குடுக்கலனா, rehashing நிறைய நடக்கும். Rehashing (resizing the array and rehashing all elements) ரொம்ப expensive operation. Performance-ஐ பாதிக்கும். 

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க patient resources-ஐ ID வச்சு cache பண்ண HashMap use பண்றோம். Size முன்னாடியே தெரியும், அதனால initial capacity set பண்ணிடுவோம், so rehashing avoid பண்ணலாம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Concurrency ரொம்ப முக்கியம். HashMap thread-safe கிடையாது. Multi-threading environment-ல `put()` operation நடக்கும்போது infinite loop வர வாய்ப்பு இருக்கு (Java 7-ல). அதனால Concurrent environment-ல ConcurrentHashMap தான் use பண்ணனும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Load factor 0.75 ஏன்னு தெரியுமா?
*Answer:* அது space-க்கும் time-க்கும் நடுவுல ஒரு நல்ல balance குடுக்கும். 1.0 இருந்தா space மிச்சம் ஆனா collisions அதிகம். 0.5 இருந்தா collisions கம்மி ஆனா space waste.

**Q:** Treeify threshold ஏன் 8?
*Answer:* Poisson distribution படி, 8 elements ஒரே bucket-ல வர்றதுக்கான probability ரொம்ப ரொம்ப கம்மி. அதனால 8 cross பண்ணா மட்டும் tree-ஆ மாறும்.

---

## Quick Revision Summary

- HashMap uses hashing to store key-value pairs.
- Internally an array of Nodes (buckets).
- Java 8 introduces Red-Black tree for collision handling (O(log n)).
- Custom keys must override `equals()` and `hashCode()`.
