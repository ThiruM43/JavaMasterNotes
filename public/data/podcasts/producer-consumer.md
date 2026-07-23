# Java Interview Podcast — Episode: Producer-Consumer
### Hosts: Mahi & Thiru

---

**Mahi:** இன்னைக்கு Producer-Consumer pattern பத்தி பேசலாம். இது எங்க யூஸ் ஆகுது?

**Thiru:** கண்டிப்பா Mahi. **Producer-Consumer** [ஒரு thread data-ஐ create பண்ணும் (Producer), இன்னொரு thread அத process பண்ணும் (Consumer)]. ரெண்டுக்கும் நடுவுல ஒரு shared buffer (Queue) இருக்கும்.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு bakery-ல chef cake செஞ்சு display-ல வைக்கிறாரு (Producer). Customer வந்து வாங்கிட்டு போறாங்க (Consumer). Display full ஆனா chef wait பண்ணுவாரு. Display empty ஆனா customer wait பண்ணுவாங்க.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Java-ல BlockingQueue use பண்ணி இத ரொம்ப ஈஸியா implement பண்ணலாம். wait() and notify() use பண்ணி manual ஆகவும் பண்ணலாம், ஆனா BlockingQueue தான் best practice.

```java
BlockingQueue<Integer> queue = new ArrayBlockingQueue<>(10);

// Producer
Runnable producer = () -> {
    try { queue.put(1); } catch (InterruptedException e) {}
};

// Consumer
Runnable consumer = () -> {
    try { Integer val = queue.take(); } catch (InterruptedException e) {}
};
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. BlockingQueue implementations பத்தி பாரு:
| Queue Type | Characteristics | Use Case |
|------------|-----------------|----------|
| ArrayBlockingQueue | Bounded (Fixed size) | Memory limit பண்ண வேண்டிய இடத்துல |
| LinkedBlockingQueue| Optionally bounded | High throughput needs |
| SynchronousQueue | Capacity 0 | Direct handoff to consumer |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Producer வேகமா produce பண்ணி, consumer மெதுவா consume பண்ணா என்ன ஆகும்னு கேப்பாங்க. Unbounded queue வச்சிருந்தா OutOfMemoryError வரும். அதனால எப்பவுமே Bounded queue use பண்ணி backpressure create பண்ணனும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Graceful shutdown ஒரு problem. System shutdown ஆகும்போது queue-ல இருக்க data-ஐ இழக்க வாய்ப்பு இருக்கு. Consumer-க்கு poison pill (special termination object) அனுப்பி stop பண்ணனும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க IMAP-ல இருந்து வரும் emails-ஐ producer thread ஒரு queue-ல போடும். Multiple consumer threads அத எடுத்து FHIR payloads ஆ parse பண்ணி CDC-க்கு அனுப்பும்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Single machine-ல BlockingQueue ஓகே. Distributed systems-ல (Microservices) Kafka, RabbitMQ மாதிரி message brokers தான் use பண்ணனும். அப்போதான் persistence and scalability கிடைக்கும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** wait/notify use பண்ணி பண்ணும்போது while loop ஏன் use பண்ணனும்?
*Answer:* Spurious wakeups-ஐ handle பண்ண. Condition-ஐ if-ல check பண்ணாம while-ல check பண்ணனும்.

**Q:** put() and offer() என்ன வித்தியாசம்?
*Answer:* queue full ஆகும்போது put() wait பண்ணும். offer() false return பண்ணிட்டு move ஆகிடும்.

---

## Quick Revision Summary

- Decouples data generation from data processing.
- BlockingQueue (put/take) handles thread synchronization automatically.
- Always use bounded queues to prevent memory issues.
- In distributed environments, prefer Kafka/RabbitMQ over in-memory queues.
