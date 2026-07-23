# Java Interview Podcast — Episode: ACID Properties
### Hosts: Mahi & Thiru

---

**Mahi:** இன்னைக்கு நாம ACID Properties பத்தி பேசலாம். Database transactions-ல இது ஏன் இவ்வளவு முக்கியம்?

**Thiru:** கண்டிப்பா Mahi. **ACID** [Atomicity, Consistency, Isolation, Durability] அப்படிங்கறது database transactions-ஐ reliable ஆக வச்சுக்கிற நாலு முக்கிய principles. இது இல்லாம data integrity-ஐ maintain பண்றது ரொம்ப கஷ்டம்.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** Bank transfer-ஐ எடுத்துக்கலாம் Mahi. நீ உன் account-ல இருந்து என் account-க்கு ₹1000 அனுப்புற.
- **Atomicity:** ஒன்னு ₹1000 உன்கிட்ட இருந்து cut ஆகி எனக்கு வரணும், இல்லனா transaction fail ஆகி பழையபடியே இருக்கணும். (All or nothing).
- **Consistency:** Transaction-க்கு முன்னாடியும் பின்னாடியும் total balance கரெக்ட்டா இருக்கணும்.
- **Isolation:** அதே நேரத்துல வேற ஒருத்தர் உனக்கு காசு அனுப்புனா, அது இந்த transfer-ஐ பாதிக்கக் கூடாது.
- **Durability:** Transaction success ஆன அப்புறம் power cut ஆனாலும், database-ல update ஆன balance அப்படியே இருக்கணும்.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Internally relational databases Write-Ahead Logging (WAL) மற்றும் locking mechanisms use பண்ணும். Java-ல Spring Boot வச்சு இதை எப்படி பண்றோம்னு பாரு:

```java
@Service
public class TransferService {
    
    @Transactional(rollbackFor = Exception.class)
    public void transferMoney(Long fromAcc, Long toAcc, Double amount) {
        // Step 1: Deduct from sender
        accountRepo.deductBalance(fromAcc, amount);
        
        // Step 2: Add to receiver
        accountRepo.addBalance(toAcc, amount);
        
        // Atomicity is guaranteed by @Transactional.
        // If Step 2 fails, Step 1 is rolled back.
    }
}
```

இங்க `@Transactional` annotation Spring-ல AOP proxy மூலமா connection-ஐ manage பண்ணி commit அல்லது rollback பண்ணும்.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Atomicity | Durability |
|--------|----------|----------|
| **Goal** | All or Nothing | Permanent Storage |
| **Failure Handled** | App Crashes / Errors | Power Loss / Disk Crash |
| **Mechanism** | Rollback Segments | Write-Ahead Log (WAL) |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Interviewer "Atomicity vs Consistency" குழப்ப பாப்பாங்க. Atomicity-ங்கறது transaction முழுசா நடக்குறது, Consistency-ங்கறது database constraints (like negative balance) violate ஆகாம பாத்துக்கிறது. இன்னொன்னு `@Transactional` private methods-ல work ஆகாதுங்கறத கேப்பாங்க.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Long-running transactions ஒரு பெரிய problem. Database locks அதிக நேரம் hold ஆகுறதால, மத்த queries block ஆகும். அதனால network calls, email sending இதெல்லாத்தையும் transaction குள்ள வைக்கக் கூடாது.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க patient records-ஐ FHIR format-ல save பண்ணும்போது database update-ம் IMAP email acknowledge-ம் ஒரே transaction-ல வராம, event-driven approach use பண்ணோம், ஏன்னா external system API delay transaction-ஐ பாதிக்கும்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Microservices architecture-ல ACID properties-ஐ ஒரு database-க்குள்ள achieve பண்றது ஈஸி. ஆனா distributed systems-ல (Saga pattern, 2PC) இது ரொம்ப complex. Eventual consistency-ஐ ஏத்துக்க முடியுமா இல்ல strict consistency தேவையான்னு architect முடிவு பண்ணனும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** How does a database ensure Durability?
*Answer:* Database changes-ஐ முதல்ல Write-Ahead Log (WAL) file-ல எழுதிடும். OS crash ஆனாலும் restart பண்ணும்போது WAL-ஐ வச்சு recovery பண்ணிடும்.

**Q:** Why does @Transactional not work on a private method?
*Answer:* Spring uses AOP proxies. Proxy class-ஆல private methods-ஐ override பண்ண முடியாது, அதனால transaction intercept ஆகாது.

---

## Quick Revision Summary

- ACID ensures reliable database transactions.
- Atomicity guarantees "all or nothing".
- Consistency maintains rules/constraints.
- Isolation handles concurrent transactions.
- Durability ensures saved data survives crashes.
- Never put long-running external API calls inside `@Transactional`.
