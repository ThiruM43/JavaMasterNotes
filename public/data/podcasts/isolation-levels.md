# Java Interview Podcast — Episode: Isolation Levels
### Hosts: Mahi & Thiru

---

**Mahi:** இன்னைக்கு நாம Database Isolation Levels பத்தி பேசலாம். Concurrent transactions வரும்போது இது ஏன் ரொம்ப முக்கியம்?

**Thiru:** கண்டிப்பா Mahi. **Isolation** [Concurrent transactions ஒன்னையொன்னு பாதிக்காம execute ஆகுறது] ACID properties-ல ஒரு முக்கியமான விஷயம். Isolation levels சரியா செட் பண்ணலன்னா Dirty Read, Non-Repeatable Read, Phantom Read மாதிரி data anomalies வரும்.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு movie ticket booking system-ஐ நினைச்சுக்கோ. நீயும் உன் friend-ம் ஒரே நேரத்துல ஒரே seat-ஐ book பண்ண try பண்றீங்க. Isolation சரி இல்லன்னா, ரெண்டு பேருக்கும் ஒரே seat book ஆகிடும். சரியான isolation level இருந்தா, ஒருத்தர் book பண்ணும்போதே அந்த seat lock ஆகி, இன்னொருத்தருக்கு "seat not available" அப்படின்னு காட்டும்.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Databases row-level locks, table locks, மற்றும் MVCC (Multi-Version Concurrency Control) use பண்ணி isolation-ஐ manage பண்ணுது. Spring-ல இதை எப்படி set பண்றதுன்னு பாரு:

```java
@Service
public class TicketService {
    
    // Setting isolation level to SERIALIZABLE to prevent any read anomalies
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public void bookTicket(Long seatId, Long userId) {
        Seat seat = seatRepository.findById(seatId).orElseThrow();
        if (seat.isAvailable()) {
            seat.setAvailable(false);
            seat.setUserId(userId);
            seatRepository.save(seat);
        } else {
            throw new RuntimeException("Seat already booked");
        }
    }
}
```
இங்க `SERIALIZABLE` use பண்ணிருக்கோம், இது highest level of isolation.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read |
|--------|----------|----------|----------|
| **Read Uncommitted** | Yes | Yes | Yes |
| **Read Committed** | No | Yes | Yes |
| **Repeatable Read** | No | No | Yes |
| **Serializable** | No | No | No |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** MySQL-ஓட default isolation level என்னன்னு கேப்பாங்க. MySQL InnoDB-ல default `REPEATABLE READ`, ஆனா Oracle, PostgreSQL-ல `READ COMMITTED`. இதை மாத்தி சொல்லிடக் கூடாது. Phantom read-க்கும் Non-repeatable read-க்கும் உள்ள difference அடிக்கடி கேட்பாங்க. 

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Isolation level-ஐ `SERIALIZABLE` ன்னு எல்லா எடத்துலயும் வச்சிட்டா performance ரொம்ப அடிவாங்கும், ஏன்னா transactions ஒன்னொன்னா execute ஆகும். Deadlocks வர நிறைய வாய்ப்பு இருக்கு.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க reports process பண்ணும்போது `READ COMMITTED` தான் use பண்றோம். ஆனா batch processing job-ல duplicate records create ஆகாம இருக்க optimistic locking சேத்து use பண்றோம், ஏன்னா isolation level-ஐ விட versioning எங்களுக்கு நல்லா work ஆச்சு.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Performance vs Data Consistency trade-off தான் முக்கியம். எல்லாமே 100% correct-ஆ இருக்கணும்னா application slow ஆகிடும். Business requirement-க்கு ஏத்த மாதிரி lowest possible isolation level-ஐ choose பண்ணனும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** What is a Phantom Read?
*Answer:* ஒரு transaction-ல ஒரு range of records-ஐ ரெண்டு தடவ read பண்ணும்போது, இடையில இன்னொரு transaction புதுசா ஒரு row insert பண்ணி commit பண்ணிட்டா, ரெண்டாவது read-ல அந்த புது row (phantom) தெரியும்.

**Q:** How does MVCC help with isolation?
*Answer:* MVCC (Multi-Version Concurrency Control) data-க்கு multiple versions create பண்ணும். இதனால read பண்றவங்க write பண்றவங்கள block பண்ண மாட்டாங்க, write பண்றவங்க read பண்றவங்கள block பண்ண மாட்டாங்க.

---

## Quick Revision Summary

- Read Uncommitted: Allows reading uncommitted changes (Dirty Read).
- Read Committed: Only committed changes are read.
- Repeatable Read: Multiple reads of the same row return same data.
- Serializable: Highest isolation, avoids all anomalies but slow.
- Default in MySQL is Repeatable Read, Oracle/Postgres is Read Committed.
