# Java Interview Podcast — Episode: Adapter Pattern
### Hosts: Mahi & Thiru

---

**Mahi:** இன்னைக்கு நாம Adapter Pattern பத்தி பேசலாம். இது என்ன pattern?

**Thiru:** கண்டிப்பா Mahi. Adapter Pattern ஒரு முக்கியமான **Design Pattern** [மென்பொருள் வடிவமைப்பு முறை]. இது code-ஐ reusable மற்றும் maintainable ஆக மாற்றுவதற்கு ரொம்ப useful.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** நம்ம இந்தியா plug-ஐ US socket-ல குத்த முடியாது. அதுக்கு நடுவுல ஒரு travel adapter use பண்ணுவோம்ல? அதே concept தான். இதுல எல்லாமே ஒரு குறிப்பிட்ட வழியில நடக்கும், அதனால எந்த confusion-உம் வராது.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Java-ல இது implement பண்றதுக்கு class design ரொம்ப முக்கியம். இந்த code block-ஐ பாரு:
```java
public interface Target { void request(); }
public class Adaptee {
    public void specificRequest() { System.out.println("Specific req"); }
}
public class Adapter implements Target {
    private Adaptee adaptee;
    public Adapter(Adaptee adaptee) { this.adaptee = adaptee; }
    public void request() {
        adaptee.specificRequest(); // Translation
    }
}
```
இப்படித் தான் internally object creation அல்லது behavior control ஆகுது. இது ரொம்ப effective ஆன வழி.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Adapter | Bridge |
|--------|----------|----------|
| Intent | Make unrelated interfaces work together | Separate abstraction from implementation |
| Timing | Used after system is designed | Used during system design |
| Structure | Wraps an existing class | Creates a clean separation |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Two-way adapter create பண்றது கஷ்டம். Object adapter (Composition) vs Class adapter (Inheritance) -ல Object adapter தான் prefer பண்ணுவாங்க (Multiple inheritance Java-ல கிடையாது). நிறைய பேரு இதை miss பண்ணிடுவாங்க, ஆனா senior level interview-ல இது ரொம்ப முக்கியம்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Legacy systems-ஐ புது system கூட integrate பண்ணும்போது நிறைய adapters create பண்ண வேண்டி வரும். Performance overhead லேசா இருக்கும். அதனால monitoring மற்றும் memory profiling ரொம்ப அவசியம்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க பழைய legacy system-ல இருந்து வர்ற data-ஐ FHIR format-க்கு மாத்த Adapter pattern use பண்றோம். இது system stability-ஐ ரொம்பவே இம்ப்ரூவ் பண்ணிருக்கு.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Legacy code-ஐ touch பண்ணாம புது interface-க்கு மாத்த Adapter ரொம்ப useful. Anti-corruption layer implement பண்ண இது ஒரு நல்ல pattern. Design principles-ஐ எப்பவுமே priority-ஆ வச்சு யோசிக்கணும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Object Adapter vs Class Adapter?
*Answer:* Object uses composition (has-a) and is flexible. Class uses inheritance (is-a) and is restricted in Java to one class.

**Q:** Is Adapter similar to Decorator?
*Answer:* No, Decorator adds responsibility without changing interface. Adapter changes the interface to match what client expects.

---

## Quick Revision Summary

- Adapter Pattern provides a clean way to solve recurring design problems.
- Always consider edge cases like thread safety and memory leaks.
- Real-world production implementation always varies slightly from textbook examples.
- Always remember the core intent of Adapter Pattern before applying it.
- Practice the Java implementation thoroughly.
- Understand the pros and cons compared to alternatives.
- Realize how it fits into the broader software architecture.
