# Java Interview Podcast — Episode: Synchronous vs Asynchronous Communication
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, previous episode-ல Message Queue பார்த்தோம், அதுல "asynchronous" nu சொன்னீங்க. Synchronous-க்கும் Asynchronous-க்கும் exact-ஆ என்ன வித்தியாசம்?

**Thiru:** **Synchronous communication** என்றால், caller ஒரு request அனுப்பி, receiver response கொடுக்கும் வரைக்கும் **wait** பண்ணும் — receiver பதில் கொடுக்காம, caller-ன் அடுத்த line of code execute ஆகாது. **Asynchronous communication** என்றால், caller request அனுப்பிட்டு, response-க்கு wait பண்ணாமல் தன் அடுத்த வேலையை தொடரும். Response எப்போ வேணும்னாலும், தனியா callback அல்லது message மூலம் வரலாம்.

**Mahi:** எப்போ synchronous use பண்ணணும், எப்போ asynchronous?

**Thiru:** இது system-ன் requirement-ஐ பொறுத்தது. User உடனடியா result எதிர்பார்க்குற scenario-க்கு (உதாரணமா, login validate பண்றது) synchronous நல்லது. Time எடுக்கும் அல்லது immediate response தேவையில்லாத வேலைக்கு (உதாரணமா, email அனுப்றது, report generate பண்றது) asynchronous நல்லது.

---

## 1. Real World Analogy

**Mahi:** Analogy சொல்லுங்க.

**Thiru:** **Synchronous** என்பது ஒரு phone call மாதிரி — நீ call பண்ணி, receiver பதில் சொல்லும் வரைக்கும் line-ல wait பண்ணணும், வேற எந்த வேலையும் அதே நேரத்தில் பண்ண முடியாது. **Asynchronous** என்பது WhatsApp message அனுப்றது மாதிரி — நீ message அனுப்பிட்டு, உடனே வேற வேலைக்கு போகலாம். Receiver எப்போ வேணும்னாலும் பதில் சொல்லலாம், அது வந்ததும் notification வரும் — நீ wait பண்ணிக்கிட்டே இருக்க தேவையில்ல.

---

## 2. Synchronous Communication — How It Looks in Code

**Mahi:** Synchronous communication code-ல எப்படி இருக்கும்?

**Thiru:** REST API call ஒரு classic synchronous example. Caller, response வரும் வரைக்கும் thread block ஆகி wait பண்ணும்.

```java
// Synchronous REST call - thread WAITS here until response arrives
@Service
public class CaseReportService {

    private final RestTemplate restTemplate;

    public CaseReportResult submitCaseReport(TriggerEvent event) {
        // Execution BLOCKS here until patient-service responds
        Patient patient = restTemplate.getForObject(
            "http://patient-service/api/patients/" + event.getPatientId(),
            Patient.class
        );
        // This line only runs AFTER the above call completes
        return buildAndSubmit(patient, event);
    }
}
```

இதுல problem என்னன்னா, `patient-service` slow-ஆ இருந்தா அல்லது down-ஆ இருந்தா, calling thread அதே நேரம் முழுசும் wait பண்ணிக்கிட்டே இருக்கும் — thread pool exhaust ஆகும் risk இருக்கு.

---

## 3. Asynchronous Communication — How It Looks in Code

**Mahi:** Asynchronous communication எப்படி implement பண்றாங்க?

**Thiru:** Java-ல முக்கியமா இரண்டு வழிகள் — **CompletableFuture** [asynchronous computation-ன் result-ஐ represent பண்ணும் Java class, future-ல result கிடைக்கும்] use பண்றது, அல்லது **message queue** மூலமா completely decouple பண்றது.

```java
// Asynchronous using CompletableFuture - non-blocking
@Service
public class CaseReportService {

    @Async
    public CompletableFuture<Patient> fetchPatientAsync(Long patientId) {
        Patient patient = restTemplate.getForObject(
            "http://patient-service/api/patients/" + patientId,
            Patient.class
        );
        return CompletableFuture.completedFuture(patient);
    }

    public void processMultiplePatients(List<Long> patientIds) {
        List<CompletableFuture<Patient>> futures = patientIds.stream()
            .map(this::fetchPatientAsync) // fires all calls without waiting
            .collect(Collectors.toList());
        // Continue with other work; combine results later
    }
}
```

```java
// Asynchronous using Message Queue - fully decoupled
@Service
public class CaseReportEventPublisher {

    public void submitCaseReport(TriggerEvent event) {
        // Publish and move on immediately - don't wait for processing
        kafkaTemplate.send("case-report-events", event.getPatientId(), event);
        // Method returns here, doesn't wait for downstream processing
    }
}
```

இரண்டு approach-லயும், caller response-க்கு block ஆகி wait பண்ணாது.

---

## 4. Comparison Table

| Aspect | Synchronous | Asynchronous |
|---|---|---|
| **Caller behavior** | Waits (blocks) for response | Continues immediately, doesn't wait |
| **Coupling** | Tighter — caller depends on receiver being available right now | Looser — receiver can process later |
| **Complexity** | Simpler to write and reason about | More complex — need callbacks, futures, or queues |
| **Failure impact** | Failure immediately visible to caller | Failure needs separate handling (retry, dead letter queue) |
| **Best for** | Immediate response needed (login, payment authorization) | Long-running tasks, decoupled systems, high-throughput events |
| **Resource usage** | Thread blocked while waiting | Thread free to do other work |

---

## 5. Edge Cases

**Mahi:** Interview-ல trap பண்ணும் edge case சொல்லுங்க.

**Thiru:** ஒரு classic trap — "Synchronous calls chain-ஆ இருந்தா என்ன பிரச்சனை?" Service A, Service B-ஐ synchronous-ஆ call பண்ணும், Service B, Service C-ஐ synchronous-ஆ call பண்ணும்னா, இது ஒரு **chain of blocking calls** ஆகிடும். C slow-ஆ இருந்தா, அது B-ஐயும், B slow ஆனதால் A-ஐயும் slow ஆக்கும் — இதை **cascading latency** என்று சொல்வோம். இதனால தான் microservices-ல, தேவையில்லாத synchronous chains-ஐ தவிர்த்து, முடிந்தவரை asynchronous patterns use பண்ண recommend பண்றாங்க.

இன்னொரு trap — "Asynchronous-ஆ மாத்தினா error handling எப்படி மாறும்?" Synchronous-ல, error உடனே exception-ஆ caller-க்கு தெரியும். Asynchronous-ல, error எப்போ நடந்ததோ, caller அப்போ வேற வேலையில் இருக்கலாம் — அதனால **separate error handling mechanism** (callback-ல error handle பண்றது, Dead Letter Queue, அல்லது status-check endpoint) தேவைப்படும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்முடைய ECR Now project-ல synchronous, asynchronous எப்படி use ஆகுது?

**Thiru:** ECR Now [Electronic Case Reporting Now — hospital EHR systems-லிருந்து disease reporting-ஐ CDC-க்கு automatic-ஆக அனுப்பும் Spring Boot microservice] system-ல, இரண்டு approach-ம் use பண்றோம், context-ஐ பொறுத்து.

**Synchronous** — hospital system ஒரு trigger event அனுப்பும்போது, "இந்த request valid-ஆ received ஆச்சா" என்று உடனே acknowledge பண்ணணும் — இது synchronous REST response.

**Asynchronous** — actual FHIR document build பண்றது, CDC-க்கு submit பண்றது, response process பண்றது — இதெல்லாம் time எடுக்கக்கூடிய, immediate response தேவையில்லாத வேலைகள். அதனால, trigger event receive ஆனதும், அதை உடனே Kafka-க்கு publish பண்ணிட்டு, hospital system-க்கு "received" என்று உடனே acknowledge பண்ணிடுவோம். Actual processing பின்னாடி, asynchronous-ஆ நடக்கும்.

இதனால hospital system-ன் request fast-ஆ complete ஆகும், CDC submission slow-ஆ இருந்தாலும் hospital system-ஐ affect பண்ணாது.

---

## 7. Senior/Architect Perspective

**Mahi:** Senior engineer இதை எப்படி approach பண்ணணும்?

**Thiru:** Senior level-ல கேட்கவேண்டிய questions:

- User-facing flow-ல synchronous calls எத்தனை chain-ஆ இருக்கு? Cascading latency risk இருக்கா?
- Asynchronous flow-ல, processing fail ஆனா, user/caller-க்கு எப்படி தெரியப்படுத்துவோம்? (status polling, webhook, notification)
- Thread pool sizing synchronous calls-க்கு சரியா configure பண்ணிருக்கோமா? Blocking calls அதிகமா இருந்தா thread starvation risk.
- Asynchronous processing-ல ordering guarantee தேவையா? (Message Queue partition strategy இதற்கு தேவைப்படும்)
- Reactive programming (Spring WebFlux போன்றவை) பரிசீலிக்கணுமா — non-blocking I/O மூலம் thread efficiency அதிகரிக்குமா?

---

## 8. Interview Deep-Dive Questions

**Q:** Synchronous communication-ன் main disadvantage என்ன?
*Answer:* Caller receiver response கொடுக்கும் வரைக்கும் block ஆகி wait பண்ணும். Receiver slow-ஆ இருந்தா அல்லது down-ஆ இருந்தா, caller-ன் thread அதே நேரம் முழுசும் held ஆகி இருக்கும் — thread pool exhaustion risk வரும்.

**Q:** CompletableFuture-க்கும் Message Queue-க்கும் asynchronous approach-ல என்ன வித்தியாசம்?
*Answer:* CompletableFuture ஒரே application-க்குள்ள, same JVM-ல asynchronous execution-க்கு use ஆகும் — caller, callback மூலம் result பெறலாம். Message Queue services-ஐ முழுசா decouple பண்ணும் — producer, consumer வேற வேற systems-ஆ கூட இருக்கலாம், receiver அப்போ running-ஆ இல்லாட்டியும் message wait பண்ணும்.

**Q:** Cascading latency என்றால் என்ன?
*Answer:* Service A → B → C என்று synchronous calls chain-ஆ இருந்தா, C slow-ஆ இருந்தா, அது B-ஐயும் delay பண்ணும், B delay ஆனதால் A-வும் delay ஆகும். ஒவ்வொரு layer-ன் latency-ம் sum ஆகி, overall response time பெரிசா ஆகிடும்.

**Q:** Asynchronous approach-ல user-க்கு result எப்படி தெரியப்படுத்துவீங்க?
*Answer:* Multiple options — client periodic-ஆ status endpoint poll பண்ணலாம், server webhook மூலம் client-க்கு notify பண்ணலாம், அல்லது WebSocket மூலம் real-time push பண்ணலாம். Choice, use case மற்றும் client capability-ஐ பொறுத்தது.

---

## Quick Revision Summary

- Synchronous = caller blocks and waits for response; Asynchronous = caller continues without waiting
- Synchronous is simpler but creates tight coupling and risks cascading latency in call chains
- Asynchronous is more resilient and scalable but needs separate error handling (callbacks, Dead Letter Queue, status checks)
- Java async tools: `CompletableFuture` (in-process), Message Queue (cross-service, fully decoupled)
- Cascading latency = chained synchronous calls where each layer's delay adds up
- Use synchronous for immediate-response needs (login, payment auth); use asynchronous for long-running or decoupled work
- ECR Now: synchronous acknowledgment to hospital system on trigger receipt, asynchronous processing (FHIR build, CDC submission) via Kafka
- Reactive programming (e.g., Spring WebFlux) is a further step — non-blocking I/O to use threads more efficiently

**Mahi:** Super Thiru, இப்போ Synchronous vs Asynchronous வித்தியாசம் கிளியர்-ஆ புரியுது.

**Thiru:** Correct Mahi. அடுத்த episode-க்கு போலாம்.

---
*End of Episode: Synchronous vs Asynchronous Communication*
