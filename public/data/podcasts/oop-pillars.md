# Java Interview Podcast — Episode: OOP Pillars & Trade-offs
### Hosts: Mahi & Thiru

---

**Mahi:** வணக்கம் Thiru! இன்னைக்கு Object Oriented Programming-ஓட Pillars பத்தி பேசலாம். இதுல என்ன முக்கியமா இருக்கு?

**Thiru:** கண்டிப்பா Mahi. Object Oriented Programming (OOP) நாலு முக்கியமான pillars-ஐ வெச்சி தான் இருக்கு. **Encapsulation** [data-வை hide பண்றது], **Inheritance** [code reusability-க்காக], **Polymorphism** [ஒரு object பல forms-ல behave பண்றது], அப்புறம் **Abstraction** [implementation-ஐ மறைச்சிட்டு feature-ஐ மட்டும் காட்டுறது].

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு Car-ஐ எடுத்துக்கலாம் Mahi. 
- Engine-ஐ bonnet உள்ள வெச்சி cover பண்றது Encapsulation.
- Steering அண்ட் accelerator மட்டும் கொடுத்துட்டு, engine internals-ஐ மறைக்கிறது Abstraction. 
- 'Vehicle' அப்படிங்கற பொதுவான class-ல இருந்து Car-ஐ உருவாக்குறது Inheritance. 
- வண்டியில accelerator மிதிக்கும்போது petrol car ஒரு மாதிரியும், EV ஒரு மாதிரியும் behave பண்றது Polymorphism.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Java-ல classes அண்ட் objects மூலமா தான் இதெல்லாம் நடக்குது. ஒரு example பாரு:

```java
class BankAccount {
    private double balance; // Encapsulation

    public void deposit(double amount) {
        if (amount > 0) balance += amount;
    }
}
```
இங்க `balance` variable-ஐ `private` ஆக்கிட்டு, method மூலமா மட்டும் access பண்றது தான் proper encapsulation.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Encapsulation | Abstraction |
|--------|----------|----------|
| Focus | Data Hiding | Implementation Hiding |
| How to achieve | Access Modifiers | Abstract classes, Interfaces |
| Usage | Security | Simplicity |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** நிறைய பேர் Abstraction அண்ட் Encapsulation-ஐ confuse பண்ணிப்பாங்க. Encapsulation-னா information hiding. Abstraction-னா detail hiding. 'Can we achieve 100% encapsulation?' ன்னு கேப்பாங்க. ஆமா, எல்லா fields-ஐயும் private ஆக்கிட்டா முடியும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Inheritance-ஐ ரொம்ப use பண்ணா 'Fragile Base Class' problem வரும். Base class-ல பண்ற சின்ன change, எல்லா child classes-ஐயும் break பண்ணிடும். அதனால தான் 'Favor Composition over Inheritance' அப்படின்னு சொல்லுவாங்க.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க FHIR resource creation-ஐ abstract பண்ணியிருக்கோம். `FhirMessageBuilder` interface வழியா தான் எல்லா builders-உம் interact பண்ணும். Internal implementation-ஐ encapsulate பண்ணிருக்கோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** System design பண்ணும்போது SOLID principles-ஐ கண்டிப்பா follow பண்ணனும். Liskov Substitution Principle (LSP) inheritance-ஐ எப்போ use பண்ணனும்னு define பண்ணுது.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Why is multiple inheritance not supported in Java classes?
*Answer:* Diamond problem வரும். ரெண்டு parent classes ஒரே method-ஐ வெச்சிருந்தா, child எதை inherit பண்ணனும்னு குழப்பம் வரும்.

**Q:** What is the difference between late binding and early binding?
*Answer:* Method overloading வந்து early binding (compile time). Method overriding வந்து late binding (run time).

---

## Quick Revision Summary

- Encapsulation hides data.
- Abstraction hides complex implementation details.
- Inheritance provides code reusability.
- Polymorphism allows objects to take multiple forms.
