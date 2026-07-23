# Java Interview Podcast — Episode: Transaction Management
### Hosts: Mahi & Thiru

---

**Mahi:** இன்னைக்கு Transaction Management பத்தி பேசலாம். Transaction-னா என்ன Thiru?

**Thiru:** Transaction-னா **Transaction** [ஒரு set of database operations. எல்லாம் success ஆகணும், இல்லனா எல்லாம் fail ஆகணும்]. இது ACID properties-ஐ follow பண்ணும்.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** நீங்க ATM-ல பணம் அனுப்புறீங்க. உங்க account-ல பணம் குறையுது, ஆனா receiver account-க்கு போறதுக்குள்ள power cut ஆயிடுச்சு. அப்போ transaction fail ஆகி, உங்க பணம் திரும்ப உங்க account-க்கே வரணும் (Rollback). இதுதான் Transaction.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Spring AOP use பண்ணி `@Transactional` annotation-ஐ intercept பண்ணும். Method start ஆகும்போது transaction ஆரம்பிக்கும், method முடிஞ்சதும் commit ஆகும், exception வந்தா rollback ஆகும்.

```java
@Service
public class BankService {

    @Transactional
    public void transferMoney(Long fromId, Long toId, Double amount) {
        // Step 1: Withdraw
        accountRepository.deduct(fromId, amount);
        
        // Step 2: Deposit
        // If this throws RuntimeException, Step 1 is rolled back!
        accountRepository.add(toId, amount); 
    }
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. Propagation types பாரு:
| Propagation | Description |
|--------|----------|
| REQUIRED | Default. Transaction இருந்தா join பண்ணும், இல்லனா புதுசா create பண்ணும் |
| REQUIRES_NEW | எப்பவுமே புது transaction create பண்ணும், பழையதை suspend பண்ணும் |
| SUPPORTS | Transaction இருந்தா join பண்ணும், இல்லனா non-transactional-ஆ run ஆகும் |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Same class-க்குள்ள ஒரு method-ல இருந்து இன்னொரு `@Transactional` method-ஐ call பண்ணா transaction work ஆகாது! ஏன்னா Spring AOP proxy வழியா போகாது. Self-invocation problem.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Long-running transactions database connections-ஐ hold பண்ணிட்டே இருக்கும், இதுனால connection pool exhaust ஆகி application hang ஆகலாம்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க audit logs-ஐ எப்பவுமே save பண்ணனும், main transaction fail ஆனாலும் சரி. அதனால audit save method-க்கு `REQUIRES_NEW` propagation use பண்ணிருக்கோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Distributed transactions (Saga pattern, Two-Phase Commit) microservices-ல ரொம்ப challenge. முடிஞ்ச வரைக்கும் single DB transaction-ஐ maintain பண்றது நல்லது.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Checked exception வந்தா rollback ஆகுமா?
*Answer:* Default-ஆ ஆகாது. RuntimeException மற்றும் Error-க்கு மட்டும் தான் rollback ஆகும். Checked exception-க்கு வேணும்னா `@Transactional(rollbackFor = Exception.class)` தரணும்.

**Q:** Isolation levels-ல READ_COMMITTED-க்கும் REPEATABLE_READ-க்கும் என்ன வித்தியாசம்?
*Answer:* READ_COMMITTED dirty reads-ஐ prevent பண்ணும். REPEATABLE_READ non-repeatable reads-ஐ prevent பண்ணும்.

---

## Quick Revision Summary

- `@Transactional` AOP proxies வழியா work ஆகுது.
- Default propagation வந்து REQUIRED.
- Default rollback வந்து RuntimeException-க்கு மட்டும் தான்.
- Same class method invocation-ல transaction proxy bypass ஆயிடும்.
