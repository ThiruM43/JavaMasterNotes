# Java Interview Podcast — Episode: Kafka Core Concepts
### Hosts: Mahi & Thiru

---

**Mahi:** வணக்கம் Thiru! இன்னைக்கு நம்ம Kafka பத்தி பேசலாம். Microservices-ல Kafka ரொம்ப முக்கியம்னு சொல்றாங்க. Kafka-வோட core concepts என்ன?

**Thiru:** வணக்கம் Mahi! Kafka ஒரு distributed event streaming platform. முக்கியமா அஞ்சு concepts இருக்கு: **Producer** [data அனுப்பும் system], **Consumer** [data வாங்கும் system], **Broker** [Kafka server], **Topic** [data store ஆகும் category], மற்றும் **Partition** [Topic-ஐ பிரித்து வைக்கும் சிறு பகுதிகள்].

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** கண்டிப்பா. ஒரு YouTube channel-ஐ எடுத்துக்கலாம். இங்க YouTube channel தான் **Topic**. Video creators தான் **Producers**. அந்த channel-ஐ subscribe பண்ணி வீடியோ பாக்குறவங்க தான் **Consumers**. நிறைய videos வரும்போது, அத playlist-ஆ பிரிச்சு வைப்பாங்க, அது தான் **Partitions**. YouTube servers தான் **Brokers**. Consumer groups-னா, ஒரு company-ல பல பேர் சேர்ந்து ஒரு project பண்றது போல, வேலையை பிரிச்சு செய்வாங்க.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Kafka அடிப்படையில் ஒரு append-only commit log. Producer ஒரு message-ஐ அனுப்பும்போது, அது Topic-ல உள்ள ஒரு Partition-ல போய் உட்காரும். ஒவ்வொரு message-க்கும் ஒரு unique ID கிடைக்கும், அது தான் Offset.
```java
Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9092");
props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");

KafkaProducer<String, String> producer = new KafkaProducer<>(props);
ProducerRecord<String, String> record = new ProducerRecord<>("my-topic", "key1", "Hello Kafka");

producer.send(record);
producer.close();
```
இங்க `my-topic` தான் destination. Key வெச்சு எந்த Partition-க்கு போகணும்னு Kafka முடிவு பண்ணும்.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Kafka | RabbitMQ |
|--------|----------|----------|
| **Architecture** | Distributed Commit Log | Traditional Message Broker |
| **Performance** | High throughput (Millions/sec) | Lower throughput (Thousands/sec) |
| **Data Retention** | Retains messages based on time/size | Deletes messages after consumption |
| **Use Case** | Event streaming, Log aggregation | Complex routing, Task queues |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Consumer lag ஒரு பெரிய trap. Consumer-ஆல data-வை வேகமா process பண்ண முடியலனா, queue-ல messages தேங்கிடும். அதுக்கு partition count-ஐ increase பண்ணி, consumer group-ல புது consumers add பண்ணனும். இன்னொரு trap "Poison Pill" message - அதாவது deserialize பண்ண முடியாத ஒரு தப்பான message. அது consumer-ஐ crash பண்ணிடும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Disk space management ரொம்ப முக்கியம். Retention policy சரியா set பண்ணலனா, disk full ஆகி broker crash ஆகிடும். Network latency-யும் ஒரு issue. Replication factor அதிகமா இருந்தா, leader-ல இருந்து followers-க்கு data copy ஆக time எடுக்கும். Zookeeper / KRaft quorum failure ஆனா, cluster மொத்தமா down ஆகிடும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க HL7 messages-ஐ process பண்ண Kafka use பண்றோம். IMAP-ல இருந்து வரும் raw data-வை ஒரு topic-ல போட்டுடுவோம். FHIR parser microservice அதை consume பண்ணி, process செஞ்சு, processed topic-க்கு அனுப்பும். இதுனால system ரொம்ப resilient ஆக இருக்கு.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Partition count ரொம்ப முக்கியம். முதல்லயே சரியான partition count-ஐ முடிவு பண்ணனும், ஏன்னா பின்னாடி increase பண்ணலாம், ஆனா reduce பண்ண முடியாது. High availability-க்கு Replication Factor 3 வெக்கறது best practice. மேலும், exactly-once semantics தேவையா இல்ல at-least-once போதுமாங்குறத business requirements வெச்சு முடிவு பண்ணனும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Consumer group-ல ஒரு consumer fail ஆனா என்ன நடக்கும்?
*Answer:* Rebalance trigger ஆகும். Fail ஆன consumer-க்கு assign ஆகியிருந்த partitions, group-ல உள்ள மத்த active consumers-க்கு மாத்தி விடப்படும்.

**Q:** Kafka-ல messages-ஐ delete பண்ண முடியுமா?
*Answer:* Directly delete பண்ண முடியாது. Retention policy (time-based or size-based) மூலமா automatically delete ஆகும்.

---

## Quick Revision Summary

- Kafka is an append-only distributed commit log.
- Topics are split into Partitions for scalability.
- Consumers in a group share the load of reading from partitions.
- Retention policies control how long data is stored.
- Useful for event streaming and high-throughput scenarios.
