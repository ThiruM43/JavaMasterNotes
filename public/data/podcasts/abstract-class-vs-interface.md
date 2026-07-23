# Java Interview Podcast — Episode: Abstract class vs Interface
### Hosts: Mahi & Thiru

---

**Mahi:** Abstract class அண்ட் Interface ரெண்டுமே abstraction-க்கு தான் use பண்றோம். இதுல என்ன வித்தியாசம்?

**Thiru:** நல்ல கேள்வி Mahi. **Abstract class** [partial abstraction பண்றது] சில methods-ஐ implement பண்ணியும், சிலதை பண்ணாமலும் வெச்சிக்கலாம். ஆனா **Interface** [100% contract-ஐ define பண்றது] (Java 8-க்கு முன்னாடி) methods-க்கு implementation கொடுக்க முடியாது.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு வீடு கட்டுறதை (Building a house) வெச்சிக்கலாம். 
Interface அப்படிங்கறது approved blueprint மாதிரி. அதுல dimensions அண்ட் layout மட்டும் தான் இருக்கும். 
Abstract class அப்படிங்கறது partially built house மாதிரி. அதுல foundation இருக்கும், ஆனா paint அண்ட் tiles நீங்க தான் decide பண்ணனும்.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Java-ல `abstract` keyword அண்ட் `interface` keyword வெச்சி define பண்ணுவோம்.

```java
interface Vehicle {
    void start(); // implicit public abstract
}

abstract class Engine {
    abstract void run();
    void stop() { System.out.println("Stopped"); } // Concrete method
}
```

Interface-ல state (instance variables) maintain பண்ண முடியாது, ஆனா abstract class-ல முடியும்.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Abstract Class | Interface |
|--------|----------|----------|
| Multiple Inheritance | Not Supported | Supported |
| State Variables | Can have instance variables | Only static final constants |
| Constructors | Has constructor | No constructor |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Interview-ல 'Can abstract class have constructor?' ன்னு கேப்பாங்க. கண்டிப்பா இருக்கலாம். Child class object create ஆகும்போது parent abstract class-ஓட constructor run ஆகும். அப்புறம் Java 8-க்கு அப்புறம் Interface-ல default methods கொடுக்கலாம், அதனால 100% abstraction concept மாறிடுச்சு.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Production-ல interface changes பண்றது கஷ்டம், ஏன்னா அத implement பண்ண எல்லா class-உம் break ஆகும். அதனால தான் Java 8-ல `default` methods கொண்டு வந்தாங்க. Backward compatibility maintain பண்றதுக்கு இது ரொம்ப use ஆகுது.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க external system integration-க்கு (IMAP servers) Interfaces தான் use பண்றோம். ஆனா common authentication logic-ஐ ஒரு Abstract class-ல வெச்சிருக்கோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Architect-ஆ யோசிக்கும்போது 'Program to an interface, not an implementation' அப்படிங்கறது ரொம்ப முக்கியம். Future-ல implementation மாறினா கூட code break ஆகாது.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Can an interface implement another interface?
*Answer:* இல்ல, ஒரு interface இன்னொரு interface-ஐ `extends` தான் பண்ண முடியும், `implements` பண்ண முடியாது.

**Q:** Why do interfaces allow default methods in Java 8?
*Answer:* Existing code break ஆகாம புது methods-ஐ interfaces-ல add பண்றதுக்கு தான் `default` methods introduce பண்ணாங்க.

---

## Quick Revision Summary

- Interface is a strict contract.
- Abstract class allows code sharing (partial implementation).
- Java 8 interfaces support default and static methods.
- A class can implement multiple interfaces but extend only one class.
