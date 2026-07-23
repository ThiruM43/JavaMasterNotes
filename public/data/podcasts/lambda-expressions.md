# Java Interview Podcast — Episode: Lambda Expressions
### Hosts: Mahi & Thiru

---

**Mahi:** இன்னைக்கு Lambda Expressions பத்தி பேசலாமா? இது Java-ல ரொம்ப முக்கியமான topic ஆச்சே!

**Thiru:** கண்டிப்பா Mahi. **Lambda Expressions** [anonymous functions] Java 8-ல introduce பண்ணாங்க. இது code-ஐ ரொம்ப concise-ஆ மாத்துது. Function-ஐ ஒரு parameter-ஆ pass பண்ண இது ரொம்ப useful.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு food delivery app-ஐ எடுத்துக்கலாம். நீங்க order பண்ணும்போது, "எப்படி deliver பண்ணனும்" அப்படின்னு delivery instructions கொடுப்பீங்க. நீங்க delivery person-ஆ மாறாம, அவங்க பண்ண வேண்டிய action-ஐ மட்டும் சொல்றீங்க. அதே மாதிரிதான் Lambda, object-ஐ create பண்ணாம action-ஐ மட்டும் pass பண்ணுது.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Compiler Lambda expression-ஐ compile பண்ணும்போது, `invokedynamic` instruction-ஐ use பண்ணும். இது anonymous inner class மாதிரி தனி `.class` file create பண்ணாது. Run time-ல `LambdaMetafactory` மூலமா implementation-ஐ generate பண்ணும்.

```java
// Traditional Anonymous Inner Class
Runnable r1 = new Runnable() {
    @Override
    public void run() {
        System.out.println("Hello");
    }
};

// Lambda Expression
Runnable r2 = () -> System.out.println("Hello");
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Anonymous Inner Class | Lambda Expression |
|--------|-----------------------|-------------------|
| .class files | Creates separate .class file | No separate .class file created |
| `this` reference | Refers to inner class object | Refers to enclosing class object |
| Performance | Slower class loading | Faster due to `invokedynamic` |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Local variables-ஐ lambda-க்குள்ள use பண்ணும்போது, அது `effectively final` ஆக இருக்கணும். Variable-ஐ change பண்ண try பண்ணா compiler error வரும். இது ஒரு common interview trap.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** ரொம்ப complex logic-ஐ ஒரே lambda-ல எழுதினா, debug பண்ண ரொம்ப கஷ்டமா இருக்கும். Stack trace-ல பாக்கும்போது புரியாது. அதனால பெரிய logic-ஐ separate method-ஆ எழுதிட்டு, method reference use பண்றது நல்லது.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க FHIR resources filter பண்ணவும், map பண்ணவும் Stream API கூட சேத்து நிறைய Lambda use பண்ணுவோம். Code ரொம்ப clean-ஆ இருக்கும்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Code maintainability ரொம்ப முக்கியம். Lambda use பண்ணி functional style-ல எழுதும்போது, side effects இல்லாம பாத்துக்கணும் (Pure functions). Multithreading environments-ல state mutate பண்ணாம இருக்குறது safe.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Lambda expressions create new scope?
*Answer:* இல்லை, lambda expression-க்கு தனி scope கிடையாது. அது enclosing scope-ல இருக்கிற variables-ஐ அப்படியே access பண்ணும்.

**Q:** How `invokedynamic` helps in lambda performance?
*Answer:* `invokedynamic` runtime-ல மட்டும் linkage-ஐ resolve பண்ணுது, அதனால compile time-ல extra `.class` files வராது, memory and class loading overhead குறையும்.

---

## Quick Revision Summary

- Lambda expressions provide a clear and concise way to represent one method interface using an expression.
- Uses `invokedynamic` at bytecode level.
- Variables used inside lambdas must be effectively final.
- `this` inside a lambda refers to the enclosing class.
- Helps in writing functional style code and works well with Streams API.