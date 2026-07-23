# Java Interview Podcast — Episode: Overloading vs Overriding
### Hosts: Mahi & Thiru

---

**Mahi:** Polymorphism-ல Method Overloading அண்ட் Method Overriding-க்கு என்ன difference?

**Thiru:** ரெண்டும் method names-ஐ வெச்சி தான் work ஆகுது Mahi. **Method Overloading** [compile-time] ஒரே class-ல ஒரே method name, ஆனா different parameters வெச்சிருக்கிறது. **Method Overriding** [run-time] Parent class-ல இருக்கிற அதே method-ஐ, child class-ல அதே parameters வெச்சி புதுசா implement பண்றது.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** 
**Overloading:** ஒரு coffee shop-ல 'Coffee' னு கேக்கலாம், இல்ல 'Coffee with milk' னு கேக்கலாம். பேர் ஒன்னு தான், ஆனா ingredients (parameters) வேற.
**Overriding:** அப்பா ஒரு 'Business' பண்றாரு. பையன் அதே 'Business'-ஐ takeover பண்ணி, அவனுக்கு ஏத்த மாதிரி modern-ஆ மாத்தி பண்றான் (same name, same parameters, different implementation).

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Code-ல பாரு:

```java
class Calculator { // Overloading
    int add(int a, int b) { return a + b; }
    double add(double a, double b) { return a + b; }
}

class Animal { void sound() { System.out.println("Sound"); } }
class Dog extends Animal { // Overriding
    @Override
    void sound() { System.out.println("Bark"); }
}
```

Overloading compiler-க்கு தெரியும், Overriding runtime-ல தான் முடிவு பண்ணப்படும்.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Feature | Overloading | Overriding |
|--------|----------|----------|
| Location | Same Class | Parent and Child Class |
| Parameters | Must be different | Must be exactly the same |
| Binding | Early (Compile-time) | Late (Run-time) |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Interview-ல 'Return type மட்டும் மாத்தி overload பண்ண முடியுமா?' னு கேப்பாங்க. முடியாது. Compiler-க்கு எந்த method-ஐ call பண்ணனும்னு குழப்பம் வரும். Overriding-ல 'Covariant return type' use பண்ணலாம் (Parent class return type-ஓட child-ஐ return பண்ணலாம்).

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Overriding-ல `@Override` annotation கண்டிப்பா use பண்ணனும். இல்லனா typing mistake வந்தா புது method-ஆ ஆயிடும், bugs கண்டுபிடிக்க கஷ்டமா இருக்கும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) `NotificationService`-ஐ நாங்க override பண்ணி EmailNotification, SlackNotification னு வெச்சிருக்கோம் (Overriding).

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Overloading API design-ல ரொம்ப use ஆகும் (e.g., `String.valueOf()`). Overriding வந்து Strategy pattern, Template method pattern மாதிரி design patterns-க்கு base.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Can we override static methods?
*Answer:* இல்ல. Static methods class-க்கு சொந்தமானது. Child class-ல அதே name-ல static method எழுதுனா அது 'Method Hiding'.

**Q:** Can we overload the main() method?
*Answer:* கண்டிப்பா பண்ணலாம். ஆனா JVM `public static void main(String[] args)` method-ஐ தான் entry point-ஆ தேடும்.

---

## Quick Revision Summary

- Overloading happens in the same class with different parameters.
- Overriding happens in subclasses with the exact same signature.
- Overloading is compile-time polymorphism.
- Overriding is run-time polymorphism.
