# Java Interview Podcast — Episode: Text Blocks
### Hosts: Mahi & Thiru

---

**Mahi:** Text Blocks பத்தி பேசலாம், Java-ல JSON/SQL queries எழுத இது எவ்ளோ ஈஸியா இருக்கு?

**Thiru:** கண்டிப்பா Mahi. **Text Blocks** [multi-line string literals] Java 15-ல standard ஆச்சு. `"""` (triple quotes) use பண்ணி multi-line strings-ஐ escape characters இல்லாம ரொம்ப clean-ஆ எழுதலாம்.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** முன்னாடி ஒரு poem-ஐ ஒரு line-ல எழுதணும்னா `\n` போட்டு கஷ்டப்பட்டு எழுதுவோம் (single-line strings). Text block எப்படின்னா ஒரு நோட்-ல எப்படி paragraph எழுதுறோமோ அப்படியே type பண்ணலாம், format மாறாது.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Compiler text block-ஐ compile பண்ணும்போது incidental white spaces (extra spaces on the left) எல்லாத்தையும் remove பண்ணிடும். நீங்க என்ன indent-ல முடிக்கிறீங்களோ, அதை base பண்ணி trim பண்ணும்.

```java
// Old way
String jsonOld = "{\n" +
                 "  \"name\": \"Mahi\",\n" +
                 "  \"age\": 30\n" +
                 "}";

// Text Block (Java 15+)
String jsonNew = """
                 {
                   "name": "Mahi",
                   "age": 30
                 }
                 """;
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Normal String | Text Block |
|--------|---------------|------------|
| Quotes inside | Requires escaping (`\"`) | No escaping required |
| New lines | Requires `\n` and `+` concatenation | Natural new lines |
| Readability | Poor for HTML/JSON/SQL | Excellent |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Opening `"""` குடுத்த உடனே அதே line-ல text ஆரம்பிக்கலாமான்னு கேப்பாங்க. முடியாது! Opening `"""` குடுத்த அப்பறம் கண்டிப்பா ஒரு new line இருக்கணும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Text blocks-ல trailing spaces automatic-ஆ remove ஆகிடும். உங்களுக்கு கண்டிப்பா trailing space வேணும்னா `\s` escape sequence-ஐ use பண்ணனும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க FHIR JSON requests mock பண்ணவும், complex native SQL queries எழுதவும் Text Blocks தான் use பண்றோம். Code review பண்ண ரொம்ப வசதியா இருக்கு.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Logging messages-ஐ format பண்ண Text Blocks-ஐ `.formatted()` method கூட சேர்த்து use பண்ணலாம். இது `String.format()`-க்கு ஒரு நல்ல readable alternative.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** How does the compiler determine indentation in a Text Block?
*Answer:* Compiler எல்லா lines-லையும் காமனா இருக்குற leading whitespaces-ஐ (incidental whitespaces) calculate பண்ணி, அதை எல்லா lines-ல இருந்தும் remove பண்ணிடும். Closing `"""` எக்ஸ்ட்ரா spaces-ஐ control பண்ணும்.

**Q:** What is the use of `\` at the end of a line in a text block?
*Answer:* `\` use பண்ணா, அது new line-ஐ suppress பண்ணிடும். Long string-ஐ next line-ல continue பண்ணலாம் ஆனா output-ல single line-ஆ வரும்.

---

## Quick Revision Summary

- Introduced as a standard feature in Java 15.
- Uses `"""` to denote multi-line strings.
- Automatically handles incidental indentation.
- No need to escape double quotes (`"`) inside a text block.
- Opening `"""` must be followed by a newline.
- Useful for embedding JSON, HTML, SQL, or XML in Java code.