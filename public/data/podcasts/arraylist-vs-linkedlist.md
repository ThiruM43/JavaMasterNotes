# Java Interview Podcast — Episode: ArrayList vs LinkedList
### Hosts: Mahi & Thiru

---

**Mahi:** இன்னைக்கு நாம ArrayList vs LinkedList பத்தி பேசலாம். ரெண்டுமே List interface-ஐ implement பண்ணுது, ஆனா எங்க எதை use பண்ணனும்?

**Thiru:** கண்டிப்பா Mahi. **ArrayList** [dynamic array-ஆ செயல்படும் ஒரு data structure], **LinkedList** [doubly linked list-ஆ செயல்படும் data structure]. ரெண்டுக்கும் நிறைய performance differences இருக்கு.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ArrayList ஒரு theatre-ல இருக்கிற row of seats மாதிரி. நீங்க 5th seat-ஐ உடனே point பண்ணலாம். ஆனா நடுவுல ஒருத்தரை உக்கார வைக்கணும்னா, மத்த எல்லாரையும் நகர்த்தணும். LinkedList ஒரு treasure hunt மாதிரி. ஒரு clue-ல அடுத்த clue எங்க இருக்குன்னு info இருக்கும். நடுவுல ஒரு clue-ஐ add பண்றது ஈஸி, ஆனா 5th clue வேணும்னா 1st-ல இருந்துதான் போகணும்.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** ArrayList internally ஒரு `Object[]` array-ஐ maintain பண்ணும். Default capacity 10. அது full ஆனதும், புது array create பண்ணி பழைய elements-ஐ copy பண்ணும் (grow by 50%).
LinkedList-ல `Node` class இருக்கும், அதுல `prev`, `data`, `next` மூணும் இருக்கும்.

```java
// ArrayList growth
int newCapacity = oldCapacity + (oldCapacity >> 1);

// LinkedList Node
private static class Node<E> {
    E item;
    Node<E> next;
    Node<E> prev;
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | ArrayList | LinkedList |
|--------|-----------|------------|
| Under the hood | Resizable Array | Doubly Linked List |
| Search (get) | O(1) | O(n) |
| Insert/Delete | O(n) (shifting needed) | O(1) (if node is known) |
| Memory Overhead| Low (just array elements) | High (prev/next object references) |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** நிறைய பேர் LinkedList insert-க்கு O(1) ன்னு நினைப்பாங்க. ஆனா நடுவுல insert பண்ணனும்னா, அந்த position-ஐ கண்டுபிடிக்க O(n) time ஆகும். அப்புறம் தான் insertion O(1). அதனால overall time O(n) தான் ஆகும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Memory overhead தான் பெரிய issue. LinkedList நிறைய object-ஐ heap-ல create பண்ணும், அதனால Garbage Collector-க்கு வேலை அதிகம். 99% cases-ல ArrayList தான் better choice.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க FHIR resources-ஐ process பண்ணும்போது, sequential access தான் அதிகம் பண்றோம். அதனால நாங்க ArrayList தான் use பண்றோம். Database records-ஐ fetch பண்ணி list-ஆ store பண்ணும்போது ArrayList performance ரொம்ப நல்லா இருக்கு.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** CPU cache locality ரொம்ப முக்கியம். ArrayList elements எல்லாமே contiguous memory-ல இருக்கும், அதனால CPU cache-ல ஈஸியா fit ஆகும். LinkedList elements memory-ல எங்கெங்கேயோ இருக்கும், அதனால cache misses நிறைய நடக்கும், performance drop ஆகும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** ArrayList-ல `RandomAccess` interface எதற்கு?
*Answer:* அது ஒரு marker interface. List-ஐ fast-ஆ access பண்ண முடியுமான்னு Collections class-க்கு சொல்லும்.

**Q:** LinkedList-ஐ Queue-ஆ use பண்ண முடியுமா?
*Answer:* ஆமா, LinkedList `Deque` interface-ஐ implement பண்ணுது, அதனால Queue-ஆவும் use பண்ணலாம்.

---

## Quick Revision Summary

- ArrayList uses dynamic array, fast search O(1).
- LinkedList uses doubly linked list, fast insert/delete O(1) if node is known.
- ArrayList is cache-friendly, LinkedList causes cache misses.
- Prefer ArrayList in 99% of real-world scenarios.
