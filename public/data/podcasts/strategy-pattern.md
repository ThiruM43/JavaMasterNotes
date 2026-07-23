# Java Interview Podcast — Episode: Strategy Pattern
### Hosts: Mahi & Thiru

---

**Mahi:** இன்னைக்கு நாம Strategy Pattern பத்தி பேசலாம். இது என்ன pattern?

**Thiru:** கண்டிப்பா Mahi. Strategy Pattern ஒரு முக்கியமான **Design Pattern** [மென்பொருள் வடிவமைப்பு முறை]. இது code-ஐ reusable மற்றும் maintainable ஆக மாற்றுவதற்கு ரொம்ப useful.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** Google Maps-ல travel பண்ணும்போது Car, Bike, Walk-னு route மாத்துறோம்ல, destination ஒண்ணு தான் ஆனா strategy (வழி) வேற. Runtime-ல மாத்திக்கலாம். இதுல எல்லாமே ஒரு குறிப்பிட்ட வழியில நடக்கும், அதனால எந்த confusion-உம் வராது.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Java-ல இது implement பண்றதுக்கு class design ரொம்ப முக்கியம். இந்த code block-ஐ பாரு:
```java
public interface PaymentStrategy { void pay(int amount); }
public class CreditCardStrategy implements PaymentStrategy { 
    public void pay(int amount) { System.out.println("Paid with CC"); } 
}
public class PayPalStrategy implements PaymentStrategy { 
    public void pay(int amount) { System.out.println("Paid with PayPal"); } 
}
public class ShoppingCart {
    public void checkout(int amount, PaymentStrategy strategy) {
        strategy.pay(amount);
    }
}
```
இப்படித் தான் internally object creation அல்லது behavior control ஆகுது. இது ரொம்ப effective ஆன வழி.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Strategy | State |
|--------|----------|----------|
| Intent | Change behavior based on algorithm | Change behavior based on internal state |
| Client Knowledge | Client chooses the strategy | State changes automatically based on context |
| Scope | Alternative ways to do a task | Object behaving differently in different phases |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Client-க்கு எல்லா strategies பத்தியும் தெரிஞ்சிருக்கணும். நிறைய strategies ஆனா class explosion ஆகும். Factory pattern கூட சேர்த்து use பண்ணலாம். நிறைய பேரு இதை miss பண்ணிடுவாங்க, ஆனா senior level interview-ல இது ரொம்ப முக்கியம்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Spring-ல @Qualifier மற்றும் List of interfaces வச்சு runtime-ல strategy choose பண்ணலாம். Memory-ல எல்லா strategy objects-ம் load ஆகியிருக்கும். அதனால monitoring மற்றும் memory profiling ரொம்ப அவசியம்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க report generation-க்கு XML, JSON-னு ரெண்டு format-க்கும் Strategy pattern use பண்றோம். இது system stability-ஐ ரொம்பவே இம்ப்ரூவ் பண்ணிருக்கு.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Open-Closed principle-ஐ achieve பண்ண இது ரொம்ப முக்கியம். If-else statements அதிகமா இருந்தா அத replace பண்ண Strategy pattern use பண்ணனும். Design principles-ஐ எப்பவுமே priority-ஆ வச்சு யோசிக்கணும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** How to manage too many strategy classes?
*Answer:* Group them into a registry or use a factory to provide the correct strategy dynamically.

**Q:** Can Strategy have state?
*Answer:* Preferably no. Strategies should ideally be stateless and act as singletons.

---

## Quick Revision Summary

- Strategy Pattern provides a clean way to solve recurring design problems.
- Always consider edge cases like thread safety and memory leaks.
- Real-world production implementation always varies slightly from textbook examples.
- Always remember the core intent of Strategy Pattern before applying it.
- Practice the Java implementation thoroughly.
- Understand the pros and cons compared to alternatives.
- Realize how it fits into the broader software architecture.
