# Java Interview Podcast — Episode: Executor Framework & Thread Pool
### Hosts: Mahi & Thiru

---

**Mahi:** இன்னைக்கு Executor Framework பத்தி பேசலாம். Thread creation-க்கு இது ஏன் தேவை?

**Thiru:** கண்டிப்பா Mahi. **Executor Framework** [Thread-ஐ create பண்ணி manage பண்ற கஷ்டத்தை குறைக்கும் ஒரு framework]. Threads-ஐ manual ஆ create பண்ணாம **Thread Pool** [pre-initialized threads-ஓட collection] மூலமா reuse பண்ணலாம்.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு restaurant-ல ஒவ்வொரு customer வரும்போதும் புதுசா ஒரு waiter-ஐ வேலைக்கு எடுக்கிறதுக்கு பதிலா, ஒரு 5 waiters (Thread Pool) எப்பவுமே ரெடியா இருப்பாங்க. ஒருத்தர் வேலைய முடிச்சதும் அடுத்த customer-ஐ கவனிப்பாரு.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** ThreadPoolExecutor class உள்ள ஒரு Task Queue வச்சிருக்கும். Submit பண்ற tasks எல்லாம் queue-ல இருக்கும். Worker threads அந்த queue-ல இருந்து tasks எடுத்து execute பண்ணும்.

```java
ExecutorService executor = Executors.newFixedThreadPool(5);
executor.submit(() -> {
    System.out.println("Task executed by: " + Thread.currentThread().getName());
});
executor.shutdown();
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Pool Type | Behavior | Use Case |
|-----------|----------|----------|
| FixedThreadPool | Fixed number of threads | Predictable load |
| CachedThreadPool | Thread தேவைக்கு ஏற்ப create ஆகும் | Short-lived tasks |
| SingleThreadExecutor| ஒரே ஒரு thread மட்டும் இருக்கும் | Sequential execution |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** `shutdown()` vs `shutdownNow()` வித்தியாசம் கேப்பாங்க. `shutdown()` புது tasks-ஐ ஏத்துக்காது, ஆனா queue-ல இருக்கிறத முடிக்கும். `shutdownNow()` run ஆகுற tasks-ஐயும் interrupt பண்ண try பண்ணும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Executors.newFixedThreadPool() use பண்ணா underlying-ல LinkedBlockingQueue(Integer.MAX_VALUE) create ஆகும். நிறைய tasks வந்தா OutOfMemoryError வந்துடும். Custom ThreadPoolExecutor with finite queue size use பண்றது safe.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க Bulk FHIR export பண்றதுக்கு Custom ThreadPoolExecutor use பண்ணுவோம். Queue full ஆனா `CallerRunsPolicy` rejection handler வச்சு main thread-லேயே run பண்ணி backpressure handle பண்ணுவோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** CPU bound tasks-க்கு number of cores அளவு thread pool size வைக்கணும். I/O bound tasks-க்கு waiting time பொறுத்து pool size அதிகமா வைக்கணும். Monitoring ரொம்ப முக்கியம்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** ThreadPoolExecutor-ல CorePoolSize மற்றும் MaxPoolSize என்ன பண்ணும்?
*Answer:* CorePoolSize எப்பவுமே active-ஆ இருக்கும் threads count. Queue full ஆனா MaxPoolSize வரை புது threads create ஆகும்.

**Q:** RejectedExecutionHandler எப்போ trigger ஆகும்?
*Answer:* Queue-ம் full ஆகி, max threads-ம் reach ஆன பிறகு புதுசா task வந்தா trigger ஆகும்.

---

## Quick Revision Summary

- Executor framework abstracts thread creation and management.
- Thread pools reuse threads, improving performance and resource management.
- Always prefer custom ThreadPoolExecutor over factory methods to avoid OOM.
- Shutdown gracefully using shutdown() and awaitTermination().
