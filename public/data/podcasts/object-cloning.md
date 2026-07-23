# Java Interview Podcast — Episode: Object Cloning (shallow vs deep)
### Hosts: Mahi & Thiru

---

**Mahi:** Java-ல Object Cloning-னா என்ன? Shallow copy அண்ட் Deep copy-க்கு என்ன வித்தியாசம்?

**Thiru:** ஒரு object-ஓட exact duplicate-ஐ create பண்றது தான் Cloning Mahi. **Shallow Copy** [மேலோட்டமான copy] object-ஐ copy பண்ணும் ஆனா உள்ள இருக்கிற references-ஐ copy பண்ணாது. **Deep Copy** [முழுமையான copy] object அப்புறம் அதுக்குள்ள இருக்கிற எல்லா sub-objects-ஐயும் புதுசா create பண்ணி copy பண்ணும்.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** நீ ஒரு document-ஐ xerox எடுக்குற.
**Shallow Copy:** Xerox copy-ல ஒரு web link இருக்கு. அந்த link original-லயும் அதே website-க்கு தான் போகும், xerox-லயும் அதே website-க்கு தான் போகும். Website-ல மாத்துனா ரெண்டுக்கும் effect ஆகும்.
**Deep Copy:** நீ அந்த website content-ஐயும் பிரிண்ட் எடுத்து தனி file-ஆ வெச்சிருக்க. ஒன்ன மாத்துனா இன்னொன்னு affect ஆகாது.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Cloneable interface use பண்ணி `clone()` call பண்ணலாம்.

```java
class Address { String city; }
class Person implements Cloneable {
    String name;
    Address addr;
    protected Object clone() throws CloneNotSupportedException {
        // Default is shallow copy
        return super.clone();
    }
}
```

Deep copy வேணும்னா நாம manually `addr` object-ஐயும் clone பண்ணனும்.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Shallow Copy | Deep Copy |
|--------|----------|----------|
| Object References | Copied as references (Shared) | New objects are created (Independent) |
| Performance | Fast | Slow (creates multiple objects) |
| Default Java `clone()` | Creates Shallow Copy | Requires manual implementation |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Interview-ல `Cloneable` interface பத்தி கேப்பாங்க. அது ஒரு 'Marker Interface' (உள்ள methods இருக்காது). அதை implement பண்ணாம `clone()` call பண்ணா `CloneNotSupportedException` வரும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Production-ல Java-ஓட default `clone()` method-ஐ யாரும் use பண்றது இல்ல, ஏன்னா அது ரொம்ப problematic. Serialization use பண்ணி deep copy பண்ணலாம், இல்லனா Jackson JSON, Gson libraries வெச்சி object-ஐ JSON ஆக்கி திரும்ப object ஆக்கலாம்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) FHIR objects-ஐ process பண்ணும்போது old state-ஐ maintain பண்ண, Jackson library use பண்ணி JSON convert பண்ணி deep copy எடுக்குறோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Architects 'Copy Constructors' or 'Factory Methods' use பண்ண தான் prefer பண்ணுவாங்க. `clone()` method design flaw-னு Joshua Bloch (Effective Java author) சொல்லிருக்காரு.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** How to achieve deep cloning without using clone()?
*Answer:* Serialization & Deserialization use பண்ணலாம், இல்லனா Copy constructor எழுதலாம், இல்லனா JSON library (Jackson/Gson) use பண்ணலாம்.

**Q:** What happens to final fields during cloning?
*Answer:* Shallow copy-ல problem இல்ல, ஆனா Deep copy பண்ணும்போது final fields-ஐ reassign பண்ண முடியாது, அது ஒரு பெரிய disadvantage.

---

## Quick Revision Summary

- Shallow copy shares object references.
- Deep copy creates entirely new, independent objects.
- Java's default `clone()` method provides shallow copy.
- Avoid `clone()`; use copy constructors or JSON serialization.
