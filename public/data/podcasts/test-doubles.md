# Java Interview Podcast — Episode: Test Doubles
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, testing-ல Test Doubles-னு சொல்றாங்களே, அதுல நிறைய types இருக்கா?

**Thiru:** ஆமா Mahi. **Test Double** [Testing-க்காக use பண்ற dummy objects]. இதுல Dummy, Fake, Stub, Spy, Mock அப்படின்னு 5 main types இருக்கு. ஒவ்வொன்னும் ஒவ்வொரு scenario-க்கு use ஆகும்.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு bank robbery scene எடுக்குறாங்க-னு வைப்போம்:
- **Dummy**: பின்னாடி நிக்கிற கூட்டம் (Just to fill space, no interaction).
- **Fake**: டம்மி துப்பாக்கி (Looks like real, but simple implementation).
- **Stub**: ஒரு காகிதத்துல எழுதியிருக்க script (Hardcoded response).
- **Spy**: ரகசிய போலீஸ் (Watches and records what happens).
- **Mock**: Remote control கார் (Programmed to act strictly in a specific way).

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Java code-ல இத எப்படி implement பண்றோம்னு பாப்போம்:

```java
// Fake implementation
class FakeDatabase implements Database {
    Map<Integer, String> map = new HashMap<>();
    public void save(int id, String name) { map.put(id, name); }
    public String get(int id) { return map.get(id); }
}

// Stub implementation
class UserStub implements UserService {
    public String getUserStatus() {
        return "ACTIVE"; // Hardcoded
    }
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Type | Behavior | Example Use Case |
|--------|----------|----------|
| Dummy | Passed around, never used | Parameter filling |
| Fake | Working logic, but simple | In-memory DB (H2) |
| Stub | Hardcoded answers | External API returning fixed JSON |
| Spy | Real object, records calls | Counting how many emails sent |
| Mock | Expected behavior pre-programmed | Checking if `save()` was called |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** "Mock-க்கும் Spy-க்கும் என்ன வித்தியாசம்?"-னு கேட்பாங்க. Mock வந்து 100% dummy. ஆனா Spy வந்து real object-அ wrap பண்ணி, வேணுங்கிற methods-அ மட்டும் mock பண்ண allow பண்ணும். Partial mocking-னு சொல்லுவாங்க.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Spies அதிகமா use பண்றது code-ல tight coupling உருவாக்கும். Internal implementation-அ ரொம்ப depend பண்ணி test எழுதினா, code refactor பண்ணும்போது tests எல்லாம் fail ஆகும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க H2 database-அ Fake ஆ use பண்றோம். அதே மாதிரி, email send பண்ற service-அ Spy பண்ணி, correct ஆன email content போகுதா-னு verify பண்றோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** எப்பவுமே "State verification" (using Fakes) vs "Behavior verification" (using Mocks). Mocks-அ விட Fakes use பண்றது maintenance-க்கு ஈஸி. In-memory databases are preferred over mocking all DB calls.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Dummy object எப்போ use பண்ணுவீங்க?
*Answer:* Constructor-ல நிறைய parameters தேவைப்படுது, ஆனா current test-க்கு அது தேவையில்ல-னா null pass பண்றதுக்கு பதிலா Dummy object pass பண்ணுவோம்.

**Q:** Mockito-ல Spy எப்படி create பண்ணுவீங்க?
*Answer:* `@Spy` annotation use பண்ணலாம் அல்லது `Mockito.spy(new RealObject())` use பண்ணலாம்.

---

## Quick Revision Summary

- Test doubles include Dummy, Fake, Stub, Spy, Mock.
- Dummy is just for filling parameters.
- Fake has real but simplified logic (e.g., in-memory DB).
- Stub provides hardcoded responses.
- Spy tracks interactions on real objects.
- Mock validates predefined behavior.
