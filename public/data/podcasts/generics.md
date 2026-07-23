# Java Interview Podcast — Episode: Generics & Wildcards
### Hosts: Mahi & Thiru

---

**Mahi:** Java-ல Generics பத்தி சொல்லுங்க. Type safety-க்கு இது எப்படி help பண்ணுது?

**Thiru:** Generics [type parameterization] அப்படிங்கறது, ஒரு class or method-ஐ எப்போ use பண்றோமோ அப்போ அதோட type-ஐ specify பண்றது. **Type Safety** [compile-time validation] குடுக்குறது தான் இதோட main purpose. ClassCastException runtime-ல வராம இது தடுக்கும்.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு Water Bottle இருக்கு.
Generics இல்லனா, அது ஒரு 'Container'. அதுல தண்ணி, பால், பெட்ரோல் என்ன வேணாலும் ஊத்தலாம். குடிக்கும்போது தப்பா குடிச்சா problem (ClassCastException).
Generics இருந்தா, அது 'Container<Water>'. அதுல தண்ணி மட்டும் தான் ஊத்த முடியும். வேற ஊத்துனா compiler விடாது (Compile-time error).

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** List-ல generics எப்படி work ஆகுதுன்னு பாரு:

```java
// Without Generics
List list = new ArrayList();
list.add("Hello");
String s = (String) list.get(0); // Explicit casting required

// With Generics
List<String> genList = new ArrayList<>();
genList.add("Hello");
String str = genList.get(0); // No casting required
```

Compiler-க்கே type தெரிஞ்சிரும்.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Feature | Without Generics | With Generics |
|--------|----------|----------|
| Casting | Requires explicit type casting | No casting required |
| Type Safety | Fails at runtime (ClassCastException) | Fails at compile-time |
| Reusability | Low | High (Type parameterized) |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Interview-ல **Type Erasure** பத்தி கேப்பாங்க. Java-ல generics compile-time-ல மட்டும் தான் இருக்கும். Compile ஆன அப்புறம் `List<String>` எல்லாமே வெறும் `List` ஆகிடும். Backward compatibility-க்காக JVM-க்கு generics தெரியாது.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Production-ல Wildcards (`?`) ரொம்ப use ஆகும். `List<? extends Number>` னு போட்டா Integer, Double எத வேணாலும் accept பண்ணும். இது APIs எழுத ரொம்ப useful.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க generic response wrappers (`ApiResponse<T>`) use பண்றோம். `T` இடத்துல FHIR Resource, Status Message எது வேணாலும் pass பண்ணிக்கலாம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Architectural rule: 'PECS' (Producer Extends, Consumer Super). Collection-ல இருந்து data read பண்ணா `? extends T` use பண்ணனும். Write பண்ணா `? super T` use பண்ணனும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** What is the difference between List<Object> and List<?>?
*Answer:* `List<Object>`-ல எந்த object வேணாலும் add பண்ணலாம். ஆனா `List<?>` (unbounded wildcard) readonly மாதிரி, அதுல `null`-ஐ தவிர எதையும் add பண்ண முடியாது.

**Q:** Can we use primitive types with Generics?
*Answer:* முடியாது. `List<int>` allow பண்ணாது. Wrapper classes `List<Integer>` தான் use பண்ணனும். ஏன்னா Type Erasure-க்கு object references தேவை.

---

## Quick Revision Summary

- Generics provide compile-time type safety.
- Eliminates the need for explicit type casting.
- Type Erasure removes generic type info at runtime.
- Use `? extends` for reading and `? super` for writing (PECS).
