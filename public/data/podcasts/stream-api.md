# Java Interview Podcast — Episode: Stream API basics
### Hosts: Mahi & Thiru

---

**Mahi:** Stream API பத்தி சொல்லுங்க, இது collections-ல எப்படி different?

**Thiru:** கண்டிப்பா Mahi. **Stream API** [data processing pipeline] collections-ல இருக்கிற data-வை functional style-ல process பண்ண use ஆகுது. இது data-வை store பண்ணாது, ஆனா data-வை transform பண்ணவும் filter பண்ணவும் ரொம்ப ஈஸியான வழிய கொடுக்குது.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு water filter pipe-ஐ யோசிச்சு பாருங்க. தண்ணி (data) pipe-குள்ள போகுது, நடுவுல filter (intermediate operations) ஆகுது, கடைசியா tap (terminal operation) வழியா நமக்கு clear water கிடைக்குது. Stream-ம் இதே மாதிரி pipeline தான்!

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Streams lazy execution-ஐ follow பண்ணும். நீங்க எவ்ளோ intermediate operations (`filter`, `map`) add பண்ணாலும், terminal operation (`collect`, `forEach`) கூப்பிடுற வரைக்கும் எதுவும் execute ஆகாது. இது performance-ஐ ரொம்ப improve பண்ணும்.

```java
List<String> names = Arrays.asList("Mahi", "Thiru", "Java");
List<String> result = names.stream()
    .filter(name -> name.startsWith("T")) // Intermediate
    .map(String::toUpperCase)             // Intermediate
    .collect(Collectors.toList());        // Terminal
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Collections | Streams |
|--------|-------------|---------|
| Storage | Stores data | Does not store data |
| Iteration | External iteration (for/while) | Internal iteration |
| Modification | Can add/remove elements | Cannot modify underlying data directly |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** "Can we reuse a stream?" அப்படின்னு கேப்பாங்க. முடியாது! ஒரு terminal operation run ஆன உடனே, அந்த stream close ஆயிடும். திரும்ப use பண்ண try பண்ணா `IllegalStateException` வரும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Streams-ல exception handling கொஞ்சம் கஷ்டம். Checked exceptions-ஐ lambda-க்குள்ள throw பண்ண முடியாது, அதனால try-catch block உள்ள எழுதணும். இது code readability-ஐ கொஞ்சம் reduce பண்ணலாம்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) patients data-ல specific conditions இருக்கிற cases-ஐ filter பண்ண நாங்க `stream().filter()` ரொம்ப extensive-ஆ use பண்றோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Simple loops-க்கு streams use பண்றது overhead. Performance critical applications-ல primitive arrays-க்கு traditional for-loops-ஐ விட streams slow-ஆ இருக்க வாய்ப்பு இருக்கு. Readability vs Performance trade-off பாக்கணும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** What is the difference between intermediate and terminal operations?
*Answer:* Intermediate operations return a new Stream and are lazy. Terminal operations produce a result or side-effect and trigger the execution of the pipeline.

**Q:** What is short-circuiting in streams?
*Answer:* `findFirst()`, `limit()`, `anyMatch()` மாதிரி operations stream-ஐ முழுசா process பண்ணாம, condition meet ஆன உடனே result-ஐ கொடுக்கும். இதுதான் short-circuiting.

---

## Quick Revision Summary

- Streams are for processing data, not storing it.
- Operations are divided into Intermediate (lazy) and Terminal.
- A Stream cannot be reused after a terminal operation is called.
- Streams support internal iteration.
- Favor streams for readability when manipulating collections.