# Java Interview Podcast — Episode: Caching Strategies with Redis
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, இன்னைக்கு caching strategies பத்தி பேசலாம். முக்கியமா Redis use பண்ணி எப்படி caching பண்றது?

**Thiru:** கண்டிப்பா Mahi. **Caching** [அடிக்கடி தேவைப்படும் data-ஐ fast memory-ல store பண்றது] ரொம்ப முக்கியம். Redis ஒரு in-memory data store. இதுல Cache Aside, Read Through, Write Through, Write Behind மாதிரி பல **Strategies** [Data-ஐ எப்படி cache-ல எழுதுறது, படிக்கிறது என்பதற்கான வழிமுறைகள்] இருக்கு.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** நீ ஒரு லைப்ரரிக்கு போற. உனக்கு ஒரு புக் வேணும். லைப்ரரியன் அந்த புக்கை மெயின் ஸ்டோர்ல இருந்து எடுத்து தராங்க. அது மெதுவா நடக்கும் (Database fetch). ஆனா அடுத்த முறை நீ அதே புக்கை கேட்கும்போது, லைப்ரரியன் அதை அவங்க டேபிள் மேலேயே (Cache) வெச்சிருந்தா உடனே குடுத்துடுவாங்க. இதுதான் Caching.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Spring Boot-ல Redis caching ரொம்ப ஈஸி. `@Cacheable` annotation use பண்ணலாம். Cache Aside strategy-ல code எப்படி இருக்கும்னு பாரு:
```java
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    // Redis-ல data இருந்தா உடனே return பண்ணும், இல்லைனா DB-ல இருந்து எடுத்து Redis-ல போட்டு return பண்ணும்
    @Cacheable(value = "users", key = "#id")
    public User getUserById(Long id) {
        System.out.println("Fetching from DB...");
        return userRepository.findById(id).orElseThrow();
    }
}
```
Cache miss ஆகும்போது DB-ல இருந்து data எடுத்து, அப்புறம் Cache-ல update பண்ணுவோம். இதுதான் Cache Aside.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Cache Aside | Write Through | Write Behind (Write Back) |
|--------|-------------|---------------|---------------------------|
| Read/Write | Application cache & DB ரெண்டையும் handle பண்ணும் | Cache-ல எழுதி, அது DB-ல எழுதும் | Cache-ல எழுதி, background-ல DB-ல எழுதும் |
| Speed | Read fast, first read slow | Write slow | Read & Write ரொம்ப fast |
| Data Loss | No data loss | No data loss | Cache crash ஆனா data loss ஆக வாய்ப்பு இருக்கு |
| Use Case | General purpose (eg. User Profile) | High consistency தேவைப்படும் இடங்கள் | High write throughput (eg. Analytics) |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Cache invalidation பத்தி கண்டிப்பா கேட்பாங்க. "DB-ல data update ஆனா cache-ல எப்படி தெரியும்?" அப்படின்னு கேட்பாங்க. TTL (Time to Live) வெக்கலாம், அல்லது `@CachePut`, `@CacheEvict` use பண்ணி manually cache-ஐ clear பண்ணலாம். இன்னொன்னு Cache Stampede problem, அதாவது ஒரே நேரத்துல நிறைய requests வந்து cache miss ஆகி DB-ஐ hit பண்றது.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Memory limit ஒரு பெரிய problem. Redis-ல memory full ஆனா என்ன ஆகும்? Eviction policies (LRU - Least Recently Used, LFU - Least Frequently Used) சரியா configure பண்ணனும். Redis cluster use பண்ணி high availability ensure பண்ணனும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க FHIR metadata மற்றும் token validation-க்கு Redis Cache Aside pattern use பண்றோம். Token validation அடிக்கடி நடக்கும், அதனால Redis-ல cache பண்ணி DB load-ஐ குறைச்சிருக்கோம். TTL 15 minutes set பண்ணிருக்கோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** எந்த data-ஐ cache பண்ணனும்னு முடிவு பண்றது முக்கியம். அடிக்கடி மாறாத data, ஆனா அடிக்கடி read பண்ற data-ஐ மட்டும் cache பண்ணனும். Cache coherence, distributed cache architecture, Redis vs Memcached differences இதெல்லாம் architect level-ல யோசிக்கணும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** How do you solve the Cache Stampede (Thundering Herd) problem?
*Answer:* Locking mechanisms use பண்ணலாம் (ஒரு request மட்டும் DB hit பண்ணி cache update பண்ணும்). அல்லது Redis-ல distributed lock (Redisson) use பண்ணலாம்.

**Q:** What is Cache Penetration and how to prevent it?
*Answer:* இல்லாத ஒரு key-ஐ அடிக்கடி query பண்ணி DB hit ஆகுறதுதான் Cache Penetration. இத தடுக்க Bloom Filters use பண்ணலாம் அல்லது null values-ஐயும் short TTL-ஓட cache பண்ணலாம்.

---

## Quick Revision Summary

- Caching database load-ஐ குறைக்கும், response time-ஐ அதிகமாக்கும்.
- Cache Aside தான் ரொம்ப common strategy (Application directly talks to Cache and DB).
- Cache Invalidation ரொம்ப கஷ்டமான problem, TTL & Eviction policies முக்கியம்.
- Cache Stampede, Cache Penetration, Cache Avalanche எல்லாம் interview-ல அடிக்கடி கேட்கும் topics.
