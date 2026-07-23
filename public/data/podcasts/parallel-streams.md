# Java Interview Podcast — Episode: Parallel Streams
### Hosts: Mahi & Thiru

---

**Mahi:** Parallel Streams எப்ப use பண்ணனும், இதோட advantage என்ன?

**Thiru:** கண்டிப்பா Mahi. **Parallel Streams** [multithreaded stream processing] stream operations-ஐ multiple threads-ல run பண்ண வைக்கும். இது `ForkJoinPool`-ஐ use பண்ணி data-வை பிரிச்சு, parallel-ஆ process பண்ணி, அப்பறம் result-ஐ merge பண்ணும்.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** 1000 புக்ஸ்-ஐ count பண்ணனும். நீங்க ஒருத்தரே count பண்ணா அது Sequential Stream. ஆனா 10 பேர கூப்பிட்டு, ஆளுக்கு 100 புக்ஸ் count பண்ண சொல்லி, கடைசியா மொத்த total-ஐ ஆட் பண்ணா, அதுதான் Parallel Stream!

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Parallel stream default-ஆ `ForkJoinPool.commonPool()`-ஐ use பண்ணும். இதோட thread count normally `CPU cores - 1`. Data-வை recursively பாதியா பிரிச்சு (Fork), threads-ல process பண்ணி, கடைசியா join பண்ணும்.

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
int sum = numbers.parallelStream()
                 .mapToInt(Integer::intValue)
                 .sum();
System.out.println("Sum: " + sum);
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Sequential Stream | Parallel Stream |
|--------|-------------------|-----------------|
| Execution | Single thread | Multiple threads |
| Order preservation | Always preserved | Might not be preserved without overhead |
| Overhead | Low overhead | High thread-management overhead |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** State mutate பண்ற operations-ஐ parallel stream-ல use பண்ணா race condition வரும். "Thread-safety" problem ரொம்ப common. `forEach` use பண்ணும்போது order மாற வாய்ப்பு இருக்கு, order முக்கியம்னா `forEachOrdered` use பண்ணனும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** எல்லா parallel streams-ம் ஒரே common `ForkJoinPool`-ஐ share பண்றதால, ஒரு stream-ல blocking I/O (like DB call, Network call) இருந்தா, மொத்த application-ஓட parallel stream performance-ம் affect ஆகும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க parallel streams-ஐ avoid பண்ணுவோம் I/O operations-க்கு. CPU intensive reporting metrics calculate பண்ணும்போது மட்டும் large dataset-க்கு use பண்ணுவோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** NQ model (N x Q > 10000) அப்படின்னு ஒரு rule இருக்கு. N = number of data items, Q = amount of work per item. இந்த value ரொம்ப அதிகமா இருந்தா மட்டும் parallel stream-க்கு போகணும். சும்மா சின்ன lists-க்கு parallel stream use பண்ணா performance மோசமாகும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Custom thread pool-ஐ parallel stream-க்கு use பண்ண முடியுமா?
*Answer:* Directly API support இல்லை, ஆனா custom `ForkJoinPool`-க்குள்ள parallel stream code-ஐ submit பண்ணி run பண்ணலாம்.

**Q:** When should you avoid parallel streams?
*Answer:* I/O operations பண்ணும்போது, collections split பண்ண கஷ்டமா இருந்தா (like `LinkedList`), அப்புறம் dataset size ரொம்ப சின்னதா இருந்தா கண்டிப்பா avoid பண்ணனும்.

---

## Quick Revision Summary

- Parallel Streams divide work into multiple threads using `ForkJoinPool.commonPool()`.
- Good for CPU-intensive tasks with large datasets (High N * Q).
- Bad for I/O operations or stateful lambda expressions.
- May not preserve execution order unless `forEachOrdered` is used.
- Thread management overhead can make it slower than sequential streams for small datasets.