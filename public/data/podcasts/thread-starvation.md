# Java Interview Podcast — Episode: Thread Starvation / Thread Pool Exhaustion
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, deadlock பார்த்தோம், அது permanent freeze. "Thread starvation", "thread pool exhaustion" — இதுவும் similar problem-ஆ?

**Thiru:** Related, ஆனா வேறு Mahi. **Thread starvation** என்பது, ஒரு thread, CPU time அல்லது resource கிடைக்காம, தொடர்ந்து wait பண்ணிக்கிட்டே இருக்கும் நிலை — deadlock மாதிரி permanent-ஆ இல்லாட்டியும், அந்த thread progress பண்றது extremely slow-ஆ ஆகிடும். **Thread pool exhaustion** என்பது, ஒரு application-ன் **thread pool** [reusable threads-ன் fixed collection, requests process பண்ண use ஆகும்] full-ஆ ஆகி, புது requests-க்கு free thread கிடைக்காத நிலை — புது requests எல்லாம் queue-ல wait பண்ணும், அல்லது reject ஆகும்.

**Mahi:** Real production-ல இது எப்படி தெரியும்?

**Thiru:** Application response time suddenly slow ஆகும், அல்லது requests **timeout** ஆகும், ஆனா CPU usage அவ்வளவு high-ஆ இல்லாம இருக்கும் — இது thread pool exhaustion-ன் classic symptom. CPU busy இல்ல, ஆனா threads எல்லாம் ஏதோ ஒண்ணுக்காக wait பண்ணிக்கிட்டு, புது work எடுக்க முடியாம இருக்கும்.

---

## 1. Real World Analogy

**Mahi:** Analogy சொல்லுங்க.

**Thiru:** ஒரு restaurant-ல 10 waiters (thread pool) மட்டும் இருக்குனு நினைச்சுக்கோ. ஒவ்வொரு waiter-ம், ஒரு customer-ன் order எடுத்து, kitchen-க்கு போய், food தயார் ஆகும் வரைக்கும் **அங்கேயே நின்னு wait பண்றார்** (blocking call) என்று வெச்சுக்கோ. Kitchen slow-ஆ இருந்தா, எல்லா 10 waiters-ம் kitchen-க்கு முன்னாடி நின்னு wait பண்ணிக்கிட்டு இருப்பாங்க — அவங்களால புது customers-ன் order எடுக்கவே முடியாது. Restaurant-க்குள்ள seats காலி இருந்தாலும், waiters இல்லாததால், புது customers serve ஆகாம wait பண்ணணும் — இது தான் thread pool exhaustion.

---

## 2. Why Thread Pools Get Exhausted

**Mahi:** Thread pool exhaustion-க்கு main causes என்ன?

**Thiru:** முக்கிய காரணங்கள்:

- **Slow downstream calls** — ஒரு thread, external API/database call-க்கு response காத்திருக்கும்போது, அந்த thread வேற எந்த work-ம் பண்ண முடியாது. Downstream slow-ஆ இருந்தா, threads அதிக நேரம் "busy" (ஆனா useless-ஆ) இருக்கும்.
- **Missing/high timeout** — Timeout configure பண்ணாம இருந்தா, ஒரு slow call, thread-ஐ **indefinite-ஆ** hold பண்ணிடும்.
- **Thread pool size too small** — Traffic-க்கு ஏத்த மாதிரி thread pool size configure பண்ணாம இருந்தா, high load-ல quickly exhaust ஆகிடும்.
- **Blocking I/O inside synchronized blocks** — network call/DB call-ஐ lock வைச்சிருக்கும்போது பண்ணா, மற்ற threads lock-க்காகவும், அந்த I/O முடியும் வரைக்கும் extra time-ம் wait பண்ணணும்.

```java
// BAD - blocking call without timeout, ties up thread pool threads
@RestController
public class CaseReportController {

    @PostMapping("/submit")
    public ResponseEntity<String> submit(@RequestBody TriggerEvent event) {
        // No timeout configured - if CDC is slow, this thread waits forever
        String response = restTemplate.postForObject(
            "http://cdc-external-api/submit", event, String.class
        );
        return ResponseEntity.ok(response);
    }
}
```

இதுல, CDC external API slow-ஆ இருந்தா, ஒவ்வொரு incoming request-ம், ஒரு thread pool thread-ஐ hold பண்ணி வெச்சுக்கும். Thread pool default size (உதாரணமா Tomcat-ல 200) reach ஆனதும், புது requests எல்லாம் **queue-ல stuck** ஆகும் — response time exponentially அதிகரிக்கும்.

---

## 3. Diagnosing Thread Pool Exhaustion — Thread Dump

**Mahi:** இதை எப்படி production-ல confirm பண்றது?

**Thiru:** Thread dump எடுத்தா தெளிவா தெரியும் — பல threads, ஒரே pattern-ல, ஒரே external call-ல stuck-ஆ இருக்கும்.

```
"http-nio-8080-exec-45" #67 RUNNABLE
        at java.net.SocketInputStream.socketRead0(Native Method)
        at com.ecrnow.client.CdcSubmissionClient.submit(CdcSubmissionClient.java:52)
        at com.ecrnow.service.CaseReportService.processReport(CaseReportService.java:34)

"http-nio-8080-exec-46" #68 RUNNABLE
        at java.net.SocketInputStream.socketRead0(Native Method)
        at com.ecrnow.client.CdcSubmissionClient.submit(CdcSubmissionClient.java:52)
        at com.ecrnow.service.CaseReportService.processReport(CaseReportService.java:34)

... (150+ more threads, same stack trace)
```

இப்படி **50+ threads, ஒரே external call (`CdcSubmissionClient.submit`)-ல stuck-ஆ** இருந்தா, இது lock contention இல்ல, thread pool exhaustion — external dependency slow-ஆ இருப்பதால், thread pool-ன் capacity முழுசும் அந்த ஒரு slow call-க்காக consume ஆகிக்கிட்டிருக்கு.

---

## 4. Fixing Thread Pool Exhaustion

**Mahi:** இதை எப்படி fix பண்றது?

**Thiru:** முக்கிய fixes:

**1. Add timeouts to all external calls:**

```java
// GOOD - explicit timeout, thread won't be held indefinitely
@Bean
public RestTemplate restTemplate() {
    HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
    factory.setConnectTimeout(3000);  // 3 seconds to establish connection
    factory.setReadTimeout(5000);     // 5 seconds to read response
    return new RestTemplate(factory);
}
```

**2. Use Circuit Breaker to fail fast when a dependency is consistently slow:**

```java
@CircuitBreaker(name = "cdcService", fallbackMethod = "fallbackSubmit")
public String submitToCloud(TriggerEvent event) {
    return cdcClient.submit(event);
}

public String fallbackSubmit(TriggerEvent event, Exception ex) {
    return "CDC service unavailable, queued for retry";
}
```

**3. Separate thread pools for different types of work** — slow external calls shouldn't share a pool with fast internal operations:

```java
@Bean(name = "cdcTaskExecutor")
public Executor cdcTaskExecutor() {
    ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
    executor.setCorePoolSize(20);
    executor.setMaxPoolSize(50);
    executor.setQueueCapacity(100);
    executor.setThreadNamePrefix("cdc-async-");
    return executor;
}
```

**4. Move to asynchronous processing** — instead of the web thread blocking on the slow call, hand off to a message queue (covered in the Message Queue episode) so the web thread is freed immediately.

---

## 5. Thread Starvation — A Related but Distinct Problem

**Mahi:** Thread starvation exact-ஆ எப்போ நடக்கும்? Pool exhaustion-ல இருந்து எப்படி வேறுபடும்?

**Thiru:** Thread starvation, **thread priority** அல்லது **unfair scheduling** காரணமா நடக்கலாம் — சில threads, CPU time constantly கிடைச்சு, மற்ற threads-க்கு chance கிடைக்காம போகும். உதாரணமா, ஒரு low-priority thread, high-priority threads தொடர்ந்து run ஆகிக்கிட்டே இருந்தா, CPU time கிடைக்காம starve ஆகலாம். Pool exhaustion, resource (thread pool) capacity-ஐ பொறுத்தது; starvation, scheduling fairness-ஐ பொறுத்தது — ஆனா real production-ல, "thread starvation" என்ற term பெரும்பாலும் pool exhaustion-ஐயே loosely refer பண்ண use ஆகும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்முடைய ECR Now project-ல thread pool exhaustion நடந்த scenario சொல்லுங்க.

**Thiru:** ECR Now [Electronic Case Reporting Now — hospital EHR systems-லிருந்து disease reporting-ஐ CDC-க்கு automatic-ஆக அனுப்பும் Spring Boot microservice] system-ல, ஒரு பெரிய hospital, unusual-ஆ அதிக trigger events அனுப்பின day-ல, application slow ஆகி response time spike ஆனது. CPU usage normal-ஆவே இருந்துச்சு, ஆனா response time 10x அதிகரிச்சுச்சு.

Thread dump எடுத்தா, Tomcat-ன் entire thread pool (200 threads), CDC external API call-க்காக wait பண்ணிக்கிட்டு இருந்தது — CDC அன்னைக்கு அவங்க side-ல ஒரு issue காரணமா slow-ஆ respond பண்ணிக்கிட்டு இருந்தாங்க. நாங்க அப்போ **timeout configure பண்ணி** இருக்கல, அதனால threads indefinite-ஆ wait பண்ணி, thread pool முழுசும் exhaust ஆகிடுச்சு.

Fix — REST client-க்கு explicit connect/read timeouts add பண்ணோம், Circuit Breaker implement பண்ணோம் (CDC repeatedly slow-ஆ இருந்தா, fail-fast பண்ணி, request-ஐ retry queue-க்கு அனுப்புற மாதிரி), மற்றும் CDC-related calls-க்கு **தனி thread pool** allocate பண்ணோம் — இதனால, CDC slow-ஆ இருந்தாலும், மற்ற internal operations-க்கான threads affect ஆகாம இருந்துச்சு.

---

## 7. Senior/Architect Perspective

**Mahi:** Senior engineer இதை எப்படி approach பண்ணணும்?

**Thiru:** Senior level-ல கேட்கவேண்டிய questions:

- ஒவ்வொரு external call-க்கும் explicit timeout configure பண்ணிருக்கோமா? (இது non-negotiable best practice)
- Slow, unreliable external dependencies-க்கு தனி thread pools allocate பண்ணிருக்கோமா, main request-handling pool-ஐ affect பண்ணாம?
- Circuit Breaker pattern implement பண்ணிருக்கோமா, repeatedly failing dependency-ஐ fail-fast பண்ண?
- Thread pool metrics (active threads, queue size) monitor பண்றோமா, exhaustion நடக்கும் முன்பே alert கிடைக்குமா?
- Synchronous blocking calls-ஐ asynchronous/reactive approach-க்கு மாத்தினா thread efficiency அதிகரிக்குமா?

---

## 8. Interview Deep-Dive Questions

**Q:** Thread pool exhaustion-க்கும் Deadlock-க்கும் என்ன வித்தியாசம்?
*Answer:* Deadlock-ல, threads ஒன்றை ஒன்று circular-ஆ wait பண்ணி permanent-ஆ freeze ஆகும். Thread pool exhaustion-ல, threads ஒரு slow external dependency-க்காக wait பண்ணும் — dependency eventually respond பண்ணா, threads free ஆகும், ஆனா அதுவரை புது requests process பண்ண முடியாது.

**Q:** Thread pool exhaustion-ஐ எப்படி production-ல detect பண்ணுவீங்க?
*Answer:* CPU usage normal-ஆ இருந்தும், response time spike ஆகி இருந்தா அது classic symptom. Thread dump எடுத்தா, பல threads ஒரே external call-ல stuck-ஆ இருக்கும் — இது confirm பண்ணும்.

**Q:** Timeout configure பண்றது ஏன் இவ்வளவு முக்கியம்?
*Answer:* Timeout இல்லாம, ஒரு slow/hung external call, thread-ஐ indefinite-ஆ hold பண்ணிடும். Traffic அதிகமாகும்போது, quickly thread pool முழுசும் exhaust ஆகி, முழு application-மே unresponsive ஆகிடும். Timeout இருந்தா, thread ஒரு குறிப்பிட்ட நேரத்துக்கு மேல் hold ஆகாம, exception throw ஆகி free ஆகும்.

**Q:** Circuit Breaker, thread pool exhaustion-ஐ எப்படி தடுக்கும்?
*Answer:* ஒரு dependency repeatedly fail ஆகி/slow-ஆ இருந்தா, Circuit Breaker "open" ஆகி, அடுத்த calls-ஐ dependency-க்கே அனுப்பாம, உடனே fail-fast பண்ணிடும் (fallback response கொடுக்கும்). இதனால threads, useless-ஆ slow dependency-க்காக wait பண்ணாம, immediately free ஆகும்.

---

## Quick Revision Summary

- Thread pool exhaustion = all threads in the pool are busy (usually waiting on slow calls), new requests queue up or get rejected
- Classic symptom: response time spikes while CPU usage stays normal
- Root causes: slow downstream calls, missing timeouts, undersized thread pool, blocking I/O inside locks
- Diagnose via thread dump — many threads stuck on the same external call stack trace
- Fixes: add explicit timeouts, use Circuit Breaker for fail-fast behavior, use separate thread pools for slow dependencies, move to async processing
- Thread starvation (scheduling-based) is related but distinct — in practice, the term is often used loosely for pool exhaustion too
- ECR Now: a slow CDC API with no configured timeout exhausted the entire Tomcat thread pool — fixed with timeouts, Circuit Breaker, and a dedicated thread pool for CDC calls

**Mahi:** Super Thiru, இப்போ thread pool exhaustion எப்படி நடக்குதுனு, எப்படி fix பண்றதுனு கிளியர்-ஆ புரியுது.

**Thiru:** Correct Mahi. அடுத்த episode-க்கு போலாம்.

---
*End of Episode: Thread Starvation / Thread Pool Exhaustion*
