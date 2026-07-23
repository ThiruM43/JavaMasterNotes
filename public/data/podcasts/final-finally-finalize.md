# Java Interview Podcast — Episode: final vs finally vs finalize()
### Hosts: Mahi & Thiru

---

**Mahi:** Java-ல `final`, `finally`, `finalize()` இந்த மூணு terms-க்கும் என்ன difference?

**Thiru:** பாக்க ஒரே மாதிரி இருந்தாலும் மூணும் வேற வேற Mahi. **final** [keyword] வந்து restriction-க்கு use ஆகுது (variable-ஐ மாத்த முடியாது). **finally** [block] வந்து exception handling-ல cleanup code எழுத use ஆகுது. **finalize()** [method] வந்து object destroy ஆகுறதுக்கு முன்னாடி Garbage Collector call பண்ற method.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** 
**final**: ஒரு exam-ல final answer sheet submit பண்ற மாதிரி. Submit பண்ணிட்டா மாத்த முடியாது.
**finally**: நீ exam-ல pass ஆகுறியோ, fail ஆகுறியோ, கண்டிப்பா fee கட்டி ஆகணும். அது மாதிரி exception வந்தாலும் வரலனாலும் finally execute ஆகும்.
**finalize**: வீட்டை காலி பண்றதுக்கு முன்னாடி குப்பையை சுத்தம் பண்ற மாதிரி. Object அழியறதுக்கு முன்னாடி நடக்கும்.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Code-ல எப்படி use ஆகுதுன்னு பாரு:

```java
final int MAX = 100; // Value cannot change

try {
    int data = 10 / 0;
} finally {
    System.out.println("This always runs!"); // Cleanup
}

// Object class method (Deprecated in Java 9)
protected void finalize() throws Throwable {
    System.out.println("Object is getting garbage collected");
}
```

`final` keyword-ஐ variable, method, class மூணுக்குமே use பண்ணலாம்.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Feature | `final` | `finally` | `finalize()` |
|--------|----------|----------|----------|
| Type | Keyword | Block | Method |
| Used with | Classes, Methods, Variables | try-catch blocks | Objects |
| Purpose | Restriction / Immutability | Cleanup resources | Cleanup before GC |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Interview-ல 'System.exit(0) call பண்ணா finally block execute ஆகுமா?' ன்னு கேப்பாங்க. ஆகாது! JVM-ஏ shutdown ஆகுறதால finally run ஆகாது. அதே மாதிரி `finalize()` method Java 9-ல இருந்து deprecated ஆகிடுச்சு.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Production-ல `finally` block ரொம்ப முக்கியம். DB connections, File streams எல்லாம் properly close பண்ண `finally` தான் use பண்ணுவோம். `finalize()`-ஐ நம்பி எப்பவும் cleanup code எழுத கூடாது, ஏன்னா GC எப்போ run ஆகும்னு சொல்ல முடியாது.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) IMAP connection open பண்ணி mail படிச்சதுக்கு அப்புறம், error வந்தாலும் சரி வரலனாலும் சரி, connection-ஐ `finally` block-ல தான் close பண்றோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Resource management-க்கு `finalize`-ஐ use பண்றது ரொம்ப bad practice. அதுக்கு பதிலா Java 7-ல வந்த `try-with-resources` use பண்றது தான் architectural best practice.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Can a final class be subclassed?
*Answer:* முடியாது. ஒரு class `final` ஆக்கிட்டா, அத inherit பண்ண முடியாது. (Example: `String` class).

**Q:** Why is finalize() deprecated in Java 9?
*Answer:* Performance issues வரும், deadlocks வர chance இருக்கு, அப்புறம் execution guarantee கிடையாது. Cleaner API அண்ட் try-with-resources தான் இப்போ recommended.

---

## Quick Revision Summary

- `final` is a keyword to make entities unchangeable.
- `finally` is a block used for guaranteed execution (cleanup).
- `finalize()` is a deprecated method used for GC cleanup.
- Avoid using `finalize()`; use try-with-resources instead.
