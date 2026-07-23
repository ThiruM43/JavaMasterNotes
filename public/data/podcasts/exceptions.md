# Java Interview Podcast — Episode: Checked vs Unchecked Exceptions
### Hosts: Mahi & Thiru

---

**Mahi:** Java-ல Exception Handling-ல Checked அண்ட் Unchecked Exceptions-க்கு என்ன வித்தியாசம்?

**Thiru:** ரொம்ப முக்கியமான topic Mahi. **Checked Exceptions** [compile-time] அப்படிங்கறது compiler-ஆல check பண்ணப்படுற exceptions. இத நாம கண்டிப்பா handle பண்ணியே ஆகணும். **Unchecked Exceptions** [run-time] அப்படிங்கறது runtime-ல வர mistakes, இத compiler force பண்ணாது.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** Flight travel-ஐ யோசிச்சு பாரு.
Boarding pass இல்லாம உள்ள போக முடியாது. செக்யூரிட்டி உன்னை செக் பண்ணி தான் அனுப்புவாங்க. இது **Checked Exception** (compile-time validation).
Flight-ல போகும்போது உனக்கு தலைவலி வரலாம். அது செக்யூரிட்டிக்கு தெரியாது, நடந்தா தான் தெரியும். இது **Unchecked Exception** (run-time issue).

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Hierarchy-ல `RuntimeException`-ஐ தாண்டி வரது எல்லாம் unchecked. மத்தது எல்லாம் checked.

```java
// Checked Exception: Must be caught or declared
void readFile() throws IOException {
    FileReader file = new FileReader("test.txt");
}

// Unchecked Exception: No compile-time enforcement
void divide() {
    int result = 10 / 0; // Throws ArithmeticException
}
```

Checked-க்கு `try-catch` or `throws` கட்டாயம்.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Feature | Checked Exception | Unchecked Exception |
|--------|----------|----------|
| When verified | Compile-time | Runtime |
| Parent Class | `Exception` | `RuntimeException` |
| Requirement | Must be handled | Handling is optional |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Interview-ல `Error` அண்ட் `Exception`-க்கு difference கேப்பாங்க. `OutOfMemoryError` மாதிரி விஷயங்களை நாம handle பண்ண முடியாது. அப்புறம், overridden method-ல parent checked exception throw பண்ணலனா, child class புதுசா checked exception throw பண்ண முடியாது.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Production-ல checked exceptions ரொம்ப annoying-ஆ இருக்கும். அதனால modern frameworks (Spring) எல்லாம் unchecked exceptions-ஐ தான் use பண்றாங்க (e.g., DataAccessException).

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) FHIR parsing-ல வர exceptions-ஐ நாங்க custom unchecked `FhirProcessingException`-ஆ wrap பண்ணி throw பண்றோம். ஏன்னா every layer-ல `try-catch` போடுறது code-ஐ messy ஆக்கிடும்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Architects எப்போவும் custom exceptions create பண்ண சொல்லுவாங்க. Business logic errors-க்கு RuntimeException-ஐ extend பண்ணி custom exceptions create பண்றது தான் clean architecture-க்கு நல்லது.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Is NullPointerException a checked or unchecked exception?
*Answer:* NullPointerException வந்து `RuntimeException`-ஐ inherit பண்றதால, அது Unchecked exception.

**Q:** What happens if an exception is thrown in a finally block?
*Answer:* Finally block-ல exception வந்தா, அது original try block-ல வந்த exception-ஐ override பண்ணிடும் (exception masking). அதனால finally-ல ஜாக்கிரதையா code எழுதணும்.

---

## Quick Revision Summary

- Checked exceptions are checked at compile-time.
- Unchecked exceptions occur at runtime.
- Use RuntimeException for programming errors.
- Wrap checked exceptions into unchecked exceptions for cleaner code.
