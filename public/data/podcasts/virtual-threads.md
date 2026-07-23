# Java Interview Podcast — Episode: Virtual Threads / Project Loom
### Hosts: Mahi & Thiru

---

**Mahi:** இன்னைக்கு Virtual Threads பத்தி பேசலாம். Java 21-ல வந்த இந்த feature ஏன் இவ்ளோ hype ஆச்சு?

**Thiru:** கண்டிப்பா Mahi. **Virtual Threads (Project Loom)** [OS threads-ஐ நேரடியாக சார்ந்திருக்காத ரொம்ப lightweight ஆன JVM threads]. இது high throughput concurrent applications-ஐ ரொம்ப சுலபமா எழுத வைக்கும்.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** OS thread ஒரு dedicated car மாதிரி. ஒருத்தர் ஏறுனா அவர்தான் போகமுடியும். Virtual thread ஒரு public bus மாதிரி (Carrier Thread). நீ bus-ல ஏறுவ (Mount), traffic-ல தூங்குவ (I/O block), முழிச்சதும் வேற bus-ல (Unmount/Mount) ஏறி போயிட்டே இருப்ப.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** JVM OS threads (Carrier threads) கொஞ்சமா வச்சிருக்கும். Virtual thread block ஆனா (e.g., DB call), JVM அந்த virtual thread-ஓட state-ஐ heap-ல save பண்ணிட்டு (Unmount), carrier thread-ஐ வேற virtual thread-க்கு கொடுத்துரும்.

```java
// Starting 10,000 virtual threads is absolutely fine!
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 10_000).forEach(i -> {
        executor.submit(() -> {
            Thread.sleep(1000); // Does not block OS thread
            System.out.println("Task " + i);
            return i;
        });
    });
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Platform Threads (OS Threads) | Virtual Threads |
|--------|-------------------------------|-----------------|
| Weight | Heavy (1MB stack memory) | Very Lightweight (few bytes) |
| Max Limit| Few thousands (OS limits) | Millions (Heap limit) |
| I/O Call | Blocks the OS Thread | Unmounts, frees OS Thread |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** ThreadLocal Virtual threads-ல எப்படி work ஆகும்னு கேப்பாங்க. Work ஆகும், ஆனா millions of virtual threads-ல ThreadLocal use பண்ணா memory heap ஃபுல் ஆகிடும். Scoped Values தான் இதுக்கு better alternative.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Pinning problem. Virtual thread ஒரு `synchronized` block-க்குள்ள இருந்து I/O பண்ணாலோ, இல்ல JNI calls பண்ணாலோ அது carrier thread-ஐ pin பண்ணிடும் (Unmount ஆகாது). அதனால `synchronized` க்கு பதிலா `ReentrantLock` use பண்ணனும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க Spring Boot 3.2+ upgrade பண்ணி Virtual threads enable பண்ணிருக்கோம். Reactive programming (WebFlux) complexity இல்லாமலேயே, I/O bound FHIR calls-க்கு செம throughput கிடைக்குது.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Virtual threads CPU-intensive tasks-க்கு (e.g., Video encoding) உதவாது, அதுக்கு parallel streams/fork-join தான் சரி. I/O bound requests (API calls, DB queries) அதிகமா இருந்தா Virtual threads is a game changer.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Virtual threads Reactive Programming-ஐ கொன்னுடுமா?
*Answer:* Almost yes. Reactive-ஓட non-blocking advantage-ஐ Virtual threads ரொம்ப simple imperative code வழியாவே தந்திடுது.

**Q:** Virtual threads-ஐ pool பண்ணணுமா?
*Answer:* கூடாது! Virtual threads cheap. ஒவ்வொரு task-க்கும் புதுசா create பண்ணி discard பண்ணிடுங்க (newVirtualThreadPerTaskExecutor).

---

## Quick Revision Summary

- Virtual threads are lightweight threads managed by the JVM, not the OS.
- Millions of them can be created, solving the thread-per-request bottleneck.
- They automatically unmount during I/O blocking operations.
- Avoid using 'synchronized' blocks to prevent carrier thread pinning.
