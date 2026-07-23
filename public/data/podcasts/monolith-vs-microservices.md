# Java Interview Podcast — Episode: Monolith vs Microservices
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, இன்னைக்கு Monolith vs Microservices பற்றி பேசலாம். இது interview-ல self-intro-க்கு அப்புறம் architecture explain பண்ணும்போது நிச்சயமா வரும் topic. Basic-ஆ ஆரம்பிக்கலாமா?

**Thiru:** சரி Mahi. **Monolith** என்றால் ஒரே ஒரு application — ஒரே codebase, ஒரே build, ஒரே running process. நம்முடைய EHR (Electronic Health Records) system-ஐ உதாரணமா எடுத்துக்கோ — patient registration, billing, lab orders, case reporting எல்லாம் ஒரே WAR/JAR file-ல package ஆகி, ஒரே server-ல deploy ஆனா, அது Monolith.

**Mahi:** அப்போ Microservices?

**Thiru:** Microservices என்றால், அதே system-ஐ, சின்ன சின்ன independent services-ஆக பிரிச்சிடுவோம். ஒவ்வொரு service-க்கும் தன்னோட own codebase, own database (பெரும்பாலும்), own deployment cycle இருக்கும். Services **REST API** அல்லது **message queue** [services ஒன்றுக்கொன்று wait பண்ணாமல் message அனுப்பிக்கொள்ள உதவும் system, உதாரணம் Kafka, RabbitMQ] மூலமா communicate பண்ணும்.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** Apartment building-ஐ நினைச்சுக்கோ. **Monolith** ஒரு பெரிய joint family house மாதிரி — எல்லாரும் ஒரே கூரையின் கீழ, ஒரே kitchen, ஒரே main door. Kitchen-ல பிரச்சனை வந்தா, முழு வீட்டுக்கும் விளக்கு அணைஞ்சுடும்.

**Microservices** என்றால், தனித்தனி flats, தனித்தனி entrance, தனித்தனி electricity meter. ஒரு flat-ல fuse போனா, மற்ற flats normal-ஆ இயங்கும். ஆனா, communication-க்கு நீ கீழே இறங்கி அடுத்த flat-க்கு போக வேண்டியிருக்கும் — அதுதான் network call cost.

---

## 2. Internals — How They Actually Talk

**Mahi:** Internal level-ல எப்படி communication நடக்கும்?

**Thiru:** Monolith-ல, modules நேரடியா **in-process Java method calls** மூலம் பேசும் — fast, network involve ஆகாது.

```java
// Monolith - direct method call, same JVM
BillingService billingService = new BillingService();
billingService.generateInvoice(patient);
```

Microservices-ல, ஒவ்வொரு service தன்னோட own JVM process-ல run ஆகும். அதனால Service A, Service B-கிட்ட பேச **HTTP/REST** அல்லது **gRPC** [Google develop பண்ண fast binary communication protocol] அல்லது Kafka போன்ற message queue use பண்ணும்.

```java
// Microservices - network call via RestTemplate
Patient patient = restTemplate.getForObject(
    "http://patient-service/api/patients/" + patientId,
    Patient.class
);
```

இந்த network call தான் microservices-ல complexity எல்லாம் கொண்டு வரும் — timeout, retry, circuit breaker எல்லாம் இதனால தான்.

---

## 3. Comparison Table

| Aspect | Monolith | Microservices |
|---|---|---|
| **Deployment** | One unit, one deploy | Independent deploy per service |
| **Scaling** | Scale entire app together | Scale individual service |
| **Failure Isolation** | One bug crashes everything | One service down, others fine |
| **Database** | Usually one shared DB | Database per service (mostly) |
| **Communication** | In-process method calls | Network calls (REST/gRPC/Kafka) |
| **Transaction** | Single **ACID** transaction | Needs **Saga pattern** [multi-step transaction, compensating actions மூலமா manage செய்யப்படும்] |
| **Complexity** | Simple to operate | High operational complexity (monitoring, tracing) |
| **Team Size Fit** | Small team, early stage | Multiple teams, mature domain |

---

## 4. Edge Cases

**Mahi:** Edge case ஏதாவது சொல்லுங்க, interview-ல trap பண்ணி கேப்பாங்க.

**Thiru:** ஒரு classic trap — "Distributed transaction எப்படி handle பண்றீங்க?" Monolith-ல ஒரே DB transaction-ல commit/rollback பண்ணிடலாம். Microservices-ல, patient record update பண்ண Service A-வும், case report update பண்ண Service B-வும் இருந்தா, ஒரே transaction possible இல்ல. அதற்கு **Saga pattern** — ஒவ்வொரு step-க்கும் compensating action [ஏதாவது step fail ஆனா, முந்தைய steps-ஐ manual-ஆ undo பண்ணும் action] வைத்து handle பண்ணனும்.

இன்னொரு edge case — **cascading failure**. Service A slow ஆகிடுச்சு என்றால், Service A-வை call பண்ற எல்லா services-லயும் threads wait பண்ணி, connections pile up ஆகி, healthy services கூட down ஆகும். இதற்குத் தான் **Circuit Breaker pattern** தேவை.

---

## 5. Production Concerns

**Mahi:** Production-ல real-ஆ face பண்ற concerns என்ன?

**Thiru:** Microservices போட்டா, நீ இப்போ **distributed tracing** [ஒரு request பல services-ல போய் வருவதை track பண்றது] setup பண்ணனும் — Zipkin, Jaeger போன்ற tools use பண்ணி. இல்லனா ஒரு bug வந்தா, எந்த service-ல problem என்று கண்டுபிடிக்கவே கஷ்டமாகும்.

இரண்டாவது concern — **service discovery** [ஒரு service மற்றொரு service-ஐ network location தெரியாமல் கண்டுபிடிக்கும் mechanism]. Eureka, Consul போன்ற tools இல்லாமல், hardcoded IP வைச்சா, service scale பண்ணும்போதே break ஆயிடும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்முடைய ECR Now project-ல இது எப்படி apply ஆகுது?

**Thiru:** ECR Now [Electronic Case Reporting Now — Spring Boot microservice, hospital EHR systems-லிருந்து disease reporting-ஐ CDC-க்கு automatic-ஆக அனுப்பும் system] நாங்கள் design பண்ணதே microservice architecture-ஆ தான். ஏன்னா:

- **IMAP polling module** — email inbox-ஐ poll பண்ணி CDC response messages படிக்கிறது, இது தனியா run ஆகணும், main case-reporting flow-ஐ block பண்ணக்கூடாது.
- **FHIR resource processing** [FHIR — Fast Healthcare Interoperability Resources, healthcare data exchange standard] — eICR document build பண்றது ஒரு தனி concern.
- **CDC response processing** — response வந்ததும் அதை parse பண்ணி status update பண்றது வேறு concern.

இதில் ஒரு module (உதாரணமா, IMAP polling) slow ஆகி hang ஆனாலும், case reporting-ல reportable condition detect பண்றது continue ஆகணும் — ஏன்னா அது legally time-sensitive. இதே காரணத்துக்காகத் தான் நாங்கள் இதை tight-coupled monolith-ஆ இல்லாமல், தெளிவான service boundaries வைத்து design பண்ணோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Senior engineer இந்த topic-ஐ எப்படி approach பண்ணணும்?

**Thiru:** Senior level-ல கேக்கவேண்டிய questions:

- இந்த system-ல எந்த part-க்கு independent scaling தேவை? எல்லா parts-க்கும் ஒரே scale pattern இருக்கா?
- Team boundary எப்படி இருக்கு? ஒவ்வொரு team தன் service-ஐ independent-ஆ own பண்ணி deploy பண்ண முடியுமா?
- Data consistency எவ்வளவு critical? **Eventual consistency** [கொஞ்ச நேரம் கழிச்சு எல்லா services-லயும் data sync ஆகும் தன்மை] acceptable-ஆ, இல்ல strict consistency வேணுமா?
- Network failure handle பண்ண என்ன patterns வேணும் — Circuit Breaker, Retry with backoff, Timeout?
- Operational cost எவ்வளவு — monitoring, logging, distributed tracing setup பண்ண team-கிட்ட bandwidth இருக்கா?

இதெல்லாம் யோசிக்காமல் "microservices trendy" என்று போய் split பண்ணா, operational nightmare ஆகிடும்.

---

## 8. Interview Deep-Dive Questions

**Q:** Monolith-ஐ microservices-ஆக split பண்றதுக்கு main reason என்ன?
*Answer:* Independent scaling, independent deployment, failure isolation — trend follow பண்றதுக்காக இல்ல, real scaling/team constraints இருந்தால் மட்டும்.

**Q:** Microservices-ல lose ஆகுற ஒரு முக்கியமான DB feature என்ன?
*Answer:* Single ACID transaction across modules. Multi-service transaction-க்கு Saga pattern போன்ற approach வேணும்.

**Q:** New startup product-க்கு microservices recommend பண்ணுவீங்களா?
*Answer:* பொதுவா இல்ல. முதலில் monolith (அல்லது modular monolith) ஆக start பண்ணி, domain boundaries தெளிவான பிறகு, real scaling pain வந்தால் மட்டும் split பண்றது நல்லது.

**Q:** Cascading failure நடக்கும் scenario ஒன்று விளக்குங்க.
*Answer:* Service A slow ஆகிடுச்சு, ஆனா down இல்ல. அதை call பண்ற services-ல threads wait பண்ணி connections exhaust ஆகும், அப்போ healthy services கூட fail ஆகும். Timeout + Circuit Breaker இல்லாமல் இதை தடுக்க முடியாது.

---

## Quick Revision Summary

- Monolith = ஒரே codebase, ஒரே deploy, in-process calls, simple ஆனால் scale-ல fragile
- Microservices = independent services, network calls, complex ஆனால் failure isolation நல்லது
- Communication: Monolith → method calls; Microservices → REST/gRPC/Kafka
- Microservices-ல single ACID transaction lose ஆகும் → Saga pattern தேவை
- Cascading failure risk → Circuit Breaker, Retry, Timeout மூலம் தீர்வு
- Service discovery பல services இருக்கும்போது தேவை (Eureka, Consul)
- ECR Now microservice-style separation பயன்படுத்துகிறது — IMAP polling issues எதுவும் time-sensitive case reporting-ஐ தடுக்காது
- இது எப்போதுமே ஒரு tradeoff decision — team size, scaling needs, failure isolation requirements அடிப்படையில், default choice இல்ல

**Mahi:** Super Thiru, இப்போ இது கிளியர்-ஆ புரியுது!

**Thiru:** Correct Mahi. அடுத்த episode-க்கு போலாம்.

---
*End of Episode: Monolith vs Microservices*
