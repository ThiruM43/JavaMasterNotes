# Java Interview Podcast — Episode: Nested & Inner Classes
### Hosts: Mahi & Thiru

---

**Mahi:** Java-ல Nested Classes அண்ட் Inner Classes பத்தி explain பண்ண முடியுமா? இது எதுக்கு use ஆகுது?

**Thiru:** கண்டிப்பா Mahi. ஒரு class-க்குள்ள இன்னொரு class-ஐ define பண்றது தான் **Nested Classes** [class inside class]. இதுல ரெண்டு type இருக்கு: `static` ஆக இருந்தா Static Nested Class. `non-static` ஆக இருந்தா **Inner Class**. Logical-ஆ related ஆன classes-ஐ ஒன்னா வெக்க இது help பண்ணும்.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு University அப்புறம் Department-ஐ எடுத்துக்கலாம்.
University ஒரு Outer Class. 
அதுக்குள்ள இருக்கிற Computer Science Department ஒரு Inner Class. University இல்லாம Department-க்கு தனி identity கிடையாது. Outer class-ஓட resources-ஐ Inner class ஈஸியா access பண்ணலாம்.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Code-ல எப்படி இருக்கும்னு பாரு:

```java
class Outer {
    private int outerData = 10;
    
    class Inner { // Non-static (Inner class)
        void show() { System.out.println(outerData); } // Accesses private member
    }
    
    static class StaticNested { // Static Nested Class
        void display() { /* Cannot access outerData */ }
    }
}
```

Inner class-க்கு outer class-ஓட object reference தேவை.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Feature | Inner Class (Non-static) | Static Nested Class |
|--------|----------|----------|
| Access to Outer members | Can access all (even private) | Can access only static members |
| Object Creation | Needs Outer class instance | Independent of Outer class instance |
| Memory Leak Risk | High (Holds implicit reference) | Low |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Interview-ல 'Anonymous Inner Class'-னா என்னனு கேப்பாங்க. Name இல்லாத class. On-the-fly-ல ஒரு interface-ஐ implement பண்ணி object create பண்ண use ஆகும் (e.g., Runnable). Java 8-க்கு அப்புறம் Lambda expressions இத replace பண்ணிடுச்சு.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Production-ல Builder Pattern எழுதும்போது Static Nested class தான் use பண்ணுவோம். ஏன்னா Builder-க்கு outer class-ஓட instance தேவையில்லை.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) FHIR models-ஐ build பண்ணும்போது, `Patient.Builder` னு static nested classes தான் use பண்றோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Encapsulation-ஐ increase பண்ண nested classes நல்லது. ஆனா Non-static inner classes-ஐ ஜாக்கிரதையா use பண்ணனும், ஏன்னா அது outer class-ஓட reference-ஐ hold பண்றதால Garbage collection நடக்கும்போது Memory leaks வர chance இருக்கு.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** How to instantiate an Inner class?
*Answer:* `Outer out = new Outer(); Outer.Inner in = out.new Inner();` னு outer object வழியா தான் create பண்ண முடியும்.

**Q:** What is a Local Inner Class?
*Answer:* ஒரு method-க்குள்ள define பண்ற class தான் Local Inner Class. அதோட scope அந்த method-க்குள்ள மட்டும் தான் இருக்கும்.

---

## Quick Revision Summary

- Nested classes group logically related classes.
- Inner class (non-static) has access to outer class private members.
- Static nested class does not need an outer class instance.
- Use static nested classes for Builder patterns to avoid memory leaks.
