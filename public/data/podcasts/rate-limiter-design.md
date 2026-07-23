# Java Interview Podcast — Episode: Designing a Rate Limiter
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, System Design interviews-ல அடிக்கடி கேட்கும் கேள்வி, "Design a Rate Limiter". Rate Limiting என்றால் என்ன?

**Thiru:** கண்டிப்பா Mahi. **Rate Limiting** [ஒரு user அல்லது IP ஒரு குறிப்பிட்ட நேரத்துல எத்தனை API requests அனுப்பலாம்னு கட்டுப்படுத்தும் mechanism]. DDoS attacks-ஐ தடுக்கவும், server resources-ஐ பாதுகாக்கவும் இது ரொம்ப முக்கியம்.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** தியேட்டர் டிக்கெட் கவுண்டர்ல ஒரு ஆளுக்கு 4 டிக்கெட் தான் தருவோம்னு சொல்றது Rate Limiting. ஒருத்தரே எல்லா டிக்கெட்டையும் வாங்கிட்டு போயிட்டா மத்தவங்களுக்கு கிடைக்காது இல்லையா? அதே மாதிரிதான் API-லையும் ஒருத்தரே எல்லா bandwidth-ஐயும் காலி பண்ணாம தடுக்கிறோம்.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** நிறைய algorithms இருக்கு: Token Bucket, Leaky Bucket, Fixed Window, Sliding Window. Token Bucket ரொம்ப popular. Java-ல Bucket4j library use பண்ணி Spring Boot-ல ஈஸியா implement பண்ணலாம்.
```java
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;

import java.time.Duration;

public class RateLimiterService {
    // 1 நிமிஷத்துக்கு 10 tokens refill ஆகும்
    private final Bucket bucket;
    
    public RateLimiterService() {
        Bandwidth limit = Bandwidth.classic(10, Refill.greedy(10, Duration.ofMinutes(1)));
        this.bucket = Bucket.builder().addLimit(limit).build();
    }
    
    public boolean allowRequest() {
        // ஒரு token எடுத்து செக் பண்றோம்
        return bucket.tryConsume(1);
    }
}
```
Token இருந்தா request allow ஆகும், இல்லைனா HTTP 429 Too Many Requests error வரும்.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. Algorithms-க்கான comparison table இது:
| Algorithm | How it works | Pros & Cons |
|-----------|--------------|-------------|
| Token Bucket | Tokens are added at a constant rate | Allows bursts of traffic / Memory efficient |
| Leaky Bucket | Requests are processed at a fixed rate | Smooths traffic / Bursts are delayed or dropped |
| Fixed Window | Resets count every minute (e.g. 12:00, 12:01) | Easy / Burst at edges of window can bypass limits |
| Sliding Window | Uses timestamp logs to find exact rolling window | Very accurate / High memory usage (stores timestamps) |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** "Distributed systems-ல Rate Limiter எப்படி design பண்ணுவீங்க?" அப்படின்னு கேட்பாங்க. Single server-ல in-memory bucket ஓகே. ஆனா 10 servers இருந்தா, rate limit count-ஐ Redis மாதிரி ஒரு centralized cache-ல store பண்ணனும். Redis-ல INCR கமாண்ட் use பண்ணி count maintain பண்ணலாம்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Redis-ஐ use பண்ணும்போது network latency வரும். ஒவ்வொரு request-க்கும் Redis-ஐ hit பண்ணா API slow ஆகும். இதை சால்வ் பண்ண, கொஞ்ச நேரம் local cache-ல count வெச்சுட்டு, அப்புறம் Redis-க்கு async-ஆ sync பண்ணலாம். Race conditions வராம இருக்க Redis Lua scripts use பண்ணனும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க external hospitals-ல இருந்து FHIR data வாங்குறோம். சில சமயம் bulk data வரும்போது system crash ஆகாம இருக்க, API Gateway (Spring Cloud Gateway) level-ல Redis Rate Limiter configure பண்ணிருக்கோம் (100 req/sec per hospital).

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Rate limiter எங்க place பண்றோம்ங்குறது முக்கியம். Application server-ல வைக்கறத விட, API Gateway அல்லது Load Balancer level-ல வைக்கிறதுதான் best. Different tiers of users-க்கு (Free, Premium) different limits set பண்ணனும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** How does HTTP headers communicate rate limits to clients?
*Answer:* `X-Ratelimit-Remaining`, `X-Ratelimit-Limit`, மற்றும் `X-Ratelimit-Retry-After` headers மூலமா client-க்கு எவ்வளவு limit மிச்சம் இருக்கு, எப்போ திரும்ப try பண்ணலாம்னு சொல்லுவோம்.

**Q:** How do you handle race conditions in distributed rate limiting?
*Answer:* Redis-ல Read-Modify-Write பண்ணும்போது race condition வரும். இதை தடுக்க Redis Lua scripts use பண்ணலாம், ஏன்னா Lua scripts Redis-ல atomic-ஆ ரன் ஆகும்.

---

## Quick Revision Summary

- Rate Limiter system overload மற்றும் DDoS attacks-ஐ தடுக்கும்.
- HTTP status code 429 (Too Many Requests) return பண்ணும்.
- Token Bucket algorithm தான் Amazon, Stripe மாதிரி கம்பெனிஸ்ல use பண்றாங்க.
- Distributed systems-க்கு Redis + Lua scripts use பண்றது best practice.
