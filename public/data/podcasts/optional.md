# Java Interview Podcast — Episode: Optional & anti-patterns
### Hosts: Mahi & Thiru

---

**Mahi:** Optional பத்தி சொல்லுங்க, இது `NullPointerException`-ஐ முழுசா தடுத்துடுமா?

**Thiru:** கண்டிப்பா Mahi. **Optional** [null-safe container] Java 8-ல கொண்டு வந்தாங்க. இது `NullPointerException`-ஐ முழுசா தடுக்காது, ஆனா ஒரு value இருக்கா இல்லையான்னு explicitly சொல்லுது. இது ஒரு container object.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு gift box-ஐ யோசிங்க. அதுக்குள்ள gift இருக்கலாம், இல்லாமலும் இருக்கலாம். நீங்க box-ஐ open பண்றதுக்கு முன்னாடி check பண்ணுவீங்க. Optional-ம் அதே மாதிரிதான். Value இருக்கலாம் இல்ல `empty` ஆக இருக்கலாம்.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Optional உள்ள ஒரு reference variable வச்சிருக்கு. `Optional.of()` use பண்ணா null allow பண்ணாது. `Optional.ofNullable()` use பண்ணா null வந்தா empty Optional-ஐ return பண்ணும்.

```java
String name = null;
Optional<String> optionalName = Optional.ofNullable(name);

// Safe way to get value
String result = optionalName.orElse("Default Name");
System.out.println(result);
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Traditional Null Check | Optional |
|--------|------------------------|----------|
| Explicitness | Implicit (often forgotten) | Explicit return type forces check |
| Method chaining | Hard to chain | Supports `map`, `flatMap`, `filter` |
| Performance | Zero overhead | Small object creation overhead |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** `Optional.get()`-ஐ value இருக்கான்னு check பண்ணாம (`isPresent()`) direct-ஆ call பண்றது தப்பு, `NoSuchElementException` வரும். அப்புறம் `Optional`-ஐ method arguments-ல pass பண்றது ஒரு anti-pattern.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** `Optional`-ஐ Class level fields-ஆ use பண்ணக் கூடாது. ஏன்னா Optional is not `Serializable`. இது return types-க்கு மட்டும் தான் use பண்ணனும். நிறைய objects create ஆகுறதால memory footprint அதிகமாகலாம்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) database repositories-ல இருந்து data fetch பண்ணும்போது (e.g., `findById`) Optional தான் return பண்ணுவோம். அது value இல்லனா `orElseThrow()` யூஸ் பண்ணி Custom Exception throw பண்ண வசதியா இருக்கு.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Collections-ஐ return பண்ணும்போது Optional use பண்ணக் கூடாது. Empty list `Collections.emptyList()` return பண்றது தான் best practice. Optional of Optional (`Optional<Optional<T>>`) வராம பாத்துக்கணும், அங்க `flatMap` use பண்ணனும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** What is the difference between `orElse()` and `orElseGet()`?
*Answer:* `orElse()` எப்பவும் execute ஆகும், value இருந்தாலும் சரி, இல்லனாலும் சரி. ஆனா `orElseGet()` Optional empty-ஆ இருந்தா மட்டும் தான் `Supplier`-ஐ invoke பண்ணும் (lazy execution).

**Q:** Why is passing Optional as a parameter considered an anti-pattern?
*Answer:* Method signature-ஐ complex ஆக்கும். Caller `Optional.empty()` இல்ல `Optional.of(value)` create பண்ணி pass பண்ணனும். அதுக்கு பதில் overloaded methods எழுதுறது பெட்டர்.

---

## Quick Revision Summary

- Optional is meant primarily as a return type to indicate absence of a value.
- Avoid calling `.get()` without checking `.isPresent()`.
- Use `.orElse()`, `.orElseGet()`, or `.orElseThrow()` instead.
- Do not use Optional for fields or method arguments.
- Never return Optional for collections; return an empty collection instead.