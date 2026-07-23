# Java Interview Podcast — Episode: Optimistic vs Pessimistic Locking
### Hosts: Mahi & Thiru

---

**Mahi:** இன்னைக்கு நாம Optimistic vs Pessimistic Locking பத்தி பேசலாம். Concurrent updates-ஐ எப்படி handle பண்றது?

**Thiru:** கண்டிப்பா Mahi. ரெண்டு பேர் ஒரே நேரத்துல ஒரே data-வை update பண்ண try பண்ணும்போது, யார் பண்ற update save ஆகணும்னு முடிவு பண்றது தான் Locking mechanism. இதை Optimistic-ஆ (நம்பிக்கையா) அல்லது Pessimistic-ஆ (சந்தேகமா) பண்ணலாம்.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு meeting room book பண்றத நினைச்சுக்கோ.
**Pessimistic:** நான் room-குள்ள போன உடனே கதவை பூட்டிக்குவேன், என் வேலை முடிஞ்சதும் தான் வெளியே வருவேன். வேற யாரும் உள்ள வர முடியாது.
**Optimistic:** கதவு திறந்தே இருக்கும். நான் ஒரு board-ல "Thiru is using" னு எழுதிட்டு உள்ள இருப்பேன். யாராச்சும் வந்தா board பாத்துட்டு வெயிட் பண்ணுவாங்க. நான் முடிச்சதும் board-ஐ அழிச்சிடுவேன்.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Spring Data JPA-ல Optimistic locking-க்கு `@Version` annotation use பண்ணுவோம்.

```java
@Entity
public class BankAccount {
    @Id
    private Long id;
    
    private Double balance;
    
    @Version
    private Long version; // Optimistic locking
}
```
இப்போ User A வும் User B யும் version=1 னு read பண்ணுவாங்க. User A update பண்ணதும் version=2 ஆகிடும். User B update பண்ண try பண்ணா, DB-ல version=2 இருக்கும், ஆனா அவன்கிட்ட version=1 தான் இருக்கு. அதனால `ObjectOptimisticLockingFailureException` வரும்.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Feature | Optimistic Locking | Pessimistic Locking |
|--------|----------|----------|
| **Approach** | Check before save (Version) | Lock on read (DB Lock) |
| **Performance** | High (No DB Locks) | Low (Blocks other users) |
| **Best For** | Lot of reads, few writes | Heavy concurrent writes |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** "Optimistic locking-ல exception வந்தா என்ன பண்ணுவ?" னு கேப்பாங்க. Retry mechanism implement பண்ணனும். `@Retryable` annotation use பண்ணி 3 times retry பண்ண வைக்கலாம், ஏன்னா அது application level lock, db level இல்ல.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Pessimistic locking use பண்ணா Deadlock வர நிறைய வாய்ப்பு இருக்கு. User A, Row 1-ஐ lock பண்ணிட்டு Row 2-க்கு வெயிட் பண்ணுவாப்ல. User B, Row 2-ஐ lock பண்ணிட்டு Row 1-க்கு வெயிட் பண்ணுவாப்ல. இது பெரிய production issue.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) Multiple background jobs ஒரே patient report-ஐ process பண்ண try பண்ணும். நாங்க `@Version` வெச்சி Optimistic locking தான் பண்ணோம். Duplicate processing தடுக்க இது ரொம்ப help ஆச்சு, performance-ம் அடிவாங்கல.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Default-ஆ Optimistic locking தான் choose பண்ணனும். ஏன்னா cloud-native applications-ல scalability முக்கியம். ரொம்ப financial critical (e.g. trading platform) use cases-க்கு மட்டும் Pessimistic locking (SELECT FOR UPDATE) use பண்ணலாம்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** What SQL does Pessimistic Locking generate?
*Answer:* அது `SELECT ... FOR UPDATE` அப்படிங்குற SQL-ஐ generate பண்ணும். இது DB level-ல row lock போடும்.

**Q:** Can we use Optimistic Locking without `@Version`?
*Answer:* ஆமா, Hibernate-ல `@OptimisticLocking(type = OptimisticLockType.ALL)` use பண்ணலாம். இது பழைய values எல்லாத்தையும் WHERE clause-ல போட்டு check பண்ணும். ஆனா `@Version` தான் best practice.

---

## Quick Revision Summary

- Optimistic locking uses a `@Version` field to prevent lost updates.
- It throws exception if version mismatch is found during save.
- Pessimistic locking uses database locks (`FOR UPDATE`).
- Optimistic is better for read-heavy apps; Pessimistic for write-heavy.
- Always implement a retry mechanism for Optimistic locking failures.
