# Java Interview Podcast — Episode: Dependency Injection & IoC
### Hosts: Mahi & Thiru

---

**Mahi:** இன்னைக்கு Dependency Injection மற்றும் IoC பத்தி பேசலாம். DI-ன்னா என்ன Thiru?

**Thiru:** DI-ன்னா **Dependency Injection** [ஒரு object-க்கு தேவையான dependencies-ஐ வெளியில இருந்து குடுக்குறது]. IoC-ன்னா **Inversion of Control** [control-ஐ நம்ம code-ல இருந்து framework-க்கு மாத்துறது].

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** கண்டிப்பா! நீங்க ஒரு restaurant-க்கு போறீங்க. நீங்களே சமைக்கிறதுக்கு பதிலா, waiter-கிட்ட order பண்றீங்க. Chef சமைச்சு உங்ககிட்ட குடுக்குறாரு. இதுல Chef தான் Spring Container, சாப்பாடு தான் Bean. உங்களோட dependency-ஐ (சாப்பாடு) chef inject பண்றாரு!

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Spring Container start ஆனதும், `@Component` அல்லது `@Service` இருக்கிற classes-ஐ scan பண்ணும். அதோட dependencies-ஐ resolve பண்ணி, objects-ஐ create பண்ணி inject பண்ணும்.

```java
@Service
public class OrderService {
    private final PaymentService paymentService;

    // Spring injects this dependency via constructor
    @Autowired
    public OrderService(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Tight Coupling | Dependency Injection |
|--------|----------|----------|
| Object Creation | Class itself creates using `new` | Framework injects it |
| Testing | கஷ்டம், mock பண்ண முடியாது | ரொம்ப easy, mock பண்ணலாம் |
| Flexibility | Change பண்ண கஷ்டம் | ஈசியா change பண்ணலாம் |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Circular dependency trap தான் முக்கியம். Bean A வந்து Bean B-ஐ depend பண்ணி, Bean B வந்து Bean A-ஐ depend பண்ணா Spring exception throw பண்ணும். `@Lazy` annotation use பண்ணி இத solve பண்ணலாம்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** நிறைய beans create ஆகும்போது memory increase ஆகும். அதுனால தேவையான scope-ல beans create பண்ணனும். Injection failure ஆச்சுன்னா application start ஆகாது, இது fail-fast behavior.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க FHIR client-ஐ ஒரு singleton bean-ஆ configure பண்ணி, எல்லா services-லயும் constructor injection வழியா inject பண்றோம். இதுனால thread-safe ஆவும், performance நல்லாவும் இருக்கு.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Loose coupling முக்கியம். Interfaces use பண்ணி DI பண்ணனும், directly concrete classes-ஐ inject பண்ணக்கூடாது. இது unit testing-க்கும், future refactoring-க்கும் ரொம்ப help பண்ணும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** What is the difference between `@Autowired` and `@Inject`?
*Answer:* ரெண்டும் ஒன்னுதான், `@Autowired` Spring-ஓடது, `@Inject` வந்து Java EE standard (JSR-330).

**Q:** Field injection ஏன use பண்ணக்கூடாது?
*Answer:* Field injection use பண்ணா testing கஷ்டம், object immutability maintain பண்ண முடியாது. Constructor injection தான் best practice.

---

## Quick Revision Summary

- DI வந்து dependencies-ஐ externally inject பண்ணும்.
- IoC வந்து object creation control-ஐ framework-க்கு கொடுக்கும்.
- Constructor injection தான் எப்பவுமே best practice.
- Circular dependency வந்தா `@Lazy` use பண்ணலாம்.
