# Java Interview Podcast — Episode: Sealed Classes (Java 17+)
### Hosts: Mahi & Thiru

---

**Mahi:** Sealed Classes பத்தி சொல்லுங்க, இது Java 17-ல ஏன் கொண்டு வந்தாங்க?

**Thiru:** கண்டிப்பா Mahi. **Sealed Classes** [controlled inheritance] ஒரு class-ஐ யார் extend பண்ணலாம், யார் பண்ணக்கூடாது அப்படின்னு control பண்ண use ஆகுது. இது inheritance-ஐ restrict பண்ணி, domain model-ஐ ரொம்ப predictabe ஆக்குது.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு exclusive club-ஐ யோசிங்க. Member ஆகணும்னா, club-ல இருக்கிற list-ல உங்க பேரு இருக்கணும். Sealed class-ம் அதே மாதிரிதான், `permits` clause-ல எந்த classes allowed அப்படின்னு explicitly சொல்லணும். அவங்க மட்டும்தான் extend பண்ண முடியும்.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** `sealed` keyword use பண்ணி class/interface define பண்ணுவோம். `permits` use பண்ணி allowed subclasses-ஐ list பண்ணுவோம். Subclasses கண்டிப்பா `final`, `sealed`, இல்ல `non-sealed` ஆக இருக்கணும்.

```java
public sealed class Shape permits Circle, Square, Rectangle {
}

final class Circle extends Shape {
}

non-sealed class Square extends Shape {
}

sealed class Rectangle extends Shape permits TransparentRectangle {
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Final Class | Sealed Class | Regular Class |
|--------|-------------|--------------|---------------|
| Extensibility | Cannot be extended | Extended only by permitted classes | Extended by anyone |
| Security | Maximum | High | Low |
| Pattern Matching | Not needed | Exhaustiveness checking possible | Not exhaustive |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Permitted subclasses வேற package-ல இருக்கலாமான்னு கேப்பாங்க. இல்லை! Sealed class-ம் அதோட permitted subclasses-ம் ஒரே module-ல (இல்ல unnamed module-ஆ இருந்தா ஒரே package-ல) இருக்கணும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** நிறைய subclasses இருக்கும்போது `permits` clause ரொம்ப பெருசா மாறி maintain பண்ண கஷ்டமா இருக்கும். Domain clearly define ஆகி fixed hierarchy இருக்கும்போது மட்டும் இதை use பண்ணனும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) FHIR resource types (e.g., Patient, Condition, Observation) fixed. அதனால அந்த base interfaces-ஐ sealed ஆக்கிட்டு, specific implementations-ஐ மட்டும் permit பண்ணியிருக்கோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Sealed classes pattern matching (`switch` statements) கூட சேரும்போது ரொம்ப powerful. Compiler-க்கு எல்லா possible subclasses-ம் தெரியும், அதனால `default` case எழுத தேவையில்லை (Exhaustive matching).

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** What modifiers must a subclass of a sealed class have?
*Answer:* Subclass கண்டிப்பா `final` (no further extension), `sealed` (can be extended by its own permitted classes), அல்லது `non-sealed` (open for any extension) ஆக இருக்கணும்.

**Q:** Can an interface be sealed?
*Answer:* Yes, interfaces can also be sealed to restrict which interfaces/classes can extend or implement them.

---

## Quick Revision Summary

- Introduced as a standard feature in Java 17.
- Restricts which other classes or interfaces may extend or implement them.
- Uses the `sealed` and `permits` keywords.
- Subclasses must be declared as `final`, `sealed`, or `non-sealed`.
- Works perfectly with Pattern Matching in Switch (exhaustiveness).
- Sealed class and permitted subclasses must be in the same package/module.