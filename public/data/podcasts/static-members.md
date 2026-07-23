# Java Interview Podcast — Episode: Static members & blocks
### Hosts: Mahi & Thiru

---

**Mahi:** Java-ல `static` keyword-ஓட purpose என்ன? Static variables, methods அண்ட் blocks எப்படி work ஆகுது?

**Thiru:** நல்ல கேள்வி Mahi. **static** [class level] keyword-ஐ use பண்ணா, அது object-க்கு சொந்தமானது இல்ல, class-க்கே சொந்தமானது. **Static variables** [memory sharing] எல்லா objects-க்கும் காமனா இருக்கும். **Static methods** [utility] object create பண்ணாமலேயே call பண்ணலாம். **Static blocks** [initialization] class load ஆகும்போது ஒரே ஒரு தடவ execute ஆகும்.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு class-ல 50 students இருக்காங்கனு வெச்சிக்கலாம்.
ஒவ்வொரு student-க்கும் தனித்தனி notebook இருக்கும் (Instance variable).
ஆனா board (கரும்பலகை) ஒன்னு தான் இருக்கும். அதுல எழுதுறத எல்லா students-உம் பாக்கலாம் (Static variable). Board-ஐ access பண்ண student object தேவையில்லை, class-ல இருந்தா போதும்.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Static memory (Metaspace / Method area) ல store ஆகும்.

```java
class Counter {
    static int count = 0; // Shared across all instances

    static {
        System.out.println("Static block: Executes when class is loaded");
    }

    Counter() {
        count++;
    }
}
```

Object create பண்றதுக்கு முன்னாடியே class loading அப்போ static block run ஆகிடும்.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Instance Members | Static Members |
|--------|----------|----------|
| Scope | Belongs to Object | Belongs to Class |
| Memory | Heap memory (per object) | Method Area (shared) |
| Access | Needs object reference | Can access using Class name |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Interview-ல 'Static method-ல இருந்து non-static variable-ஐ access பண்ண முடியுமா?' ன்னு கேப்பாங்க. முடியாது. ஏன்னா static method object creation-க்கு முன்னாடியே exist ஆகும், ஆனா non-static variable object create ஆனா தான் memory-க்கே வரும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Production-ல ரொம்ப static variables use பண்றது memory leaks-க்கு வழிவகுக்கும், ஏன்னா class unload ஆகுற வரைக்கும் garbage collect ஆகாது. Multi-threading environment-ல static variables thread-safe கிடையாது.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க utility classes-ல (DateUtils, FhirParserUtils) methods-ஐ static-ஆ வெச்சிருக்கோம். ஏன்னா அதுக்கு state தேவையில்லை.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Utility functions-க்கு static methods நல்லது. ஆனா System design-ல Singleton pattern-ஐ implement பண்ண static தான் use பண்ணுவோம். Spring boot-ல beans use பண்றதால static-ஓட usage கம்மியாகிடுச்சு.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Can we override static methods in Java?
*Answer:* இல்ல, override பண்ண முடியாது. Child class-ல அதே method-ஐ define பண்ணா அதுக்கு பேரு 'Method Hiding', overriding கிடையாது.

**Q:** When are static blocks executed?
*Answer:* Classloader class-ஐ memory-ல load பண்ணும்போது, object create ஆகுறதுக்கு முன்னாடியே execute ஆகும்.

---

## Quick Revision Summary

- `static` belongs to the class, not the object.
- Static block runs once during class loading.
- Static methods cannot access non-static members directly.
- Overuse of static can lead to memory leaks.
