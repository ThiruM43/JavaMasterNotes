# Java Interview Podcast — Episode: Throttling vs Rate Limiting
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, Throttling-க்கும் Rate Limiting-க்கும் என்ன வித்தியாசம்? ரெண்டும் ஒன்னு தானா?

**Thiru:** நல்ல கேள்வி Mahi. ரெண்டும் ஒன்னு இல்ல. **Rate Limiting** [குறிப்பிட்ட limit-ஐ தாண்டுனா requests-ஐ reject பண்றது]. ஆனா **Throttling** [வேகத்தை குறைக்கிறது, requests-ஐ drop பண்ணாம delay பண்ணி process பண்றது].

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** இதை traffic rules-ஆ வெச்சு பார்ப்போம்:
- **Rate Limiting:** ஒரு bridge-ல 100 வண்டி தான் போக முடியும்னு ஒரு board இருக்கு. 101-வது வண்டி வந்தா, gate-ஐ சாத்திட்டு allow பண்ண மாட்டாங்க.
- **Throttling:** ஒரு speed bump மாதிரி. வண்டிகள் போகலாம், ஆனா வேகமா போக முடியாது, slow-ஆ போகணும்.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Rate Limiter requests-ஐ check பண்ணி HTTP 429 throw பண்ணும். ஆனா Throttler ஒரு queue-ல requests-ஐ வெச்சு, delay பண்ணி அனுப்புவோம். இதோ ஒரு Java logic:

```java
public class Throttler {
    private final Queue<Runnable> taskQueue = new LinkedList<>();
    private final long delayMs;

    public Throttler(long delayMs) {
        this.delayMs = delayMs;
        startProcessing();
    }

    public synchronized void submit(Runnable task) {
        taskQueue.add(task);
    }

    private void startProcessing() {
        new Thread(() -> {
            while (true) {
                Runnable task;
                synchronized (this) {
                    task = taskQueue.poll();
                }
                if (task != null) {
                    task.run();
                }
                try {
                    Thread.sleep(delayMs);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        }).start();
    }
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Throttling | Rate Limiting |
|--------|----------|----------|
| Purpose | Traffic-ஐ smooth பண்றதுக்கு | Server crash ஆகாம தடுக்க |
| Action on Limit | Request-ஐ delay பண்ணும் | Request-ஐ reject பண்ணும் (Drop) |
| Response | மெதுவா response வரும் | HTTP 429 Too Many Requests |
| User Experience | கொஞ்சம் slow-ஆ இருக்கும், ஆனா error வராது | Error message வரும், retry பண்ண சொல்லும் |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** "உங்க system-ல queue full ஆனா என்ன பண்ணுவீங்க?"னு கேட்பாங்க. Throttling-ல queue size-ஐயும் limit பண்ணனும், இல்லனா OutOfMemoryError (OOM) வந்துடும்னு சொல்லணும். ரெண்டையும் சேர்த்து use பண்ணலாமானு கேட்பாங்க, கண்டிப்பா use பண்ணலாம்னு சொல்லணும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Throttling use பண்ணும்போது client side timeout ஆக வாய்ப்பு இருக்கு. ஏன்னா server requests-ஐ hold பண்ணி வெச்சிருக்கும். அதனால client-ல timeout value கரெக்டா set பண்ணனும். 

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க ரெண்டையுமே use பண்றோம். IMAP-ல இருந்து emails-ஐ read பண்ணும்போது Throttling use பண்ணி மெதுவா read பண்றோம் (CPU spike வராம இருக்க). FHIR server-க்கு data அனுப்பும்போது API provider-ஐ தாண்டி hit பண்ண கூடாதுனு Rate Limiting use பண்றோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Cost-ஐ control பண்ணவும் Throttling use பண்ணலாம். Cloud functions-ல நிறைய concurrency போனா cost அதிகமாகும். Queueing systems (Kafka/RabbitMQ) use பண்ணி decoupled throttling implement பண்றது தான் best architecture practice.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** API Gateway-ல Throttling எப்படி setup பண்ணுவீங்க?
*Answer:* AWS API Gateway-ல Burst Limit மற்றும் Rate Limit-ஐ configure பண்ணுவோம். Queueing mechanism backend-ல SQS வழியா implement பண்ணலாம்.

**Q:** Client-side throttling எப்படி பண்றது?
*Answer:* Client-side-ல request அனுப்பும்போதே rate limit-ஐ தெரிஞ்சுக்கிட்டு, client-ஏ requests-ஐ delay பண்ணி அனுப்புறது (Guava RateLimiter use பண்ணி).

---

## Quick Revision Summary

- Rate limiting requests-ஐ reject பண்ணும், 429 error கொடுக்கும்.
- Throttling requests-ஐ slow down பண்ணும், queue-ல வைக்கும்.
- Queue size பெரியதாக இருந்தா memory issues வரும்.
- ரெண்டையும் சேர்த்து use பண்றது best practice.
