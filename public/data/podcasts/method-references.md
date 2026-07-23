# Java Interview Podcast — Episode: Method References
### Hosts: Mahi & Thiru

---

**Mahi:** Method References பத்தி சொல்லுங்க, இது Lambda-வோட அண்ணன் மாதிரி சொல்றாங்களே?

**Thiru:** கண்டிப்பா Mahi. **Method References** [shorthand for lambdas] அப்படின்னா ஏற்கனவே இருக்கிற ஒரு method-ஐ lambda expression-க்கு பதிலா directly refer பண்றது. இது `::` operator-ஐ use பண்ணும். Code இன்னும் readable ஆக்கும்.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒருத்தர் கிட்ட வழி கேக்குறீங்க. அவரு "நீங்க straight-ஆ போய் right எடுங்க" அப்படின்னு சொல்றது Lambda. அதே அவரு "அந்த map-ஐ பாத்துக்கோங்க" அப்படின்னு existing directions-ஐ point பண்றது Method Reference.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Method references-ம் lambda expressions மாதிரிதான் runtime-ல `invokedynamic` use பண்ணி resolve ஆகும். Compiler method signature-ஐ functional interface signature-ஓட match பண்ணி பாக்கும்.

```java
List<String> names = Arrays.asList("Mahi", "Thiru");

// Using Lambda
names.forEach(name -> System.out.println(name));

// Using Method Reference
names.forEach(System.out::println);
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Lambda Expression | Method Reference |
|--------|-------------------|------------------|
| Syntax | `(args) -> expr` | `Class::method` |
| Readability | Good | Excellent |
| Custom Logic | Can write any logic | Only calls existing method |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** "Method reference use பண்ணும்போது argument pass பண்ண முடியுமா?" அப்படின்னு கேப்பாங்க. Direct-ஆ parameters pass பண்ண முடியாது. Signature match ஆனா compiler-ஏ அதை handle பண்ணிக்கும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Overloaded methods இருக்கும்போது method reference use பண்ணா, compiler-க்கு ambiguity வர வாய்ப்பு இருக்கு. அப்போ explicit-ஆ lambda use பண்றதுதான் safe.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) DTO to Entity mapping பண்ணும்போது `map(EntityMapper::toDto)` அப்படின்னு நிறைய method references use பண்ணுவோம், ரொம்ப clean-ஆ இருக்கும்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Code clarity தான் main. ஒரு complex logic-ஐ inline lambda-வா எழுதுறதுக்கு பதிலா, அதை ஒரு class method-ஆ மாத்திட்டு, method reference use பண்ணா unit test பண்றது ஈஸியா இருக்கும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** What are the different types of Method References?
*Answer:* நாலு types இருக்கு: Static method (`Class::staticMethod`), Instance method of particular object (`obj::method`), Instance method of arbitrary object of particular type (`Class::method`), Constructor reference (`Class::new`).

**Q:** How does a constructor reference work?
*Answer:* `ClassName::new` அப்படின்னு use பண்ணுவோம். Function interface-ல இருக்குற method-ஓட arguments, constructor arguments-ஓட match ஆகணும்.

---

## Quick Revision Summary

- Method references are a shorthand notation for lambda expressions.
- Uses the double colon `::` operator.
- Four types: Static, Instance (particular object), Instance (arbitrary object of type), and Constructor.
- Improves code readability and reusability.
- Falls back to lambdas if you need to pass additional parameters or perform operations before calling the method.