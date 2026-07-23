# Java Interview Podcast — Episode: Mockito Fundamentals
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, unit testing பத்தி பேசினோம். ஆனா database, external API எல்லாம் கூப்பிடாம எப்படி test பண்றது? Mockito பத்தி சொல்லுங்க.

**Thiru:** கண்டிப்பா Mahi. **Mockito** [Dependencies-ஐ dummy ஆக்கி test பண்ற framework]. நம்ம test பண்ண வேண்டிய class-ஐ தவிர மத்த எல்லா dependencies-யும் mock பண்ணி, நம்ம class-ஐ மட்டும் isolate பண்ணி test பண்ண Mockito use ஆகுது.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு movie-ல hero சண்டை போடுற scene எடுக்குறாங்க-னு வச்சுக்கோ. நிஜமான ரவுடிகளை கூட்டிட்டு வர மாட்டாங்க. அவங்களுக்கு பதிலா **Stunt doubles**-ஐ வச்சு scene எடுப்பாங்க. Mockito-வும் அதே மாதிரி தான். நிஜமான database-க்கு பதிலா dummy database (mock)-ஐ கொடுக்கும்.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Mockito runtime-ல CGLib அல்லது ByteBuddy use பண்ணி proxy classes-ஐ create பண்ணும். 

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    UserRepository userRepository; // Creates a dummy object

    @InjectMocks
    UserService userService; // Injects the dummy into the real object

    @Test
    void testFindUser() {
        // Arrange
        when(userRepository.findById(1)).thenReturn(new User(1, "Thiru"));

        // Act
        User user = userService.getUser(1);

        // Assert
        assertEquals("Thiru", user.getName());
        verify(userRepository, times(1)).findById(1);
    }
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | @Mock | @InjectMocks |
|--------|----------|----------|
| Purpose | Creates a fake instance | Creates a real instance |
| Behavior | Default returns null/0 | Calls real methods |
| Dependency | Acts as a dependency | Requires dependencies |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** "Static methods-ஐ mock பண்ண முடியுமா?" அப்படின்னு கேட்பாங்க. Mockito 3.4-ல இருந்து `mockStatic` use பண்ணி பண்ணலாம். ஆனா static methods-ஐ mock பண்றது design flaw-ஆ கூட இருக்கலாம்-னு சொல்லணும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Over-mocking தான் பெரிய problem. எல்லாத்தையும் mock பண்ணிட்டா, test pass ஆகும், ஆனா production-ல fail ஆகும். Integration test தான் இதுக்கு solution.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க external EHR systems கூட communicate பண்ற REST clients-ஐ mock பண்ண Mockito use பண்றோம். `when(...).thenReturn(...)` வச்சு success & failure scenarios ரெண்டையும் test பண்றோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Developers-ஐ Behavior Driven Testing (BDD) use பண்ண சொல்லணும். `given(...)`, `willReturn(...)` use பண்ணா tests படிக்க ஈஸியா இருக்கும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** `when()` vs `doReturn()` என்ன வித்தியாசம்?
*Answer:* `when()` வந்து type-safe. ஆனா Spy use பண்ணும்போது `when()` real method-ஐ call பண்ணிடும், அதனால Spy கூட `doReturn()` தான் use பண்ணனும்.

**Q:** `verify()` எப்போ use பண்ணுவீங்க?
*Answer:* ஒரு method கால் ஆச்சா இல்லையா, எத்தனை தடவை கால் ஆச்சு-னு check பண்ண use பண்ணுவோம்.

---

## Quick Revision Summary

- Mockito isolates tests by providing dummy dependencies.
- `@Mock` creates mocks, `@InjectMocks` injects them.
- Avoid over-mocking; use verify to ensure interactions.
