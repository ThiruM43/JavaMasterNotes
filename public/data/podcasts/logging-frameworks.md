# Java Interview Podcast — Episode: Logging Frameworks
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, Java-ல `System.out.println()` ஏன் production-ல use பண்ணக் கூடாது? Logging frameworks பத்தி சொல்லுங்க.

**Thiru:** கண்டிப்பா Mahi. `System.out.println()` ரொம்ப slow, synchronous, file-ல save பண்ண முடியாது, log levels கிடையாது. அதனால தான் **SLF4J** மற்றும் **Logback** / **Log4j2** மாதிரி logging frameworks use பண்றோம்.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு கம்பெனிக்கு ரிப்போர்ட் எழுதுறது மாதிரி:
- `System.out.println`: எல்லாத்தையும் போர்டுல எழுதி வைக்கிறது (No copy, no priority).
- **Logging Framework**: மேனேஜர்க்கு மட்டும் (ERROR), எல்லாருக்கும் (INFO), debugging-க்கு (DEBUG) னு பிரிச்சு File-ல record பண்றது.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** **SLF4J** (Simple Logging Facade for Java) வந்து ஒரு interface மாதிரி. அதோட implementation தான் **Logback** அல்லது **Log4j2**. 

```java
import org.slf44j.Logger;
import org.slf4j.LoggerFactory;

public class PaymentService {
    // SLF4J interface
    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    public void processPayment(String id) {
        log.info("Processing payment for ID: {}", id); // {} is faster than string concatenation
        try {
            // logic
        } catch (Exception e) {
            log.error("Payment failed for ID: {}", id, e);
        }
    }
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. Log levels-ஐ பாரு:
| Log Level | When to use | Example |
|--------|----------|----------|
| ERROR | Critical failures | DB connection lost, Exception caught |
| WARN | Potential issues | Deprecated API used, Retry mechanism triggered |
| INFO | Normal business flow | "User 123 logged in", "Payment successful" |
| DEBUG | Diagnostic info for developers | Request payload, variable states |
| TRACE | Very detailed execution trace | Entering method A, exiting method B |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** "String concatenation (using `+`) ஏன் log statements-ல use பண்ணக் கூடாது?"-னு கேட்பாங்க. ஏன்னா log level INFO-வா இருந்தா, DEBUG level statements print ஆகாது. ஆனா `+` use பண்ணா string concat ஆகும்போதே memory waste ஆகும். அதனால தான் `{}` (parameterized logging) use பண்றோம்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Log files ரொம்ப பெருசாகி Disk Space Full ஆகிடும். அதனால Log Rotation configure பண்ணனும் (e.g., daily 10MB-க்கு மேல போனா zip பண்ணி வச்சுக்கணும்). PII data (Passwords, Credit Cards) logs-ல print ஆகாம பாத்துக்கணும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க SLF4J with Logback use பண்றோம். Logs-ஐ JSON format-ல console-ல print பண்றோம். அதை Splunk / ELK stack வந்து ஈஸியா parse பண்ணிக்கும். `MDC` (Mapped Diagnostic Context) use பண்ணி ஒவ்வொரு request-க்கும் ஒரு Unique Trace ID வச்சு track பண்றோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Microservices architecture-ல Distributed Tracing ரொம்ப முக்கியம். Sleuth அல்லது Micrometer Tracing use பண்ணி Trace ID, Span ID inject பண்ணனும். அப்போ தான் பல services தாண்டி போற request-ஐ ஒரே id வச்சு track பண்ண முடியும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Asynchronous logging-னா என்ன?
*Answer:* Logback/Log4j2-ல AsyncAppender இருக்கு. Main thread-ஐ block பண்ணாம, logs-ஐ ஒரு queue-ல போட்டு background thread வழியா file-ல எழுதுறது. Performance ரொம்ப இம்ப்ரூவ் ஆகும்.

**Q:** MDC (Mapped Diagnostic Context) எப்படி work ஆகுது?
*Answer:* ThreadLocal use பண்ணி work ஆகுது. ஒரு thread-க்கு தேவையான logging contextual data-வை (like user ID, session ID) ஸ்டோர் பண்ணி எல்லா log statements-லையும் தானா வர வைக்கும்.

---

## Quick Revision Summary

- Don't use `System.out.println`; use SLF4J with Logback/Log4j2.
- Log levels: ERROR, WARN, INFO, DEBUG, TRACE.
- Use parameterized logging `{}` to save memory.
- Use MDC for tracing requests across microservices.
