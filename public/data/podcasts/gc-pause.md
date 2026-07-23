# Java Interview Podcast — Episode: GC Pause / Full GC
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, "GC pause" nu ஒரு term production issues discuss பண்ணும்போது வருது. இது என்ன?

**Thiru:** **GC Pause** என்றால், **Garbage Collection** [JVM memory-ல use ஆகாத objects-ஐ automatic-ஆ கண்டுபிடிச்சு clean பண்ணும் process] நடக்கும்போது, application-ன் **threads temporary-ஆ freeze** ஆகும் நேரம். GC நடக்கும்போது, JVM ஒரு "**stop-the-world**" [application-ன் எல்லா threads-ம் execution நிறுத்தப்படும் நிலை] event trigger பண்ணும் — memory clean ஆகும் வரைக்கும், application எந்த work-ம் பண்ணாது.

**Mahi:** Ellame stop ஆகுமா GC நடக்கும்போது? அது problem இல்லையா?

**Thiru:** ஆமா, சில GC types-ல, stop-the-world pauses சின்னதா (milliseconds) இருக்கும், unnoticeable-ஆ இருக்கும். ஆனா **Full GC** [entire heap memory-ஐ (young + old generation) clean பண்ணும் major GC event] நடக்கும்போது, pause duration seconds-ஆ கூட நீளலாம் — இது production-ல user-facing latency spike-ஆ தெரியும், சில cases-ல requests timeout கூட ஆகலாம்.

---

## 1. Real World Analogy

**Mahi:** Analogy சொல்லுங்க.

**Thiru:** ஒரு restaurant kitchen-ஐ நினைச்சுக்கோ, dishes பயன்படுத்தப்பட்ட பிறகு, ஒரு waiter periodic-ஆ used plates எடுத்து wash பண்ணுவார் — இது **minor GC** போல, சின்ன interruption, kitchen பெரிசா நிக்காது. ஆனா, ஒரு point-ல, முழு kitchen-ம் clutter ஆகி, "**முழு kitchen-ஐயும் stop பண்ணி, deep clean பண்ணனும்**" என்று chef முடிவெடுக்கும்போது — அது Full GC மாதிரி. அந்த நேரத்தில், cooking முழுசும் நிறுத்தப்படும், எல்லாரும் காத்திருக்கணும், clean முடிஞ்ச பிறகுதான் மறுபடி cooking தொடங்கும்.

---

## 2. Generational GC — Young vs Old Generation

**Mahi:** Minor GC-க்கும் Full GC-க்கும் என்ன வித்தியாசம்? முதலில் heap structure புரிஞ்சுக்கணுமா?

**Thiru:** ஆமா, இது புரிஞ்சா தான் rest எளிதா புரியும். JVM heap-ஐ **generations**-ஆ பிரிக்கும், ஏன்னா **"most objects die young"** [பெரும்பாலான objects உருவாகி short time-க்குள்ளேயே use ஆகி, garbage ஆகிடும்] என்ற observation அடிப்படையில.

- **Young Generation** — புது objects இங்க create ஆகும். இதுல மூணு பகுதிகள் — **Eden space** (புது objects create ஆகும் இடம்), **Survivor spaces (S0, S1)** (Eden-ல survive பண்ணின objects இங்க move ஆகும்).
- **Old Generation (Tenured)** — Young Generation-ல பல GC cycles survive பண்ணின objects, "matured" objects-ஆ இங்க move ஆகும் — long-lived objects இங்க இருக்கும்.

```
Heap Structure:

┌─────────────────────────────┐  ┌──────────────────────┐
│      Young Generation        │  │   Old Generation       │
│  ┌────────┬──────┬──────┐   │  │   (Tenured Space)      │
│  │  Eden  │  S0  │  S1  │   │  │                         │
│  └────────┴──────┴──────┘   │  │  Long-lived objects     │
└─────────────────────────────┘  └──────────────────────┘
```

**Minor GC** — Young Generation மட்டும் clean பண்ணும், fast (milliseconds), frequent-ஆ நடக்கும். **Major/Full GC** — Old Generation-ஐயும் (சில cases Young Generation-உடன் சேர்த்து) clean பண்ணும், slow, less frequent, ஆனா pause duration அதிகம்.

---

## 3. Why Full GC Happens

**Mahi:** Full GC ஏன் trigger ஆகும்?

**Thiru:** முக்கிய காரணங்கள்:

- **Old Generation full ஆகும்போது** — Old Generation-க்கு space இல்லாம போனா, JVM Full GC trigger பண்ணும்
- **Memory leak** — Objects continuously accumulate ஆகி, Old Generation full ஆகிக்கிட்டே இருந்தா, Full GC frequent-ஆ trigger ஆகும், ஆனா அதிகமா memory free ஆகாது (ஏன்னா leak objects-ஐ GC touch பண்ண முடியாது, அவை இன்னும் "referenced" ஆகவே இருக்கும்)
- **Explicit `System.gc()` calls** — code-ல developer manually `System.gc()` call பண்ணா, JVM-க்கு Full GC பண்ண "suggest" பண்றது போல (best practice இல்ல, avoid பண்ணணும்)
- **Heap size too small** — application-ன் memory requirement-க்கு heap size சரியா configure பண்ணாம இருந்தா, Full GC அடிக்கடி trigger ஆகும்

```java
// AVOID - explicit System.gc() call, generally considered an anti-pattern
public void cleanupAfterBatch() {
    largeDataStructure.clear();
    System.gc(); // JVM MAY honor this, MAY ignore it - unpredictable, don't rely on it
}
```

---

## 4. Identifying GC Pauses — GC Logs

**Mahi:** Production-ல GC pause நடக்குதுன்னு எப்படி தெரிஞ்சுக்குறது?

**Thiru:** **GC logs** enable பண்ணி analyze பண்ணணும்.

```bash
# Enable GC logging (Java 9+)
java -Xlog:gc*:file=gc.log:time,uptime:filecount=5,filesize=10M -jar app.jar
```

GC log entry இப்படி இருக்கும் (simplified):

```
[2026-07-23T10:15:32.123+0000][45.678s] GC(142) Pause Full (Ergonomics) 
    1843M->412M(2048M) 3.542s
```

இதை படிச்சா — **Full GC நடந்துச்சு, heap usage 1843MB-லிருந்து 412MB-ஆ குறைஞ்சது, ஆனா இந்த cleanup 3.542 seconds எடுத்துக்கிச்சு**. 3.5 seconds pause என்றால், அந்த நேரத்தில் application எந்த request-ஐயும் process பண்ணாது — இது production-ல clear-ஆ visible latency spike.

---

## 5. Reducing GC Pause Impact

**Mahi:** GC pause-ஐ எப்படி குறைப்பது?

**Thiru:** முக்கிய approaches:

**1. Choose the right Garbage Collector** — modern collectors (**G1GC**, **ZGC**, **Shenandoah**) short, predictable pauses-க்கு design பண்ணப்பட்டவை, old **CMS/Serial GC**-ஐ விட நல்லது.

```bash
# Use G1GC with a target max pause time
java -XX:+UseG1GC -XX:MaxGCPauseMillis=200 -jar app.jar
```

**2. Right-size the heap** — too small heap frequent GC trigger பண்ணும், too large heap Full GC நடக்கும்போது pause duration அதிகரிக்கும்.

**3. Reduce object creation** — unnecessary temporary objects create பண்றதை குறைச்சா, GC-க்கு வேலை குறையும் (உதாரணமா, loop-க்குள்ள String concatenation-க்கு பதிலா StringBuilder use பண்றது).

**4. Fix memory leaks** — leak இருந்தா, Old Generation தொடர்ந்து fill ஆகி, Full GC அடிக்கடி trigger ஆகும், ஆனாலும் effective-ஆ memory free ஆகாது.

---

## 6. Edge Cases

**Mahi:** Interview-ல trap பண்ணும் edge case சொல்லுங்க.

**Thiru:** ஒரு classic trap — "GC pause நீளமா இருந்தா, அது memory leak-ஆ?" எப்பவும் இல்ல. நல்ல-ஆ functioning application-லகூட, large heap-ல periodic Full GC நடக்கும், அது normal. ஆனா, **Full GC frequency அதிகரிச்சிட்டே, ஒவ்வொரு GC-க்கு பிறகும் memory usage baseline குறையாம இருந்தா** (GC log-ல "before" மற்றும் "after" values பார்த்தா) — அது memory leak-ன்னு suspect பண்ணலாம்.

இன்னொரு trap — "GC pause-ஐ முழுசா eliminate பண்ண முடியுமா?" முடியாது, ஏன்னா GC-ஐ முழுசா ஒழிக்க முடியாது (unless manual memory management பண்றது, Java-ல அது design-ஆ இல்ல). Goal, pause-ஐ **minimize/predict பண்றது**, முழுசா ஒழிக்கறது இல்ல. ZGC, Shenandoah போன்ற modern collectors, sub-millisecond pauses target பண்ணும், ஆனா zero pause இல்ல.

---

## 7. ECR Now Production Experience

**Mahi:** நம்முடைய ECR Now project-ல GC pause பிரச்சனை நடந்த scenario சொல்லுங்க.

**Thiru:** ECR Now [Electronic Case Reporting Now — hospital EHR systems-லிருந்து disease reporting-ஐ CDC-க்கு automatic-ஆக அனுப்பும் Spring Boot microservice] system-ல, ஒரு batch job, ஒரே நேரத்தில் ஆயிரக்கணக்கான **FHIR resources** [Fast Healthcare Interoperability Resources — healthcare data exchange standard] process பண்ணும்போது, memory usage spike ஆகி, Full GC frequent-ஆ trigger ஆகி, real-time trigger event processing (வேற thread-ல run ஆகும்) கூட slow ஆகிடுச்சு — ஏன்னா Full GC நேரத்தில் **எல்லா threads-ம்** stop ஆகும், batch job thread மட்டும் இல்ல.

GC logs analyze பண்ணி, `-XX:+UseG1GC -XX:MaxGCPauseMillis=200` configure பண்ணோம் — Default Parallel GC-ல இருந்து G1GC-க்கு switch பண்ணோம். மேலும், batch job code-ல, large intermediate objects (parsed FHIR documents) processing முடிஞ்ச உடனே explicit-ஆ `null` பண்ணி references release பண்ண, memory footprint குறைச்சோம். இதனால, batch job நேரத்தில் real-time processing-ன் latency dramatically குறைஞ்சது.

---

## 8. Senior/Architect Perspective

**Mahi:** Senior engineer இதை எப்படி approach பண்ணணும்?

**Thiru:** Senior level-ல கேட்கவேண்டிய questions:

- Application-ன் latency requirements என்ன? Sub-second response critical-ஆ இருந்தா, ZGC/Shenandoah போன்ற low-pause collectors பரிசீலிக்கணும்.
- GC logs continuous-ஆ monitor பண்றோமா, pause duration trend analyze பண்றோமா?
- Heap size, application-ன் actual working set-க்கு ஏத்த மாதிரி tune பண்ணிருக்கோமா, arbitrary default value use பண்றோமா?
- Object allocation rate அதிகமா இருக்கும் code paths identify பண்ணி, optimize பண்ண முடியுமா?
- Batch/bulk operations, real-time critical paths-ஐ affect பண்ணாம, தனி service/instance-ல run பண்ணலாமா?

---

## 9. Interview Deep-Dive Questions

**Q:** Minor GC-க்கும் Full GC-க்கும் என்ன வித்தியாசம்?
*Answer:* Minor GC, Young Generation மட்டும் clean பண்ணும், fast மற்றும் frequent. Full GC, Old Generation-ஐயும் சேர்த்து முழு heap-ஐயும் clean பண்ணும், slow, less frequent, ஆனா pause duration அதிகம் — user-facing latency spike-ஆ தெரியலாம்.

**Q:** Stop-the-world pause என்றால் என்ன?
*Answer:* GC நடக்கும்போது, application-ன் எல்லா threads-ம் execution நிறுத்தப்படும் நிலை. GC முடியும் வரைக்கும், எந்த request-ம் process ஆகாது — இது தான் GC pause application-க்கு "visible" ஆக காரணம்.

**Q:** Frequent Full GC நடந்தா, அது எப்போவும் memory leak-ஆ இருக்குமா?
*Answer:* இல்லை எப்பவும் இல்ல. Heap size சரியா tune பண்ணாம இருந்தா, அல்லது legitimate-ஆ அதிக memory தேவைப்படும் workload இருந்தாலும் frequent GC நடக்கலாம். Real leak-ஐ confirm பண்ண, GC log-ல ஒவ்வொரு Full GC-க்கு பிறகும் memory usage baseline **குறையாம** தொடர்ந்து ஏறிக்கிட்டே இருக்கானு பார்க்கணும்.

**Q:** GC pause-ஐ எப்படி குறைப்பீங்க?
*Answer:* Modern low-pause collector (G1GC, ZGC, Shenandoah) use பண்றது, heap size சரியா tune பண்றது, unnecessary object creation குறைக்கறது, memory leaks fix பண்றது — இவை main approaches.

---

## Quick Revision Summary

- GC Pause = a stop-the-world event where all application threads freeze while garbage collection runs
- Heap is divided into Young Generation (Eden + Survivor spaces) and Old Generation (Tenured)
- Minor GC = fast, frequent, cleans only Young Generation; Full GC = slow, less frequent, cleans the entire heap
- Full GC triggers when Old Generation fills up — caused by natural growth, memory leaks, or undersized heap
- GC logs show pause duration and memory before/after — essential for diagnosis
- Modern collectors (G1GC, ZGC, Shenandoah) offer shorter, more predictable pauses than older ones (Serial, CMS)
- Frequent Full GC where memory doesn't drop back down after each cycle is a memory leak red flag
- Never rely on `System.gc()` — it's only a suggestion to the JVM, not guaranteed to run
- ECR Now: batch FHIR processing caused frequent Full GC pauses affecting real-time processing — fixed by switching to G1GC and releasing large object references early

**Mahi:** Super Thiru, இப்போ GC pause, Full GC எப்படி வேலை செய்யுதுனு கிளியர்-ஆ புரியுது.

**Thiru:** Correct Mahi. அடுத்த episode-க்கு போலாம்.

---
*End of Episode: GC Pause / Full GC*
