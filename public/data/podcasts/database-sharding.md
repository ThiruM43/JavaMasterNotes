# Java Interview Podcast — Episode: Database Sharding vs Replication
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, இன்னைக்கு Database scaling பத்தி பேசலாம். Database Sharding vs Replication என்றால் என்ன?

**Thiru:** கண்டிப்பா Mahi. **Replication** [ஒரு database-ல இருக்கிற முழு data-ஐயும் இன்னொரு database-க்கு காப்பி பண்றது, mainly for Read scaling and High Availability]. ஆனா **Sharding** [ஒரு பெரிய database-ஐ பல சின்ன சின்ன databases-ஆ பிரிச்சு (partition), வெவ்வேற servers-ல வைக்கிறது, mainly for Write scaling].

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** உன்கிட்ட ஒரு பெரிய dictionary இருக்கு.
- **Replication**: அந்த dictionary-ஐ Xerox போட்டு 5 பேருக்கு குடுக்குறது. எல்லாரும் ஒரே நேரத்துல படிக்கலாம் (Read scaling).
- **Sharding**: A to M ஒரு புக்ல, N to Z இன்னொரு புக்ல பிரிச்சு பைண்டிங் பண்றது. ரெண்டு பேரும் தனித்தனியா அவங்க புக்ல புது வார்த்தைகளை எழுதலாம் (Write scaling).

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Spring Boot-ல Master-Slave (Replication) configure பண்றது ஈஸி. `@Transactional(readOnly = true)` குடுத்தா Read Replica-க்கு போகும். ஆனா Sharding-க்கு data routing logic வேணும். Sharding Key (e.g. user_id) வெச்சு எந்த DB-க்கு போகணும்னு முடிவு பண்ணனும்.
```java
public class ShardingRouter {
    // Simple Modulo Sharding
    public String getTargetDatabase(Long userId) {
        int shardCount = 4;
        int shardId = (int) (userId % shardCount);
        return "jdbc:mysql://db-shard-" + shardId + ":3306/users";
    }
}
```
Sharding-ல queries-ஐ சரியான database-க்கு route பண்றது application அல்லது proxy-ஓட பொறுப்பு.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Feature | Replication | Sharding |
|---------|-------------|----------|
| Purpose | Read scalability, High Availability | Write scalability, Storage limit bypass |
| Data | Full copy in all nodes | Data is split across nodes |
| Complexity| Easy to setup | Very complex (cross-shard joins, transactions) |
| Cost | High (needs lots of storage) | Cost-effective for large datasets |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** "Sharded database-ல JOINs எப்படி பண்ணுவீங்க?" அப்படின்னு கேட்பாங்க. Cross-shard joins ரொம்ப கஷ்டம். ஒன்னு application level-ல தனித்தனியா query பண்ணி merge பண்ணனும், அல்லது NoSQL மாதிரி denormalize பண்ணி ஒரே shard-ல data இருக்கிற மாதிரி பாத்துக்கணும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** "Celebrity Problem" அல்லது "Hotspot Problem". ஒரு shard-ல மட்டும் ரொம்ப active users இருந்தா, அந்த DB மட்டும் overload ஆகும் (e.g. Virat Kohli's Instagram). இதை சால்வ் பண்ண Consistent Hashing அல்லது Directory-based sharding use பண்ணனும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க Reporting DB-க்கு Replication use பண்றோம். Main DB-ல writes நடக்கும், read replicas-ல analytics queries ஓடும். FHIR payload ரொம்ப பெருசா இருக்கறதால, future-ல tenant-based sharding (Hospital ID-ஐ sharding key-ஆ வெச்சு) பண்ணலாம்னு plan இருக்கு.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Sharding பண்றதுக்கு முன்னாடி எல்லா options-ஐயும் ட்ரை பண்ணனும் (Vertical scaling, Caching, Replication). ஏன்னா sharding code complexity-ஐ ரொம்ப அதிகமாக்கும். எந்த column-ஐ Shard Key-ஆ சூஸ் பண்றோம்ங்குறதுதான் architect-ஓட biggest challenge. 

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** What happens if one shard runs out of space in a modulo-based sharding setup?
*Answer:* Modulo sharding-ல புது shard add பண்ணா (N changes to N+1), எல்லா data-வும் re-shuffle பண்ணனும் (Massive downtime). இத தடுக்க Consistent Hashing sharding use பண்ணலாம்.

**Q:** How do you maintain ACID properties across multiple shards?
*Answer:* Two-Phase Commit (2PC) use பண்ணலாம், ஆனா அது ரொம்ப slow. Microservices architecture-ல SAGA pattern use பண்ணி Eventual Consistency கொண்டு வர்றதுதான் best approach.

---

## Quick Revision Summary

- Replication - Read load-ஐ குறைக்கும், Data backup-க்கு உதவும்.
- Sharding - Write load-ஐ குறைக்கும், DB size limits-ஐ தாண்டி வளர உதவும்.
- Shard Key selection ரொம்ப முக்கியம் (Hotspot problem வரக்கூடாது).
- Cross-shard joins மற்றும் transactions sharding-ல ரொம்ப கஷ்டம்.
