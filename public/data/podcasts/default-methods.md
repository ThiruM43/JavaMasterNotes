# Java Interview Podcast — Episode: Default & Static methods in interfaces
### Hosts: Mahi & Thiru

---

**Mahi:** Java 8-ல Interfaces-ல default and static methods ஏன் கொண்டு வந்தாங்க?

**Thiru:** கண்டிப்பா Mahi. **Default methods** [backward compatibility feature] interface-ல method implementation எழுத allow பண்ணுது. பழைய classes break ஆகாம, புது methods-ஐ interface-ல add பண்ண இது ரொம்ப முக்கியம்.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு apartment association rule book-ஐ அப்டேட் பண்றாங்க. புதுசா "EV charging use பண்ணலாம்" அப்படின்னு ஒரு default rule add பண்றாங்க. இதுக்காக பழைய வீடுகள் எல்லாம் தங்களோட plan-ஐ மாத்த தேவையில்லை. ஆனா வேணும்னா அவங்க வீட்ல charge பண்ணிக்கலாம்.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** `default` keyword use பண்ணி interface-க்குள்ளயே method body எழுதலாம். Class implement பண்ணும்போது இந்த method-ஐ override பண்ணலாம் இல்ல அப்படியே use பண்ணலாம். Static methods interface-ஐ விட்டு வெளிய வராது, instance-ஆல் call பண்ண முடியாது.

```java
public interface Vehicle {
    void start(); // Abstract

    default void turnAlarmOn() {
        System.out.println("Turning the vehicle alarm on.");
    }
    
    static int getHorsePower(int rpm, int torque) {
        return (rpm * torque) / 5252;
    }
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Default Method | Static Method in Interface |
|--------|----------------|----------------------------|
| Inheritance | Inherited by implementing classes | Not inherited |
| Overriding | Can be overridden | Cannot be overridden |
| Invocation | Using instance of implementing class | Using `InterfaceName.methodName()` |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Diamond Problem! ஒரு class ரெண்டு interface-ஐ implement பண்ணுது, ரெண்டுலயும் ஒரே signature-ல default method இருந்தா compiler error வரும். நாம explicitly எந்த interface method வேணும்னு சொல்லணும் (`InterfaceName.super.methodName()`).

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** நிறைய default methods-ஐ interface-ல add பண்ணா, அது abstract class மாதிரியே behave பண்ண ஆரம்பிச்சுடும். Interface-ஓட original purpose (contract defining) spoil ஆகாம பாத்துக்கணும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) API clients-க்கு common configurations-ஐ default methods வழியா கொடுப்போம், so புது clients பழைய code-ஐ break பண்ணாம easily integrate பண்ண முடியும்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Default methods-ஐ framework level upgrades-க்கு மட்டும் use பண்றது நல்லது. Business logic-ஐ interface-க்குள்ள கொண்டு வரக்கூடாது. Static methods-ஐ utility functions-க்கு use பண்ணலாம், separate utility classes-ஐ தவிர்க்கலாம்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Why not just use abstract classes instead of default methods?
*Answer:* Java-ல multiple inheritance of classes கிடையாது. ஆனா ஒரு class multiple interfaces-ஐ implement பண்ணலாம். Default methods allow adding new features without breaking existing implementations.

**Q:** Can we override `java.lang.Object` methods like `equals` or `hashCode` as default methods?
*Answer:* No, compile-time error வரும். `Object` class methods-ஐ default methods-ஆ override பண்ண Java allow பண்ணாது.

---

## Quick Revision Summary

- Default methods allow interfaces to have method implementations.
- Primary reason was to evolve interfaces (like `Collection`) without breaking backward compatibility.
- Static methods in interfaces are good for utility functions related to the interface.
- Multiple inheritance issues (Diamond problem) must be explicitly resolved by overriding.
- Cannot define default methods for `Object` class methods.