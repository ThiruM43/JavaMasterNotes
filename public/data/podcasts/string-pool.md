# Java Interview Podcast — Episode: String Pool & Immutability
### Hosts: Mahi & Thiru

---

**Mahi:** Java-ல String ஏன் immutable அண்ட் String Pool-னா என்னனு explain பண்ணுங்க.

**Thiru:** கண்டிப்பா. **Immutability** [மாற்ற முடியாத தன்மை] னா ஒரு தடவ String object create பண்ணிட்டா அதோட value-ஐ மாத்த முடியாது. **String Pool** [memory cache] அப்படிங்கறது Heap memory-ல இருக்கிற ஒரு special area, அங்க String literals-ஐ cache பண்ணி வெச்சிருப்பாங்க memory save பண்ண.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** String Pool-ஐ ஒரு library-னு நினைச்சிக்கோங்க. ஒருத்தர் "Harry Potter" book கேட்டா புதுசா print பண்ணாம, library-ல இருக்கிற book-ஐயே தருவாங்க (String literal). ஆனா "New Harry Potter" (`new String()`) னு explicit-ஆ கேட்டா, புது book print பண்ணி தருவாங்க.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Memory level-ல எப்படி இருக்குன்னு பாரு:

```java
String s1 = "Java"; // Goes to String Pool
String s2 = "Java"; // Refers to the same object in Pool
String s3 = new String("Java"); // Creates a new object in Heap

System.out.println(s1 == s2); // true
System.out.println(s1 == s3); // false
```

`s1` அண்ட் `s2` ஒரே object-ஐ point பண்ணுது. `s3` வேற object.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | String Literal (`""`) | `new String()` |
|--------|----------|----------|
| Memory Location | String Pool (Inside Heap) | Heap Memory |
| Duplicate Objects | Reused from Pool | Always creates new object |
| Comparison (`==`) | Can return true for same text | Returns false |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** `intern()` method பத்தி கேப்பாங்க. `s3.intern()` call பண்ணா, Heap-ல இருக்கிற String-ஓட value-ஐ String Pool-ல check பண்ணி, அங்க இருக்கிற reference-ஐ return பண்ணும். அப்புறம் Java 8-க்கு அப்புறம் String Pool PermGen-ல இருந்து Heap-க்கு மாறிடுச்சு.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Production-ல நிறைய String manipulation (loop-ல concat) பண்ணா, நிறைய dead String objects create ஆகி Garbage Collection (GC) overhead அதிகமாகும். அதனால தான் `StringBuilder` or `StringBuffer` use பண்ண சொல்றாங்க.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க HL7/FHIR payloads எல்லாம் huge string-ஆ தான் handle பண்றோம். Memory issues வராம இருக்க, JSON processing-க்கு Jackson streams use பண்றோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Security-க்காக தான் String immutable ஆக்கிருக்காங்க. Database URL, username, password எல்லாம் String-ல தான் pass பண்றோம். அது mutable-ஆ இருந்தா, middle-ல யாராவது மாத்திட முடியும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Why is String immutable in Java?
*Answer:* Security, caching (String Pool), thread-safety, அப்புறம் hashcode caching-க்காக தான் String immutable-ஆ இருக்கு.

**Q:** What is the difference between StringBuffer and StringBuilder?
*Answer:* StringBuffer thread-safe (synchronized), ஆனா slow. StringBuilder thread-safe கிடையாது, ஆனா ரொம்ப fast. Multi-threading இல்லனா StringBuilder தான் use பண்ணனும்.

---

## Quick Revision Summary

- Strings are immutable for security and pooling.
- String Pool saves memory by reusing literals.
- Use `new String()` only when absolutely necessary.
- Use `StringBuilder` for concatenation in loops.
