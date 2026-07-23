# Java Interview Podcast — Episode: Bean Lifecycle & Scopes
### Hosts: Mahi & Thiru

---

**Mahi:** இன்னைக்கு Bean Lifecycle மற்றும் Scopes பத்தி பேசலாம். Bean lifecycle-னா என்ன Thiru?

**Thiru:** Bean lifecycle-னா **Bean Lifecycle** [ஒரு bean create ஆகுறதுல இருந்து, destroy ஆகுற வரைக்கும் நடக்குற steps]. Scope-னா **Bean Scope** [அந்த bean எத்தனை முறை create ஆகணும்னு சொல்றது].

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** நீங்க ஒரு hotel-ல room book பண்றீங்க. Receptionist உங்கள verify பண்ணி (Instantiation), keys தராங்க (Dependency Injection), நீங்க உள்ள போய் set ஆகுறீங்க (PostConstruct/Init). நீங்க check-out பண்ணும்போது room clean ஆகுது (Destroy). இதுதான் lifecycle!

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Spring container முதல்ல bean-ஐ instantiate பண்ணும். அப்பறம் dependencies-ஐ populate பண்ணும். அப்புறம் `BeanPostProcessor` methods run ஆகும். கடைசியா `@PostConstruct` execute ஆகும். 

```java
@Component
public class MyBean {
    public MyBean() {
        System.out.println("1. Instantiation");
    }

    @PostConstruct
    public void init() {
        System.out.println("2. Initialization");
    }

    @PreDestroy
    public void destroy() {
        System.out.println("3. Destruction");
    }
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Scope | Description | Usage |
|--------|----------|----------|
| Singleton | Default scope, ஒரு instance மட்டும் தான் create ஆகும் | Stateless services |
| Prototype | ஒவ்வொரு முறை கேட்கும்போதும் புது instance வரும் | Stateful beans |
| Request | ஒவ்வொரு HTTP request-க்கும் புது instance | Web apps request tracking |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Singleton bean-குள்ள Prototype bean-ஐ inject பண்றது பெரிய trap. Singleton ஒரு தடவ தான் create ஆகும், அதனால prototype-உம் ஒரு தடவ தான் inject ஆகும். இதை solve பண்ண `@Lookup` method injection use பண்ணனும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** நிறைய prototype beans create பண்ணா memory leak வரும், ஏன்னா Spring container அதோட destruction-ஐ manage பண்ணாது. Garbage collector தான் பாத்துக்கணும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க request scope-ஐ use பண்ணி ஒவ்வொரு FHIR processing request-க்கும் audit logs maintain பண்றோம். இதுனால data cross-contamination ஆவாது.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Default ஆ singleton use பண்றது தான் நல்லது, ஆனா stateful data இருந்தா prototype use பண்ணனும். Thread safety ரொம்ப முக்கியம் singleton beans-ல.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** `BeanPostProcessor` என்ன பண்ணும்?
*Answer:* Bean initialization-க்கு முன்னாடியும் பின்னாடியும் custom logic execute பண்ணும். Proxy create பண்ண இது ரொம்ப முக்கியம்.

**Q:** `@PostConstruct` மற்றும் `InitializingBean` வித்தியாசம் என்ன?
*Answer:* `@PostConstruct` annotation-based, `InitializingBean` interface-based. Annotation-based use பண்றது தான் loose coupling-க்கு நல்லது.

---

## Quick Revision Summary

- Default scope வந்து Singleton.
- Singleton-குள்ள Prototype inject பண்ணா `@Lookup` use பண்ணனும்.
- Lifecycle steps: Instantiate -> Inject -> PostConstruct -> Ready -> PreDestroy.
- Prototype bean-ஓட destruction-ஐ Spring manage பண்ணாது.
