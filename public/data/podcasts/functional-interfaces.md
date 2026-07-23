# Java Interview Podcast — Episode: Functional Interfaces
### Hosts: Mahi & Thiru

---

**Mahi:** Functional Interfaces பத்தி இன்னைக்கு பேசலாமா?

**Thiru:** கண்டிப்பா Mahi. **Functional Interface** [single abstract method interface] அப்படின்னா ஒரே ஒரு abstract method மட்டும் இருக்கிற interface. இதுதான் Lambda expressions-க்கு base. `@FunctionalInterface` annotation யூஸ் பண்ணி இதை define பண்ணலாம்.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு TV remote-ல ஒரே ஒரு Power button மட்டும் இருந்தா எப்படி இருக்கும்? அந்த button-ஐ press பண்ணா TV on/off ஆகும். அதான் அதோட ஒரே வேலை. Functional Interface-ம் அதே மாதிரிதான், அதுல ஒரே ஒரு task-க்கான definition தான் இருக்கும்.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Compiler `@FunctionalInterface` annotation-ஐ பாக்கும்போது, அந்த interface-ல strictly ஒன்னே ஒன்னு abstract method இருக்கான்னு check பண்ணும். Default and static methods எவ்ளோ வேணா இருக்கலாம், ஆனா abstract method ஒன்னுதான் இருக்கணும். Object class-ல இருக்கிற public methods-ஐ இங்க declare பண்ணா அது abstract count-ல சேராது.

```java
@FunctionalInterface
public interface MyFunctionalInterface {
    void execute(); // Single abstract method
    
    default void doSomething() {
        System.out.println("Default method");
    }
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Regular Interface | Functional Interface |
|--------|-------------------|----------------------|
| Abstract Methods | Any number | Exactly one |
| `@FunctionalInterface` | Not applicable | Optional but recommended |
| Usage with Lambda | Cannot be used | Directly used |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** ஒரு interface-ல abstract method ஏதும் இல்லாம, வெறும் default method மட்டும் இருந்தா அது functional interface ஆகுமான்னு கேப்பாங்க. கண்டிப்பா ஆகாது! அதே மாதிரி, `equals()` இல்ல `hashCode()` மாதிரி Object class methods-ஐ declare பண்ணா, அது abstract method count-ஐ increase பண்ணாது.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Custom functional interfaces நிறைய create பண்ணும்போது code duplication வர வாய்ப்பு இருக்கு. Java-லயே நிறைய built-in functional interfaces (`Predicate`, `Function`, `Supplier`, `Consumer`) இருக்கு, அதை use பண்றதுதான் best practice.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க custom validators எழுதும்போது `Predicate` interface-ஐ use பண்ணுவோம். FHIR resources-ஐ transform பண்ண `Function` interface ரொம்ப use ஆகுது.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Standard API-ல இருக்கிற built-in functional interfaces-ஐ use பண்ண enforce பண்ணனும். அது developers-க்கு maintain பண்ண ஈஸியா இருக்கும், code-ம் readable-ஆ இருக்கும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** What happens if you add a second abstract method to an interface annotated with `@FunctionalInterface`?
*Answer:* Compiler error throw பண்ணும், ஏன்னா `@FunctionalInterface` strictly single abstract method-ஐ enforce பண்ணும்.

**Q:** Can a functional interface extend another interface?
*Answer:* Yes, ஆனா parent interface-ல abstract methods இருக்க கூடாது (unless it's the same signature), overall-ஆ ஒரே ஒரு abstract method தான் இருக்கணும்.

---

## Quick Revision Summary

- Functional Interface has exactly one abstract method.
- It can have any number of default or static methods.
- Methods from `java.lang.Object` do not count towards the abstract method limit.
- Used as the target type for lambda expressions and method references.
- `java.util.function` package contains many useful built-in functional interfaces.