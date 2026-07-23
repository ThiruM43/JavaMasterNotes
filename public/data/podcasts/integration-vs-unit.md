# Java Interview Podcast — Episode: Integration vs Unit Testing
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, Unit testing-க்கும் Integration testing-க்கும் என்ன பெரிய வித்தியாசம்? எதை எப்போ use பண்ணனும்?

**Thiru:** கண்டிப்பா Mahi. **Unit Test** [ஒரு சின்ன class அல்லது method-ஐ மட்டும் isolate பண்ணி test பண்றது]. **Integration Test** [பல்வேறு components ஒண்ணா சேந்து சரியா வேலை செய்யுதா-னு test பண்றது].

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு கார் தயாரிக்கிறாங்க-னு வச்சுக்கோ.
- **Unit Test**: டயர் சரியா இருக்கா, engine தனியா start ஆகுதா-னு செக் பண்றது.
- **Integration Test**: டயர், engine, steering எல்லாத்தையும் கார்-ல மாட்டிட்டு, கார் ஓடுதா-னு ஓட்டி பாக்குறது. டயர் தனியா நல்லா இருந்தாலும், கார்-ல மாட்டும் போது problem வரலாம்.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Unit tests-க்கு Mockito use பண்ணுவோம். Integration tests-க்கு Spring Boot-ல `@SpringBootTest` use பண்ணி whole application context-ஐ load பண்ணுவோம்.

```java
// Unit Test (Fast, Mocked)
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock UserRepository repo;
    // test logic
}

// Integration Test (Slow, Real DB/Services)
@SpringBootTest
@AutoConfigureMockMvc
class UserIntegrationTest {
    @Autowired MockMvc mockMvc;
    // test HTTP endpoints calling real DB
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Unit Testing | Integration Testing |
|--------|----------|----------|
| Scope | Single class/method | Multiple components |
| Speed | Very Fast (ms) | Slow (seconds/minutes) |
| Dependencies | Mocked | Real (or TestContainers) |
| Environment | Runs entirely in memory | Needs DB, MQ, Network |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** "உங்க project-ல 100% unit test coverage இருக்கு, அப்போ integration test தேவையா?" அப்படின்னு கேட்பாங்க. கண்டிப்பா தேவை! Components தனியா work ஆனாலும், ஒண்ணா சேரும்போது data format mismatch, connection issues வரலாம்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Integration tests ரொம்ப slow ஆகிடும். CI/CD pipeline-ல 30 minutes மேல build ஓடுனா developers கடுப்பாயிடுவாங்க. அதனால test parallelization and selective testing use பண்ணனும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க Test Pyramid follow பண்றோம். 80% Unit tests for FHIR parsing logic, 20% Integration tests for checking if IMAP reads correctly save to Postgres.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Test Pyramid maintain பண்றது architect-ஓட வேலை. Unit tests base-ல நிறைய இருக்கணும். மேல போக போக integration and E2E tests கம்மியா இருக்கணும். Separation of test profiles (`mvn test` vs `mvn verify`) implement பண்ணனும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Integration testing-ல external API calls-ஐ எப்படி handle பண்ணுவீங்க?
*Answer:* WireMock use பண்ணி external API-ஐ stub பண்ணுவோம்.

**Q:** Flaky tests-ஐ எப்படி கையாளுவீங்க?
*Answer:* Tests fail ஆனா retry mechanism வைக்கலாம், ஆனா root cause கண்டுபிடிச்சு fix பண்றது தான் best (like fixing race conditions).

---

## Quick Revision Summary

- Unit tests isolate classes; Integration tests verify combined flow.
- Unit tests are fast; Integration tests are slow and heavy.
- Use mocks for unit tests, real DBs (or TestContainers) for integration.
- Follow the Test Pyramid: Lots of unit tests, fewer integration tests.
