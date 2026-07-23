# Java Interview Podcast — Episode: == vs equals() vs hashCode()
### Hosts: Mahi & Thiru

---

**Mahi:** Object comparison-ல `==`, `equals()` அப்புறம் `hashCode()` இது மூணுக்கும் உள்ள வித்தியாசம் என்ன?

**Thiru:** ரொம்ப முக்கியமான topic Mahi. **== operator** [reference comparison] ரெண்டு object-உம் memory-ல ஒரே இடத்துல இருக்கான்னு check பண்ணும். **equals() method** [content comparison] ரெண்டு object-ஓட value ஒன்னா இருக்கான்னு check பண்ணும். **hashCode()** [integer representation] ஒரு object-ஐ HashMap மாதிரி collections-ல store பண்ண use ஆகும்.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ரெண்டு பேர் கிட்ட ஒரே மாதிரி iPhone 15 இருக்குன்னு வெச்சிக்கலாம்.
`==` check பண்ணா false வரும், ஏன்னா அது ரெண்டும் வேற வேற phones (different objects).
`equals()` check பண்ணா true வரும், ஏன்னா ரெண்டும் ஒரே model, ஒரே color (same content).
`hashCode()` அப்படிங்கறது phone-ஓட IMEI number மாதிரி, அத வெச்சி ஈஸியா phone-ஐ identify பண்ணலாம்.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Object class-ல `equals()` default-ஆ `==` மாதிரி தான் work ஆகும். நாம தான் override பண்ணனும்.

```java
class Employee {
    int id;
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        return id == ((Employee) o).id;
    }
    @Override
    public int hashCode() { return Objects.hash(id); }
}
```

Override பண்ணும்போது ரெண்டையும் சேர்த்து தான் பண்ணனும்.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Feature | `==` | `equals()` | `hashCode()` |
|--------|----------|----------|----------|
| Type | Operator | Method | Method |
| Checks for | Memory Reference | Object Value/Content | Integer Hash Value |
| Override | Cannot override | Should be overridden | Must be overridden with equals |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Interview-ல 'equals override பண்ணிட்டு hashCode override பண்ணலனா என்ன ஆகும்?' ன்னு கேப்பாங்க. Hash-based collections (HashMap, HashSet) ஒழுங்கா work ஆகாது. ரெண்டு objects equals-ஆ இருந்தாலும், different hash buckets-ல store ஆயிடும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Production-ல HashMap keys-ஆ custom objects use பண்ணும்போது, equals & hashCode தப்பா இருந்தா memory leaks வரும், data-ஐ retrieve பண்ணவே முடியாது. Duplicate keys store ஆயிடும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) FHIR Message IDs-ஐ HashSet-ல track பண்ணுவோம், duplicate processing-ஐ avoid பண்ண. அங்க Message object-ஓட ID-ஐ வெச்சி equals அண்ட் hashCode override பண்ணிருக்கோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Architectural level-ல, immutable objects-ஐ (String, Integer) Map keys-ஆ use பண்றது தான் best practice. Custom objects use பண்ணா, அதோட state modify ஆகாம பாத்துக்கணும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** What is the contract between equals and hashCode?
*Answer:* ரெண்டு objects `equals()` படி true-னா, அதோட `hashCode()` கண்டிப்பா ஒன்னா இருக்கணும். ஆனா `hashCode()` ஒன்னா இருந்தா, `equals()` true-ஆ இருக்கணும்னு அவசியம் இல்ல (hash collision).

**Q:** What happens if hashCode always returns 1?
*Answer:* HashMap-ல store பண்ணலாம், ஆனா எல்லா objects-உம் ஒரே bucket-ல store ஆகி, linked list மாதிரி ஆயிடும். Performance O(1) ல இருந்து O(n)-க்கு குறைஞ்சிடும்.

---

## Quick Revision Summary

- `==` compares references.
- `equals()` compares values.
- Always override `hashCode` when overriding `equals`.
- Hash collisions reduce HashMap performance.
