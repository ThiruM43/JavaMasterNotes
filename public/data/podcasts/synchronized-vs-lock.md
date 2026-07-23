# Java Interview Podcast — Episode: Synchronized vs ReentrantLock
### Hosts: Mahi & Thiru

---

**Mahi:** இன்னைக்கு Synchronized vs ReentrantLock பத்தி பேசலாம். இது ரெண்டுக்கும் என்ன வித்தியாசம்?

**Thiru:** கண்டிப்பா Mahi. **Synchronized** [Java-வோட built-in keyword for locking] மற்றும் **ReentrantLock** [java.util.concurrent.locks package-ல இருக்கிற advance locking mechanism, இது அதிக control தரும்].

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** Synchronized ஒரு ATM ரூம் கதவு மாதிரி; ஒருத்தர் உள்ளே போய் சாத்திட்டா, அவர் வெளிய வர வரைக்கும் மத்தவங்க காத்திருக்கணும் (No timeout). ஆனா ReentrantLock ஒரு advance token system மாதிரி; ரொம்ப நேரம் ஆச்சுன்னா token-ஐ cancel பண்ணிட்டு வேற வேலை பாக்கலாம் (tryLock).

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Synchronized JVM level-ல object monitor use பண்ணி work ஆகுது. ReentrantLock, AbstractQueuedSynchronizer (AQS) use பண்ணி Java level-ல work ஆகுது.

```java
Lock lock = new ReentrantLock();
try {
    lock.lock();
    // Critical section
} finally {
    lock.unlock(); // Always unlock in finally
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Synchronized | ReentrantLock |
|--------|--------------|---------------|
| Flexibility | கம்மி, implicit lock | அதிகம், explicit lock / tryLock() |
| Fairness | No fairness guarantee | Fairness policy set பண்ணலாம் |
| Interruptibility | Lock wait பண்ணும்போது interrupt பண்ண முடியாது | lockInterruptibly() use பண்ணலாம் |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** ReentrantLock-ல `unlock()` call பண்ணாம விட்டா என்ன ஆகும்னு கேப்பாங்க. Deadlock ஆகிடும். அதனால எப்பவுமே `finally` block-ல `unlock()` பண்ணனும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Thread starvation ஒரு பெரிய problem. Synchronized block-ல fairness இல்லாததால ஒரு thread-க்கு chance கிடைக்காமயே போகலாம். ReentrantLock(true) கொடுத்து fairness enable பண்ணலாம் ஆனா throughput குறையும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க specific file processing-க்கு ReentrantLock-ஓட tryLock(timeout) use பண்றோம். Lock கிடைக்கலன்னா system hang ஆகாம, fallback logic execute பண்ணி alert அனுப்புவோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Simple lock தேவைனா `synchronized` போதும் (code clean-ஆ இருக்கும்). ஆனா fairness, tryLock, multiple condition variables தேவைப்பட்டால் மட்டும் `ReentrantLock` use பண்ணனும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Reentrant அப்படின்னா என்ன?
*Answer:* ஒரு thread தனக்கு ஏற்கனவே கிடைச்ச lock-ஐ திரும்பவும் acquire பண்ணிக்கலாம், deadlock ஆகாது.

**Q:** Synchronized vs Lock-ல எது fast?
*Answer:* Modern JVMs-ல synchronized ரொம்ப optimize பண்ணிருக்காங்க, so performance almost similar தான்.

---

## Quick Revision Summary

- Synchronized is simple, implicit, and block-scoped.
- ReentrantLock is explicit, requires manual unlock() in finally.
- ReentrantLock supports tryLock(), interruptible locks, and fairness.
- Reentrant means a thread can re-acquire the same lock safely.
