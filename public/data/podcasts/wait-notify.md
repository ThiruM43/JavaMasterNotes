# Java Interview Podcast — Episode: wait/notify vs modern concurrency
### Hosts: Mahi & Thiru

---

**Mahi:** இன்னைக்கு wait/notify பத்தி பேசலாம். Modern Java-ல இது இன்னும் யூஸ் பண்றாங்களா?

**Thiru:** கண்டிப்பா Mahi. **wait(), notify(), notifyAll()** [Thread communication-க்கான basic methods in Object class]. ஆனா இப்போ mostly `java.util.concurrent` classes (CountDownLatch, CyclicBarrier, BlockingQueue) தான் use பண்றோம்.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** wait/notify ஒரு manual Railway crossing gate மாதிரி. Guard பார்த்து open/close பண்ணனும் (manual lock and release). Modern concurrency classes automatic signal systems மாதிரி, error கம்மி.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** `wait()` call பண்ணா thread lock-ஐ release பண்ணிட்டு waiting state-க்கு போகும். `notify()` call பண்ணா waiting-ல இருக்க ஒரு thread-ஐ எழுப்பிவிடும். இது எல்லாமே `synchronized` block-க்குள்ள தான் நடக்கணும்.

```java
synchronized (lockObject) {
    while (!conditionMet) {
        lockObject.wait(); // releases lock and waits
    }
    // do work
    lockObject.notifyAll();
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | wait/notify | Modern Concurrency (Condition / Latch) |
|--------|-------------|----------------------------------------|
| Complexity | அதிகம், bugs வர வாய்ப்பு அதிகம் | குறைவு, easy to use |
| Block requirement | `synchronized` block அவசியம் | Lock explicitly manage பண்ணிக்கலாம் |
| Granularity | Object-க்கு ஒரு wait queue தான் | ReentrantLock-ல multiple condition variables வச்சுக்கலாம் |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** `wait()` vs `sleep()` வித்தியாசம் கேப்பாங்க. `wait()` lock-ஐ release பண்ணும், `sleep()` lock-ஐ hold பண்ணிட்டே தூங்கும். `wait()` Object class-ல இருக்கு, `sleep()` Thread class-ல இருக்கு.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** `notify()` call பண்ணும்போது எந்த thread எந்திரிக்கணும்னு guarantee கிடையாது. அதனால தேவையற்ற threads முழிச்சிட்டு மறுபடியும் தூங்கப் போகும். Deadlocks வர வாய்ப்பு ரொம்ப அதிகம்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க legacy systems-ல wait/notify பாத்துருக்கோம், ஆனா புது code-ல எல்லாம் CountDownLatch அல்லது CompletableFuture தான் use பண்றோம். Code readability ரொம்ப முக்கியம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Don't reinvent the wheel. Thread communication-க்கு standard `java.util.concurrent` utilities-ஐ prefer பண்ணனும். Low-level wait/notify performance critical libraries எழுதுறவங்களுக்கு தான் தேவைப்படும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** wait/notify ஏன் Object class-ல இருக்கு, Thread class-ல இல்ல?
*Answer:* ஏன்னா Locks object level-ல தான் maintain ஆகுது. Threads-ல இல்ல.

**Q:** Spurious wakeup அப்படின்னா என்ன?
*Answer:* OS reason-னால thread தானாகவே முழிச்சுக்கலாம் (without notify). அதனால தான் `wait()`-ஐ எப்பவும் `while` loop-ல check பண்ணனும்.

---

## Quick Revision Summary

- wait() releases the lock; sleep() keeps the lock.
- Must be called from within a synchronized context.
- Always use a while loop for wait() to handle spurious wakeups.
- Prefer higher-level concurrency utilities over manual wait/notify.
