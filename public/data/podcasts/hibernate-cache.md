# Java Interview Podcast — Episode: First vs Second-level Cache
### Hosts: Mahi & Thiru

---

**Mahi:** இன்னைக்கு நாம Hibernate Caching, குறிப்பா First vs Second-level Cache பத்தி பேசலாம். Caching ஏன் Hibernate-ல முக்கியம்?

**Thiru:** கண்டிப்பா Mahi. **Caching** [Data-வை memory-ல store பண்ணி வெச்சி வேகமா access பண்றது] database round trips-ஐ குறைச்சு application performance-ஐ இன்க்ரீஸ் பண்ணும். Hibernate-ல ரெண்டு level caching இருக்கு.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு office-ஐ எடுத்துக்கோ.
**First-level cache:** உன் desk-ல இருக்குற drawer மாதிரி. உனக்கு மட்டும் தான் சொந்தம், நீ மட்டும் தான் file எடுக்க முடியும் (Session scope).
**Second-level cache:** Office library மாதிரி. எல்லாருக்கும் common. உனக்கு desk-ல கிடைக்கலன்னா, library-ல தேடுவ (Session Factory scope).

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** First level cache default-ஆ on-ல தான் இருக்கும், அதை off பண்ண முடியாது. Second level cache-ஐ நாம்ப தான் enable பண்ணனும் (Ehcache or Hazelcast).

```java
// Enabling L2 Cache in properties
// spring.jpa.properties.hibernate.cache.use_second_level_cache=true
// spring.jpa.properties.hibernate.cache.region.factory_class=org.hibernate.cache.ehcache.EhCacheRegionFactory

@Entity
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Department {
    @Id
    private Long id;
    private String name;
}
```
இங்க `@Cacheable` போட்டாதான் L2 cache-ல store ஆகும்.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Feature | First-Level Cache | Second-Level Cache |
|--------|----------|----------|
| **Scope** | Session / EntityManager | SessionFactory / App Level |
| **Availability** | Enabled by default | Disabled by default |
| **Data Sharing** | Private to the transaction | Shared across all sessions |
| **Provider** | Hibernate natively | Ehcache, Hazelcast, Redis |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** "First level cache-ஐ disable பண்ண முடியுமா?" னு கேப்பாங்க. முடியாது. ஆனா `session.clear()` அல்லது `session.evict(entity)` use பண்ணி cache-ஐ clear பண்ணலாம். இன்னொன்னு, Query Cache பத்தி கேப்பாங்க, L2 cache entities-க்கு மட்டும் தான், query results-க்கு Query Cache தனி.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** L2 cache-ல Stale Data பெரிய problem. Database-ஐ வேற ஒரு application நேரடியாக update பண்ணிட்டா, L2 cache-க்கு தெரியாது. அப்போ பழைய data தான் user-க்கு போகும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க static lookup tables (like state codes, hospital IDs) க்கு Second Level Cache (Hazelcast) use பண்றோம். ஏன்னா இந்த data மாறவே மாறாது, DB hit பண்றத தடுத்து performance ரொம்ப நல்லா இம்ப்ரூவ் ஆச்சு.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Distributed microservices-ல local in-memory L2 cache (like Ehcache) use பண்ணா inconsistency வரும். அதனால Redis மாதிரி distributed cache use பண்றது தான் architecturally correct.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** What is CacheConcurrencyStrategy?
*Answer:* L2 cache-ல data-வை எப்படி safe-ஆ access பண்றதுன்னு சொல்றது. `READ_ONLY` (மாற்றவே முடியாத data), `READ_WRITE` (மாறக்கூடிய data), `NONSTRICT_READ_WRITE` னு நிறைய strategies இருக்கு.

**Q:** Does Query execution use First Level Cache?
*Answer:* HQL/JPQL `SELECT` query execute பண்ணும்போது L1 cache-ஐ check பண்ணாது, நேரா DB போகும். ஆனா `findById` பண்ணா மட்டும்தான் L1 cache-ல தேடும்.

---

## Quick Revision Summary

- First-level cache is default, tied to the Hibernate Session.
- Second-level cache is optional, tied to SessionFactory (shared).
- L2 requires external providers like Ehcache or Hazelcast.
- Use `@Cacheable` and `@Cache` annotations to enable L2 for entities.
- Beware of stale data when bypassing Hibernate to update the DB.
