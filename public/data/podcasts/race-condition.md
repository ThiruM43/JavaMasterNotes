# Java Interview Podcast — Episode: Race Condition
### Hosts: Mahi & Thiru

---

**Mahi:** இன்னைக்கு Race Condition பத்தி பேசலாம். இதுனா என்ன?

**Thiru:** கண்டிப்பா Mahi. **Race Condition** [ரெண்டு அல்லது அதற்கு மேற்பட்ட threads ஒரே data-ஐ ஒரே நேரத்துல மாத்த try பண்ணும்போது வரும் problem]. இதனால data corruption நடக்கும்.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு joint bank account-ல 1000 ரூபாய் இருக்கு. நீயும் உன் friend-ம் ஒரே நேரத்துல ATM-ல 1000 எடுக்க try பண்றீங்க. ரெண்டு பேருக்கும் balance 1000-னு காட்டி, ரெண்டு பேருக்கும் காசு வந்து, balance 0 ஆனா அது bank-க்கு loss. இதுதான் race condition.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** `count++` அப்படிங்கறது single operation இல்ல. Read value, Increment value, Write value னு 3 steps இருக்கு. Thread context switch ஆகும்போது இந்த steps overlap ஆகி wrong value store ஆகும்.

```java
public class Counter {
    private int count = 0;
    
    // Race condition happens here without synchronization
    public void increment() {
        count++; 
    }
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Scenario | Concept | Consequence |
|----------|---------|-------------|
| Check-then-act | ஒரு condition check பண்ணிட்டு action எடுக்கிறது | Check பண்ணதுக்கு அப்புறம் condition மாறிடும் |
| Read-modify-write | Data-ஐ read பண்ணி update பண்றது | Overwrite ஆகி data loss ஆகும் (Lost Update) |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** HashMap-ஐ multi-threaded environment-ல use பண்ணா என்ன ஆகும்னு கேப்பாங்க. Race conditionனால HashMap internal link உடைஞ்சு infinite loop-ல மாட்டிக்க வாய்ப்பு இருக்கு (especially in Java 7). Java 8+ ல data override ஆகும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Race conditions ரொம்ப tricky. Local-ல debug பண்ணும்போது வராது, ஆனா high load இருக்கிற production-ல திடீர்னு data mismatch ஆகும். Thread dumps வச்சு கண்டுபிடிக்குறது ரொம்ப கஷ்டம்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க unique case ID generate பண்ணும்போது race condition வராம இருக்க database sequence or AtomicLong use பண்ணுவோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Stateless architectures-ஐ prefer பண்ணனும். Shared mutable state-ஐ கம்மி பண்ணிட்டாலே 99% race conditions வராது. தவிர்க்க முடியாத இடத்துல proper locking mechanisms (Optimistic/Pessimistic locking) தரணும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Race condition-ஐ எப்படி தடுப்பது?
*Answer:* Synchronized block, ReentrantLock, அல்லது Atomic classes use பண்ணி தடுக்கலாம்.

**Q:** Deadlock-க்கும் Race condition-க்கும் என்ன வித்தியாசம்?
*Answer:* Race condition-ல data தப்பா மாறும். Deadlock-ல threads stuck ஆகி execution-ஏ நடக்காது.

---

## Quick Revision Summary

- Race condition occurs when threads interleave operations on shared data.
- Check-then-act and Read-modify-write are common patterns causing it.
- Use synchronization, locks, or atomic variables to prevent it.
- Avoid shared mutable state to build robust multi-threaded apps.
