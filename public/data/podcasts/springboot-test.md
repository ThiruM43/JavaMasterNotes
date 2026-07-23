# Java Interview Podcast — Episode: @SpringBootTest vs Slice Tests
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, Spring Boot-ல `@SpringBootTest` use பண்றோம், ஆனா slice testing-னு ஒன்னு சொல்றாங்களே. ரெண்டுக்கும் என்ன difference?

**Thiru:** கண்டிப்பா Mahi. **@SpringBootTest** [முழு application context-ஐயும் load பண்றது]. **Slice Test** [ஒரு குறிப்பிட்ட layer-ஐ (Web, Data) மட்டும் load பண்ணி test பண்றது].

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** நீ ஒரு restaurant-ல soup மட்டும் எப்படி இருக்குனு test பண்ணனும்-னு வை.
- `@SpringBootTest`: restaurant-ல உள்ள எல்லா dish-யும் செஞ்சு வைக்க சொல்லிட்டு, அப்புறம் soup-அ test பண்றது. (Too slow)
- **Slice Test**: Soup master-அ மட்டும் கூப்பிட்டு, soup செஞ்சு குடுக்க சொல்லிட்டு test பண்றது. (Fast & Focused)

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** `@WebMvcTest` use பண்ணா Controllers மட்டும் load ஆகும், Services load ஆகாது. `@DataJpaTest` use பண்ணா JPA, Hibernate மட்டும் load ஆகும்.

```java
// Slice Test Example - Only Web Layer
@WebMvcTest(UserController.class)
class UserControllerTest {
    @Autowired MockMvc mockMvc;
    
    @MockBean // Spring replaces the real bean with a mock
    UserService userService; 

    @Test
    void testGet() throws Exception {
        // test controller logic alone
    }
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Feature | `@SpringBootTest` | `@WebMvcTest` / `@DataJpaTest` |
|--------|----------|----------|
| Context Loaded | Everything (All Beans) | Only specific layer beans |
| Speed | Very Slow | Fast |
| Use Case | End-to-End Integration | Testing Controllers or Repositories |
| Dependencies | Needs real or TestContainers | Uses `@MockBean` or In-Memory DB |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** "Slice test-ல security constraints (like Spring Security) load ஆகுமா?" அப்படின்னு கேட்பாங்க. `@WebMvcTest`-ல default ஆ security configuration load ஆகும். அதை bypass பண்ண `@AutoConfigureMockMvc(addFilters = false)` use பண்ணலாம்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Context caching problem வரும். ஒவ்வொரு test-க்கும் புது context load ஆனா, build time ரொம்ப அதிகமாகிடும். `@MockBean` அதிகமா use பண்ணா Spring context-ஐ dirty ஆக்கிடும், அதனால context அடிக்கடி reload ஆகும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க Repository layer-ஐ test பண்ண `@DataJpaTest` use பண்றோம். Controller endpoints-ஐ test பண்ண `@WebMvcTest` use பண்றோம். Full flow-க்கு மட்டும் `@SpringBootTest` use பண்றோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Developers-கிட்ட எப்பவுமே `@SpringBootTest` use பண்ணாதீங்க-னு சொல்லணும். Layer-by-layer testing strategy-ஐ enforce பண்ணனும். அப்போ தான் tests fast-ஆ execute ஆகும், quick feedback கிடைக்கும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** `@DataJpaTest` default-ஆ எந்த database use பண்ணும்?
*Answer:* Default-ஆ In-memory database (H2) use பண்ணும். Real database use பண்ணனும்-னா `@AutoConfigureTestDatabase(replace = Replace.NONE)` கொடுக்கணும்.

**Q:** `@Mock` vs `@MockBean` என்ன difference?
*Answer:* `@Mock` வந்து Mockito-வோடது, pure unit tests-க்கு. `@MockBean` Spring-ஓடது, Spring application context-ல இருக்குற real bean-ஐ replace பண்ண mock inject பண்ணும்.

---

## Quick Revision Summary

- `@SpringBootTest` loads the entire application context.
- Slice tests (`@WebMvcTest`, `@DataJpaTest`) load only required layers.
- Slice tests are much faster and focused.
- Beware of context reloading when using multiple `@MockBean` declarations.
