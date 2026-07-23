# Java Interview Podcast — Episode: JUnit 5 Basics
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, இன்னைக்கு நம்ம JUnit 5 பத்தி பேசலாம். JUnit 4-க்கும் 5-க்கும் என்ன பெரிய difference?

**Thiru:** கண்டிப்பா Mahi. **JUnit 5** [Java-ல unit testing பண்றதுக்கான framework]. முன்னாடி எல்லாமே ஒரே jar-ல இருக்கும். ஆனா JUnit 5-ல Platform, Jupiter, Vintage அப்படின்னு 3 sub-projects ஆ பிரிச்சுட்டாங்க. இதனால modularity அதிகமா இருக்கு.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு building construct பண்றத யோசிச்சுக்கோ. 
- **Platform** வந்து foundation மாதிரி (run பண்றதுக்கான base).
- **Jupiter** வந்து புதுசா கட்டுற rooms மாதிரி (new API).
- **Vintage** வந்து பழைய rooms-அ இடிக்காம வச்சிருக்க மாதிரி (backward compatibility for JUnit 3 & 4).

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** JUnit 5 Reflection API use பண்ணி methods-அ identify பண்ணும். `@Test` annotation வச்சு execute பண்ணும்.

```java
import org.junit.jupiter.api.*;

class CalculatorTest {
    
    @BeforeEach
    void setUp() {
        // Run before each test
    }

    @Test
    @DisplayName("Addition Test")
    void testAdd() {
        int result = Math.addExact(2, 3);
        Assertions.assertEquals(5, result);
    }
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | JUnit 4 | JUnit 5 |
|--------|----------|----------|
| Architecture | Monolithic | Modular (Platform, Jupiter, Vintage) |
| Annotations | `@Before`, `@After` | `@BeforeEach`, `@AfterEach` |
| Ignore tests | `@Ignore` | `@Disabled` |
| Assertions | org.junit.Assert | org.junit.jupiter.api.Assertions |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Interviewer "JUnit 5-ல private methods-அ test பண்ண முடியுமா?" அப்படின்னு கேட்பாங்க. Technical-ஆ reflection use பண்ணி பண்ணலாம், ஆனா unit testing best practice படி private methods-அ direct-ஆ test பண்ணக் கூடாது, public methods வழியா தான் test பண்ணனும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Tests ரொம்ப slow ஆகுறது தான் மெயின் problem. Database calls, network calls எல்லாம் unit tests-ல பண்ண கூடாது. அப்படி பண்ணா build time அதிகமாகிடும். அதனால mocks use பண்ணனும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க JUnit 5-அ Mockito கூட சேர்த்து use பண்றோம். FHIR parsing logic-அ validate பண்ண parameterized tests `@ParameterizedTest` use பண்றோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Code coverage ரொம்ப முக்கியம். SonarQube integrate பண்ணி 80% coverage கண்டிப்பா இருக்கணும்-னு enforce பண்ணனும். Flaky tests (sometimes pass, sometimes fail) வராம பாத்துக்கணும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** `@BeforeAll` method ஏன் static ஆ இருக்கணும்?
*Answer:* ஏன்னா test class instantiate ஆகுறதுக்கு முன்னாடியே இந்த method run ஆகணும். அதனால static-ஆ தான் இருக்கணும்.

**Q:** `@Nested` annotation எப்போ use பண்ணுவீங்க?
*Answer:* Tests-அ logically group பண்ண use பண்ணுவோம். ஒரு class-க்குள்ள இன்னொரு class வச்சு related tests-அ ஒண்ணா வைக்கலாம்.

---

## Quick Revision Summary

- JUnit 5 consists of Platform, Jupiter, and Vintage.
- Uses new annotations like `@BeforeEach`, `@AfterEach`.
- Supports nested tests and parameterized tests natively.
- Focus on fast, isolated unit tests.
