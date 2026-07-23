# Java Interview Podcast — Episode: Comparable vs Comparator
### Hosts: Mahi & Thiru

---

**Mahi:** இன்னைக்கு நாம Comparable vs Comparator பத்தி பேசலாம். Objects-ஐ sort பண்ணனும்னா இதை தான் use பண்ணனும், ஆனா ரெண்டுக்கும் என்ன difference?

**Thiru:** கண்டிப்பா Mahi. **Comparable** [object-க்கு natural sorting order-ஐ குடுக்க use ஆகும்], **Comparator** [object-க்கு custom sorting order-ஐ குடுக்க use ஆகும்].

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு school students list-ஐ நினைச்சுக்கோங்க. School register-ல எப்பவுமே Roll Number வச்சு தான் sort பண்ணிருப்பாங்க (இது Natural Order - Comparable). ஆனா திடீர்னு PT master வந்து Height வச்சு sort பண்ண சொல்றார், இல்ல Marks வச்சு sort பண்ண சொல்றார் (இது Custom Order - Comparator).

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** `Comparable` interface-ல `compareTo()` method இருக்கும். அதை அந்த class-லேயே implement பண்ணனும். `Comparator` interface-ல `compare()` method இருக்கும். அதை தனியா ஒரு class-ல implement பண்ணனும்.

```java
// Comparable
public class Student implements Comparable<Student> {
    public int compareTo(Student s) {
        return this.rollNo - s.rollNo;
    }
}

// Comparator
Comparator<Student> byName = (s1, s2) -> s1.name.compareTo(s2.name);
Collections.sort(list, byName);
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Comparable | Comparator |
|--------|------------|------------|
| Package | `java.lang` | `java.util` |
| Method | `compareTo(Object o)` | `compare(Object o1, Object o2)` |
| Modification | Needs changes to original class | No changes to original class |
| Order Type | Natural ordering (One sequence) | Customized ordering (Multiple sequences) |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** `compareTo` method-ல return type என்னன்னு கேப்பாங்க. அது negative, zero, or positive int return பண்ணனும். தப்பா subtraction logic எழுதுனா integer overflow ஆக வாய்ப்பு இருக்கு. `Integer.compare(a, b)` use பண்றது தான் safe.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Third-party library class-ஐ sort பண்ணனும்னா, அதோட source code-ஐ modify பண்ண முடியாது. அதனால Comparable use பண்ண முடியாது. அந்த மாதிரி time-ல Comparator தான் ஒரே வழி.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) Patient records-ஐ சில நேரம் Age வச்சும், சில நேரம் Name வச்சும் UI-ல sort பண்ணி காட்டணும். அதுக்கு நாங்க Java 8-ல வந்த Comparator lambda expressions-ஐ use பண்றோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** `equals()` method-ம் `compareTo()` method-ம் consistent-ஆ இருக்கணும். அதாவது `a.equals(b)` true-ஆ இருந்தா, `a.compareTo(b)` 0 return பண்ணனும். இல்லனா SortedSet மாதிரி collections-ல bugs வரும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Java 8-ல Comparator-ல என்ன புதுசா வந்துச்சு?
*Answer:* `Comparator.comparing()`, `thenComparing()` மாதிரியான default methods வந்துச்சு. Chaining ரொம்ப ஈஸியா பண்ணலாம்.

**Q:** String class Comparable-ஐ implement பண்ணுதா?
*Answer:* ஆமா, String class default-ஆவே Comparable implement பண்ணி dictionary order-ல sort ஆகும்.

---

## Quick Revision Summary

- Comparable modifies the class, provides natural sorting (`compareTo`).
- Comparator is external, provides multiple sorting logic (`compare`).
- Always ensure `compareTo` is consistent with `equals`.
- Use Java 8 `Comparator.comparing()` for clean code.
