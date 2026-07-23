# Java Interview Podcast — Episode: Idempotency
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, API design-ல Idempotency பத்தி நிறைய பேசுறாங்க. அப்படின்னா என்ன?

**Thiru:** கண்டிப்பா Mahi. **Idempotency** [ஒரு request-ஐ ஒரு தடவை அனுப்புனாலும், இல்ல 100 தடவை அனுப்புனாலும் system-ல ஒரே result தான் வரணும்]. Data duplicate ஆகவோ, state தப்பா மாறவோ கூடாது.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** Elevator (Lift) button-ஐ analogy-ஆ எடுத்துக்கலாம். 
- நீங்க lift button-ஐ ஒரு தடவை பிரஸ் பண்ணாலும் சரி, 10 தடவை பிரஸ் பண்ணாலும் சரி, lift உங்க floor-க்கு தான் வரும். இது Idempotent.
- ஆனா ATM-ல withdraw button-ஐ 2 தடவை பிரஸ் பண்ணா, 2 தடவை காசு வந்துடும். அது Non-idempotent.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Client ஒரு unique "Idempotency-Key" header-ஐ request கூட அனுப்புவாங்க. Server அந்த key-ஐ Redis-ல store பண்ணி வெச்சுக்கும். இதோ Java-ல ஒரு logic:

```java
public class IdempotencyService {
    private final Cache redisCache; // Assume a configured Redis Cache

    public IdempotencyService(Cache redisCache) {
        this.redisCache = redisCache;
    }

    public Response processPayment(String idempotencyKey, PaymentRequest request) {
        if (redisCache.exists(idempotencyKey)) {
            return redisCache.get(idempotencyKey); // Return previous result
        }
        
        // Process the new payment
        Response response = actualPaymentLogic(request);
        
        // Store the result against the key with expiry
        redisCache.put(idempotencyKey, response, Duration.ofHours(24));
        
        return response;
    }
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு (HTTP Methods):
| HTTP Method | Is Idempotent? | Reason |
|--------|----------|----------|
| GET | Yes | Data-ஐ read மட்டும் தான் பண்ணும், change பண்ணாது. |
| PUT | Yes | ஒட்டுமொத்த resource-ஐயும் replace பண்ணும். 10 தடவை replace பண்ணாலும் same state தான். |
| DELETE | Yes | ஒரு தடவை delete ஆனா, அடுத்த தடவை 404 வரும், ஆனா server state மாறாது. |
| POST | No | ஒவ்வொரு தடவையும் புது resource create ஆகிடும். |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** "Idempotency key-ஐ DB-ல store பண்ணலாமா இல்ல Cache-லயா?"னு கேட்பாங்க. Cache (Redis) தான் fast. ஆனா Redis restart ஆனா data போயிடும். அதனால critical systems-ல (Payments) DB-ல unique constraint போட்டு store பண்றது தான் safe-னு சொல்லணும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Race conditions வரும். ரெண்டு request ஒரே idempotency key வெச்சு ஒரே நேரத்துல வந்தா, Distributed Lock (Redisson) use பண்ணி ஒரு request-ஐ மட்டும் தான் process பண்ண விடணும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) Idempotency ரொம்ப முக்கியம். ஒரே patient report-ஐ CDC-க்கு திரும்ப திரும்ப அனுப்ப கூடாது. அதனால patient ID அப்புறம் timestamp வெச்சு ஒரு hash generate பண்ணி, அதை idempotency key-ஆ use பண்றோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Idempotency keys-க்கு expiration (TTL) set பண்ணனும். ஒரு நாள் கழிச்சு அந்த key தானா delete ஆகிடுற மாதிரி பாத்துக்கணும். அப்புறம் Stripe API மாதிரியான standard practices-ஐ follow பண்ணி `Idempotency-Key` HTTP header வழியா வாங்கணும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** POST method-ஐ எப்படி idempotent ஆக்குவீங்க?
*Answer:* Client கிட்ட இருந்து Idempotency-Key வாங்கி, request process பண்றதுக்கு முன்னாடி DB/Cache-ல அந்த key ஏற்கனவே இருக்கானு check பண்ணி, இருந்தா old response-ஐயே return பண்ணுவோம்.

**Q:** Distributed Lock இல்லாம Idempotency பண்ண முடியுமா?
*Answer:* Database-ல unique key constraint (e.g., Request ID column) create பண்ணிட்டா, DB level-லேயே duplicate insert ஆகுறத தடுத்துக்கலாம்.

---

## Quick Revision Summary

- Idempotency means safe to retry.
- GET, PUT, DELETE idempotent. POST is not.
- Idempotency-Key header use பண்ணி duplicate requests-ஐ தடுப்போம்.
- Redis with TTL or DB unique constraints use பண்ணி implement பண்ணலாம்.
