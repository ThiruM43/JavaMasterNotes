# Java Interview Podcast — Episode: Circuit Breaker
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, Microservices-ல Circuit Breaker pattern ரொம்ப முக்கியம்னு சொல்றாங்களே, அதை பத்தி பேசுவோமா?

**Thiru:** கண்டிப்பா Mahi. **Circuit Breaker** [ஒரு service fail ஆகும்போது, திரும்ப திரும்ப request அனுப்பி system-ஐ crash பண்ணாம தடுக்கிற ஒரு pattern]. இதுல CLOSED, OPEN, HALF-OPENனு மூணு states இருக்கு.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** நம்ம வீட்டுல இருக்குற electrical circuit breaker தான் best example.
- **CLOSED:** Current normal-ஆ flow ஆகும். 
- **OPEN:** Voltage அதிகமானா trip ஆகிடும் (Open). Current supply cut ஆகிடும்.
- **HALF-OPEN:** கொஞ்ச நேரம் கழிச்சு நாமே switch-ஐ on பண்ணி பார்ப்போம். திரும்பவும் voltage அதிகமா இருந்தா trip ஆகிடும், இல்லனா normal ஆகிடும்.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Resilience4j library use பண்ணி Java-ல implement பண்ணலாம். Failure threshold தாண்டுனா state OPEN-க்கு மாறும். இதோ Resilience4j config example:

```java
import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import java.time.Duration;

public class CircuitBreakerSetup {
    public CircuitBreakerConfig getConfig() {
        return CircuitBreakerConfig.custom()
            .failureRateThreshold(50) // 50% failures
            .waitDurationInOpenState(Duration.ofSeconds(10)) // HALF-OPEN wait time
            .permittedNumberOfCallsInHalfOpenState(3) // allow 3 test calls
            .slidingWindowSize(10) // check last 10 calls
            .build();
    }
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| State | Meaning | Request Action | Next Step |
|--------|----------|----------|----------|
| CLOSED | Normal Operation | Process requests normally | Failures அதிகமானா OPEN ஆகும் |
| OPEN | System is failing | Block requests immediately | Timeout முடிஞ்சதும் HALF-OPEN ஆகும் |
| HALF-OPEN | Testing if system recovered | Allow a few test requests | Success ஆனா CLOSED, Fail ஆனா OPEN |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** "எல்லா exceptions-க்கும் circuit breaker open ஆகுமா?"னு கேட்பாங்க. Business exceptions (e.g. Invalid User Input 400 Bad Request) வந்தா circuit open ஆக கூடாது, network failures (500, timeouts) வந்தா மட்டும்தான் open ஆகணும்னு configure பண்ணனும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** HALF-OPEN state-ல system properly recover ஆகாமலே traffic-ஐ allow பண்ணா, மறுபடியும் fail ஆகும். Fallback mechanism கண்டிப்பா வைக்கணும். அதாவது circuit OPEN-ஆ இருக்கும்போது default response (cache data) அனுப்பணும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க FHIR server-க்கு connect பண்ண Resilience4j Circuit Breaker use பண்றோம். CDC server down ஆனா, நம்ம app hang ஆக கூடாதுனு circuit-ஐ open பண்ணிட்டு, reports-ஐ local database-ல queue பண்ணிடுவோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** ThreadPool bulkhead pattern கூட சேர்த்து circuit breaker-ஐ use பண்ணனும். Metrics (Micrometer, Prometheus) use பண்ணி circuit breaker states-ஐ monitor பண்றது ரொம்ப முக்கியம், அப்போ தான் alerting setup பண்ண முடியும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Fallback method-ல என்ன மாதிரியான logic எழுதுவீங்க?
*Answer:* Cache-ல இருக்குற பழைய data-ஐ return பண்ணலாம், இல்லன்னா message-ஐ Kafka queue-ல push பண்ணிட்டு client-க்கு "Accepted for processing"-னு சொல்லலாம்.

**Q:** Sliding Window (Count based) vs Sliding Window (Time based) என்ன வித்தியாசம்?
*Answer:* Count based-ல கடைசி 100 requests-ஐ வச்சு failure rate check பண்ணுவோம். Time based-ல கடைசி 1 நிமிஷத்துல நடந்த requests-ஐ வச்சு check பண்ணுவோம்.

---

## Quick Revision Summary

- Circuit breaker cascading failures-ஐ தடுக்கும்.
- CLOSED, OPEN, HALF-OPEN states ரொம்ப முக்கியம்.
- Resilience4j-ல exceptions-ஐ filter பண்ணி configure பண்ணலாம்.
- Fallback response வெக்கிறது best practice.
