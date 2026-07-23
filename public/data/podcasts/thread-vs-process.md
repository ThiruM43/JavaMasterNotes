# Java Interview Podcast — Episode: Thread vs Process
### Hosts: Mahi & Thiru

---

**Mahi:** இன்னைக்கு Thread vs Process பத்தி பேசலாம். ரெண்டுக்கும் என்ன வித்தியாசம்?

**Thiru:** கண்டிப்பா Mahi. **Process** [ஒரு தனி program execution, அதுக்கு சொந்த memory space இருக்கும்] மற்றும் **Thread** [ஒரு process-க்குள்ள run ஆகுற ஒரு சின்ன execution unit, process-ஓட memory-ஐ share பண்ணிக்கும்].

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு வீடு கட்டுறத Process-ஆ வச்சிக்கோ. அந்த வீட்டுக்குள்ள வேலை செய்ற பல workers தான் Threads. வீடு (Process) ஒன்னுதான், ஆனா உள்ள பல பேர் (Threads) சேர்ந்து வேலை பாப்பாங்க. அவங்க ஒரே building (memory) தான் share பண்ணுவாங்க.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Process-க்கு OS level-ல தனி Process Control Block (PCB) create ஆகும். ஆனா Thread-க்கு, அதே process-க்குள்ள தனி Thread Control Block (TCB) மட்டும் create ஆகும். Context switching Thread-க்கு ரொம்ப fast.

```java
public class ThreadExample extends Thread {
    public void run() {
        System.out.println("Thread is running");
    }
    public static void main(String[] args) {
        ThreadExample t1 = new ThreadExample();
        t1.start();
    }
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Process | Thread |
|--------|----------|----------|
| Memory | தனி Memory (Heavyweight) | Shared Memory (Lightweight) |
| Communication | Inter-Process Communication (IPC) வேணும் | ஈஸியா shared memory வழியா communicate பண்ணலாம் |
| Context Switch | Slow | Fast |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Multi-threading-ல process crash ஆனா என்ன ஆகும்னு கேப்பாங்க. ஒரு process crash ஆனா மத்த process affect ஆகாது. ஆனா ஒரு thread-ல unhandled exception வந்து process exit ஆனா, அந்த process-ல இருக்க எல்லா threads-ம் செத்துடும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Threads நிறைய create பண்ணிட்டே போனா OutOfMemoryError (unable to create new native thread) வரும். Shared memory இருக்கறதால concurrency issues, deadlocks அதிகமா வரும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க FHIR data parse பண்றதுக்கும், IMAP mailbox-ல இருந்து emails fetch பண்றதுக்கும் Spring Boot-ஓட thread pool use பண்ணுவோம். தனித்தனி process-ஆ run பண்ணாம ஒரே JVM process-க்குள்ள பல threads-ஆ run பண்றதால resources மிச்சமாகுது.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Microservices architecture-ல எப்போ ஒரு task-ஐ தனி service (Process) ஆக பிரிக்கணும், எப்போ அதையே ஒரு thread-ல run பண்ணனும்னு முடிவு பண்றது முக்கியம். High isolation வேணும்னா Process, high performance and low latency வேணும்னா Thread.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Daemon thread-க்கும் User thread-க்கும் என்ன வித்தியாசம்?
*Answer:* JVM எல்லா User threads முடிஞ்சதும் exit ஆயிடும். Daemon threads background tasks-க்காக (like Garbage Collection) run ஆகும்.

**Q:** Thread context switching ஏன process context switching விட fast-ஆ இருக்கு?
*Answer:* ஏன்னா Thread context switch அப்போ Virtual Memory, page tables இதெல்லாம் மாத்த தேவையில்லை.

---

## Quick Revision Summary

- Process is an independent program with its own memory.
- Thread is a lightweight unit within a process sharing memory.
- Thread context switching is faster than process.
- In Java, threads are created by extending Thread or implementing Runnable.
