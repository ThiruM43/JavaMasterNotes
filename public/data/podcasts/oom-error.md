# Java Interview Podcast — Episode: OutOfMemoryError (OOM) — Heap vs Metaspace vs Stack
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, "OutOfMemoryError" எப்போவும் ஒரே error தானா, இல்ல வேற வேற types இருக்கா?

**Thiru:** வேற வேற types இருக்கு Mahi, ஒவ்வொண்ணும் **JVM memory-ன் வேற வேற area** full ஆகும்போது வரும். Common types — **Java heap space** OOM, **Metaspace** OOM, மற்றும் StackOverflowError (technically OOM இல்ல, ஆனா memory exhaustion-க்கு relate ஆன error). ஒவ்வொண்ணும் வேற reason-ஆ, வேற fix-ஆ இருக்கும் — அதனால exact error message படிக்கறது தான் முதல் debugging step.

**Mahi:** ஏன் இவ்வளவு types இருக்கு? JVM memory எப்படி பிரிக்கப்பட்டிருக்கு?

**Thiru:** JVM memory-ஐ different purposes-க்காக different areas-ஆ பிரிச்சிருக்காங்க — objects store பண்ண, class metadata store பண்ண, method calls track பண்ண — ஒவ்வொண்ணுக்கும் தனி area. ஒரு area full ஆனா, அந்த specific area-க்கான OOM வரும், மொத்த memory full ஆகணும்னு அவசியம் இல்ல.

---

## 1. Real World Analogy

**Mahi:** Analogy சொல்லுங்க.

**Thiru:** ஒரு office building-ஐ நினைச்சுக்கோ. **Heap** என்பது main storage room மாதிரி — files, documents (objects) இங்க store ஆகும். **Metaspace** என்பது ஒரு reference library மாதிரி — "எந்த department எப்படி வேலை செய்யும்" என்ற rule books (class definitions/metadata) இங்க இருக்கும். **Stack** என்பது ஒவ்வொரு employee-க்கும் (thread) தனித்தனியா கொடுக்கப்பட்ட ஒரு small desk drawer மாதிரி — அவர் இப்போ செய்துகிட்டிருக்கும் task-ன் ஒவ்வொரு step-ம் (method calls) இங்க track ஆகும்.

Storage room full ஆனா ஒரு problem, reference library full ஆனா வேற problem, ஒரு employee-ன் drawer overflow ஆனா (recursion முடிவே இல்லாம போனா) இன்னொரு problem — எல்லாமே "space இல்ல" என்ற error தான், ஆனா வேற இடத்தில், வேற காரணத்துக்காக.

---

## 2. Heap Space OOM

**Mahi:** "java.lang.OutOfMemoryError: Java heap space" — இது எப்போ வரும்?

**Thiru:** Heap-ல objects create பண்ண space இல்லாம போனா இது வரும். Main causes:

- **Memory leak** — objects use ஆகாம இருந்தும், garbage collect ஆகாம accumulate ஆகிக்கிட்டே இருக்கும் (static collections, unclosed resources, caches without eviction)
- **Heap size too small** — legitimate workload-க்கு heap size configure பண்ணின அளவு போதாது
- **Processing too much data at once** — உதாரணமா, ஒரே batch-ல million records load பண்றது

```java
// Classic OOM trigger - loading everything into memory at once
public List<Patient> getAllPatients() {
    return patientRepository.findAll(); // if table has millions of rows, heap explodes
}
```

```
Exception in thread "main" java.lang.OutOfMemoryError: Java heap space
    at com.ecrnow.service.PatientService.getAllPatients(PatientService.java:23)
```

**Fix approaches** — heap size அதிகரிக்கறது (`-Xmx`), pagination/streaming use பண்றது (எல்லாத்தையும் ஒரே நேரத்தில் load பண்ணாம), memory leak fix பண்றது (heap dump analysis மூலம், previous episode-ல பார்த்தோம்).

---

## 3. Metaspace OOM

**Mahi:** "java.lang.OutOfMemoryError: Metaspace" — இது வேறா?

**Thiru:** ஆமா, முற்றிலும் வேற area. **Metaspace** [class metadata — class structure, method definitions, static variables போன்ற information store பண்ணப்படும் memory area, Java 8-க்கு பிறகு PermGen-ஐ replace பண்ணது] full ஆனா இந்த error வரும். இது data objects-ஐ பத்தி இல்ல, **class definitions**-ஐ பத்தி.

Main cause — **classloader leak** [dynamically load ஆன classes, garbage collect ஆகாம accumulate ஆகிக்கிட்டே இருக்கும் நிலை]. இது பொதுவா application servers-ல, applications repeatedly redeploy பண்ணும்போது நடக்கும் — ஒவ்வொரு redeploy-ம், புது classloader create பண்ணும், பழைய classloader properly garbage collect ஆகாம போனா, Metaspace slowly fill ஆகும்.

```
Exception in thread "main" java.lang.OutOfMemoryError: Metaspace
    at java.lang.ClassLoader.defineClass1(Native Method)
```

**Fix** — Metaspace size limit configure பண்றது (`-XX:MaxMetaspaceSize`), classloader leaks fix பண்றது (static references-ல class instances hold பண்ணி வைக்காம இருக்கறது), dynamic class generation libraries (Proxy generation, reflection-heavy frameworks) properly cleanup பண்றதா check பண்றது.

---

## 4. StackOverflowError — Related but Different

**Mahi:** StackOverflowError-ம் OOM தானா?

**Thiru:** Technically, StackOverflowError, `OutOfMemoryError`-ன் subclass இல்ல — ஆனா அதே "memory exhausted" category-ல தான் வரும், அதனால ஒரே topic-ல discuss பண்றாங்க. **Stack** [ஒவ்வொரு thread-க்கும் தனித்தனியா இருக்கும் memory area, method calls-ன் execution track பண்ணும்] full ஆனா StackOverflowError வரும். Main cause — **infinite/too-deep recursion**.

```java
// Classic StackOverflowError trigger - no base case
public int calculateFactorial(int n) {
    return n * calculateFactorial(n - 1); // missing base case: if (n <= 1) return 1;
}
```

```
Exception in thread "main" java.lang.StackOverflowError
    at com.ecrnow.service.MathService.calculateFactorial(MathService.java:15)
    at com.ecrnow.service.MathService.calculateFactorial(MathService.java:15)
    at com.ecrnow.service.MathService.calculateFactorial(MathService.java:15)
    ... (thousands of repeated lines)
```

இதுல stack trace-ல ஒரே method **thousands of times repeat** ஆகி காட்டும் — இதுவே classic StackOverflowError signature. **Fix** — recursion-ல base case சரியா define பண்றது, அல்லது deep recursion-ஐ iterative approach-ஆ மாத்றது.

---

## 5. Comparison Table

| Error Type | Memory Area | Common Cause | Fix Approach |
|---|---|---|---|
| **Heap space OOM** | Heap (Young + Old Gen) | Memory leak, too much data loaded at once | Increase heap, fix leak, use pagination/streaming |
| **Metaspace OOM** | Metaspace (class metadata) | Classloader leak, excessive dynamic class generation | Fix classloader leaks, set `-XX:MaxMetaspaceSize` |
| **StackOverflowError** | Stack (per-thread) | Infinite/too-deep recursion | Fix recursion base case, convert to iterative |

---

## 6. Edge Cases

**Mahi:** Interview-ல trap பண்ணும் edge case சொல்லுங்க.

**Thiru:** ஒரு classic trap — "Heap size அதிகரிச்சா OOM போயிடுமா?" Temporary-ஆ symptom postpone ஆகலாம், ஆனா **real memory leak இருந்தா**, heap size எவ்வளவு அதிகரிச்சாலும், eventually அதுவும் full ஆகிடும் — இது root cause-ஐ fix பண்ணலைனா, "can kick down the road" மட்டும் தான்.

இன்னொரு trap — "OOM வந்த பிறகு application recover ஆகுமா?" பொதுவா இல்ல. OOM வந்ததும், JVM-ன் state unpredictable-ஆ ஆகிடும் — சில threads corrupt state-ல stuck ஆகலாம். Best practice — OOM நடந்தா application **restart** பண்றது தான் safe approach, "silently continue" பண்ண முயற்சிக்கக்கூடாது. அதனால தான் `-XX:+HeapDumpOnOutOfMemoryError` உடன், health check/auto-restart mechanism (Kubernetes liveness probe போன்றவை) சேர்த்து வெக்கறது best practice.

---

## 7. ECR Now Production Experience

**Mahi:** நம்முடைய ECR Now project-ல OOM நடந்த scenario சொல்லுங்க.

**Thiru:** ECR Now [Electronic Case Reporting Now — hospital EHR systems-லிருந்து disease reporting-ஐ CDC-க்கு automatic-ஆக அனுப்பும் Spring Boot microservice] system-ல, ஒரு batch reconciliation job, **எல்லா pending submissions-ஐயும் ஒரே query-ல memory-க்கு load பண்ணி** process பண்ணும் மாதிரி எழுதப்பட்டிருந்துச்சு. Backlog பெரிசா ஆகிட்டு, ஒரு day-ல lakhs of pending records இருந்தப்போ, `java.lang.OutOfMemoryError: Java heap space` throw ஆகி, application crash ஆகிடுச்சு.

Fix — full list-ஐ ஒரே நேரத்தில் load பண்றதுக்கு பதிலா, **pagination** வைத்து batches-ஆ (உதாரணமா, 500 records ஒரு batch) process பண்ற மாதிரி மாத்தினோம். இதனால memory footprint predictable-ஆ ஆகி, backlog size எவ்வளவு பெரிசானாலும், constant memory-லேயே process பண்ண முடிஞ்சது.

வேற ஒரு scenario-ல, Metaspace OOM நடந்துச்சு — ஒரு library, dynamic proxies அதிகமா generate பண்ணி, classloader leak ஏற்படுத்திருச்சு. Library version upgrade பண்ணி, அந்த leak fix பண்ணப்பட்டது.

---

## 8. Senior/Architect Perspective

**Mahi:** Senior engineer இதை எப்படி approach பண்ணணும்?

**Thiru:** Senior level-ல கேட்கவேண்டிய questions:

- Bulk data operations எல்லாம் pagination/streaming வைத்து design பண்ணிருக்கோமா, unbounded load தவிர்த்திருக்கோமா?
- `-XX:+HeapDumpOnOutOfMemoryError` production-ல configure பண்ணிருக்கோமா, incident-ஐ post-mortem பண்ண dump கிடைக்குமா?
- Kubernetes/orchestration layer-ல, OOM crash ஆனதும் automatic restart (liveness probe) இருக்கா, manual intervention தேவைப்படுமா?
- Metaspace size limit explicit-ஆ set பண்ணிருக்கோமா, இல்ல unlimited default-ஆ இருக்கா? (unlimited-ஆ இருந்தா, leak இருந்தா OS-level memory-ஐயே consume பண்ணிடும்)
- Recursive algorithms code review-ல base case சரியா இருக்கானு check பண்றோமா, deep recursion risk இருக்குமா?

---

## 9. Interview Deep-Dive Questions

**Q:** Heap OOM-க்கும் Metaspace OOM-க்கும் என்ன வித்தியாசம்?
*Answer:* Heap OOM, application data objects store பண்ண space இல்லாம போனா வரும். Metaspace OOM, class metadata (class definitions, method info) store பண்ண space இல்லாம போனா வரும் — data objects-ஐ பத்தி இல்ல, classes-ஐ பத்தி.

**Q:** StackOverflowError, OutOfMemoryError-ன் subclass-ஆ?
*Answer:* இல்ல, StackOverflowError தனியா `java.lang.Error`-ன் subclass. ஆனா அதே "memory exhaustion" category-ல conceptually consider பண்ணப்படும், ஏன்னா stack memory area full ஆகி வரும் error.

**Q:** OOM வந்த பிறகு application-ஐ "recover" பண்ணி continue பண்ணலாமா?
*Answer:* Recommend பண்ணப்படாது. OOM நடந்ததும், JVM-ன் internal state unpredictable-ஆ ஆகலாம். Best practice — application-ஐ restart பண்றது (automatic restart mechanism மூலம்), silently continue பண்ண முயற்சிக்கக்கூடாது.

**Q:** Metaspace OOM-ஐ எப்போ பார்ப்பீங்க, common scenario என்ன?
*Answer:* பொதுவா, applications repeatedly redeploy ஆகும்போது (classloader leak காரணமா), அல்லது dynamic proxy generation அதிகமா use பண்ணும் libraries-ல (reflection-heavy frameworks) நடக்கும். Classic symptom — application restart பண்ணாம long time run ஆகும்போது, gradually Metaspace fill ஆகிடும்.

---

## Quick Revision Summary

- OutOfMemoryError has different types based on which JVM memory area is exhausted
- **Heap OOM** ("Java heap space") — object storage full; caused by memory leaks or loading too much data at once; fix with pagination/streaming and leak fixes
- **Metaspace OOM** — class metadata storage full; caused by classloader leaks or excessive dynamic class generation; fix by resolving leaks and setting `-XX:MaxMetaspaceSize`
- **StackOverflowError** — per-thread stack full; caused by infinite/too-deep recursion; fix by correcting the base case or converting to iteration
- Always read the exact error message — it tells you exactly which memory area failed
- Increasing memory size only masks a real leak temporarily — it doesn't fix the root cause
- Best practice: treat OOM as unrecoverable — restart the application rather than trying to continue
- ECR Now: unbounded batch loading caused Heap OOM (fixed with pagination); a library's dynamic proxy generation caused Metaspace OOM (fixed via library upgrade)

**Mahi:** Super Thiru, இப்போ OOM types-ன் வித்தியாசம் கிளியர்-ஆ புரியுது.

**Thiru:** Correct Mahi. அடுத்த episode-க்கு போலாம்.

---
*End of Episode: OutOfMemoryError (OOM) — Heap vs Metaspace vs Stack*
