# Java Interview Podcast — Episode: Load Balancer
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, previous episode-ல API Gateway-க்கும் Load Balancer-க்கும் வித்தியாசம் பார்த்தோம். இன்னைக்கு Load Balancer-ஐ deep-ஆ பார்க்கலாம். இது exact-ஆ என்ன?

**Thiru:** **Load Balancer** என்பது ஒரு component, incoming traffic-ஐ ஒரே service-ன் **multiple instances** [ஒரே code run ஆகும் பல servers/containers] இடையில சமமா distribute பண்ணும். இதன் main goal — ஒரு single server overload ஆகாம, எல்லா servers-ம் சமமா வேலை பண்ண வைக்கறது.

**Mahi:** ஒரே service-க்கு ஏன் multiple instances வேணும்?

**Thiru:** Two main reasons — **scalability** [அதிக traffic வந்தா handle பண்ண extra instances add பண்றது] மற்றும் **availability** [ஒரு instance crash ஆனாலும், மற்ற instances traffic handle பண்ணி system down ஆகாம இருக்கறது]. ஒரே ஒரு server வெச்சிருந்தா, அது crash ஆனா முழு system-ம் down. Multiple instances வெச்சு, Load Balancer traffic distribute பண்ணா, ஒரு instance fail ஆனாலும் system running-ஆ இருக்கும்.

---

## 1. Real World Analogy

**Mahi:** Analogy சொல்லுங்க.

**Thiru:** ஒரு supermarket-ல billing counters-ஐ நினைச்சுக்கோ. ஒரே ஒரு counter திறந்திருந்தா, அத்தனை பேரும் ஒரே queue-ல wait பண்ணணும், நேரம் ரொம்ப ஆகும். அதுக்கு பதிலா, supermarket 5 counters திறந்து, ஒரு **floor manager** (Load Balancer) customers-ஐ குறைவான queue இருக்கிற counter-க்கு direct பண்ணினா, எல்லாரும் வேகமா billing முடிச்சு போவாங்க. ஒரு counter-ல staff உடல்நிலை சரியில்லாம போனா (server down), floor manager அந்த counter-க்கு customers-ஐ அனுப்பாம, மற்ற counters-க்கு redirect பண்ணுவார்.

---

## 2. Load Balancing Algorithms

**Mahi:** Load Balancer எப்படி முடிவு பண்ணும், எந்த server-க்கு request அனுப்பணும்னு?

**Thiru:** பல algorithms இருக்கு:

- **Round Robin** — requests-ஐ order-ஆ ஒவ்வொரு server-க்கும் turn-turn-ஆ அனுப்பும் (Server A → B → C → A → B...). Simple, ஆனா எல்லா servers-ம் ஒரே capacity-ஆ இருக்கணும்.
- **Least Connections** — எந்த server-ல குறைவான active connections இருக்குதோ, அதற்கு request அனுப்பும். Real-time load அடிப்படையில முடிவு.
- **Weighted Round Robin** — servers-க்கு weight கொடுத்து, அதிக capacity உள்ள server-க்கு அதிக requests அனுப்பும்.
- **IP Hash** — client-ன் IP address hash பண்ணி, அதே client எப்போவும் ஒரே server-க்கு போகும் மாதிரி பண்ணும் — **session persistence** [ஒரு user-ன் requests எல்லாம் ஒரே server-க்குத்தான் போகணும் என்ற தேவை] தேவைப்படும்போது use ஆகும்.
- **Least Response Time** — எந்த server வேகமா respond பண்றதோ, அதற்கு request அனுப்பும்.

```
Round Robin Example:

Request 1 → Server A
Request 2 → Server B
Request 3 → Server C
Request 4 → Server A  (cycle repeats)
```

---

## 3. Layer 4 vs Layer 7 Load Balancing

**Mahi:** "L4 Load Balancer", "L7 Load Balancer" nu கேள்விப்பட்டிருக்கேன், அதுக்கு என்ன அர்த்தம்?

**Thiru:** இது **OSI network model**-ல [network communication-ஐ 7 layers-ஆ பிரிக்கும் conceptual model] எந்த layer-ல Load Balancer வேலை பண்றது என்பதைப் பொறுத்தது.

**Layer 4 (Transport Layer)** — IP address மற்றும் port number மட்டும் பார்த்து traffic route பண்ணும். Request-ன் content (HTTP headers, URL path, body) பார்க்காது. Fast, ஆனா smart routing decisions எடுக்க முடியாது.

**Layer 7 (Application Layer)** — HTTP request-ன் content-ஐயே பார்த்து முடிவு எடுக்கும் — URL path, headers, cookies. உதாரணமா, `/api/patients` path-க்கு ஒரு server group-க்கும், `/api/billing` path-க்கு வேற server group-க்கும் route பண்ண முடியும்.

| Aspect | Layer 4 | Layer 7 |
|---|---|---|
| **Decision based on** | IP address, port | HTTP content (path, headers, cookies) |
| **Speed** | Faster (less processing) | Slightly slower (content inspection) |
| **Intelligence** | Basic | Content-aware routing |
| **Example use** | Simple TCP traffic distribution | Routing based on URL path, A/B testing |

---

## 4. Edge Cases

**Mahi:** Interview-ல trap பண்ணும் edge case சொல்லுங்க.

**Thiru:** ஒரு classic trap — "**session persistence** (sticky sessions) இல்லாம போனா என்ன பிரச்சனை?" ஒரு user login பண்ணி session data Server A-ல store ஆகி இருந்தா, அடுத்த request Load Balancer மூலம் Server B-க்கு போனா, Server B-க்கு அந்த session தெரியாது — user மறுபடியும் login பண்ண வேண்டியிருக்கும். இதை தீர்க்க, ஒன்னு **sticky sessions** [ஒரு client எப்போவும் ஒரே server-க்குத்தான் route ஆகும் மாதிரி Load Balancer configure பண்றது] use பண்ணலாம், அல்லது சிறந்த approach — session data-ஐ server-ல store பண்ணாம, **Redis போன்ற external store**-ல store பண்ணி, எந்த server request வந்தாலும் session access பண்ண முடியும்.

இன்னொரு trap — "**Health Check** இல்லாம Load Balancer எப்படி தெரிஞ்சுக்கும் ஒரு server down-னு?" Load Balancer periodic-ஆ ஒவ்வொரு server-க்கும் **health check** [server active-ஆ, healthy-ஆ இருக்கானு check பண்ண அனுப்பும் small request, உதாரணம் `/health` endpoint] அனுப்பும். Response வரலைன்னா, அந்த server-ஐ **unhealthy** mark பண்ணி, traffic அனுப்புறதை நிறுத்திடும், server recover ஆகும் வரைக்கும்.

---

## 5. ECR Now Production Experience

**Mahi:** நம்முடைய ECR Now project-ல Load Balancer எப்படி use ஆகுது?

**Thiru:** ECR Now [Electronic Case Reporting Now — hospital EHR systems-லிருந்து disease reporting-ஐ CDC-க்கு automatic-ஆக அனுப்பும் Spring Boot microservice] system-ல, `case-reporting-service` peak hours-ல (பல hospitals ஒரே நேரத்தில் trigger events அனுப்றப்போ) அதிக traffic வாங்குது. அதனால, அந்த service-ஐ multiple instances-ஆ deploy பண்ணி, front-ல ஒரு Load Balancer வெச்சிருக்கோம்.

Health check configure பண்ணிருக்கோம் — ஒரு instance-ல memory issue வந்து slow ஆகிடுச்சுன்னா, health check fail ஆகி, Load Balancer அந்த instance-க்கு traffic அனுப்புறதை நிறுத்திடும், மற்ற healthy instances மட்டும் case reports process பண்ணும். இது reportable conditions (legally time-sensitive) delay இல்லாம CDC-க்கு போக உதவுது.

**Least Connections** algorithm தான் நாங்க use பண்றோம், ஏன்னா case report processing time ஒவ்வொரு request-க்கும் மாறுபடும் — சில trigger events simple-ஆ இருக்கும், சில complex FHIR parsing தேவைப்படும். Round Robin use பண்ணா, ஒரு instance-ல complex requests குவிஞ்சு overload ஆகிடும்.

---

## 6. Senior/Architect Perspective

**Mahi:** Senior engineer இதை எப்படி approach பண்ணணும்?

**Thiru:** Senior level-ல கேட்கவேண்டிய questions:

- Load Balancer itself single point of failure ஆகாம, redundant-ஆ (multiple Load Balancer instances, DNS-level failover) deploy பண்ணிருக்கோமா?
- Session state server-ல store ஆகுதா, இல்ல external store-ல (Redis) store ஆகி, servers **stateless**-ஆ [server-ல எந்த user-specific data-வும் store பண்ணாத design, எந்த request வேண்டுமானாலும் எந்த server-க்கும் போகலாம்] இருக்கானு?
- Health check எவ்வளவு frequent-ஆ நடக்குது? Too frequent-ஆ இருந்தா overhead, too infrequent-ஆ இருந்தா unhealthy server-க்கு traffic தொடர்ந்து போகும்.
- Auto-scaling-உடன் Load Balancer integrate ஆகுதா? Traffic அதிகரிக்கும்போது புது instances automatic-ஆ add ஆகி, Load Balancer அதை தெரிஞ்சுக்குமா?
- Geographic distribution தேவையா? — Global traffic இருந்தா, **Global Load Balancer** (DNS-level, region அடிப்படையில route பண்றது) வேணுமா, இல்ல ஒரு region போதுமா?

---

## 7. Interview Deep-Dive Questions

**Q:** Round Robin-க்கும் Least Connections-க்கும் என்ன வித்தியாசம்?
*Answer:* Round Robin requests-ஐ order-ஆ turn-turn-ஆ distribute பண்ணும், server-ன் current load பார்க்காது. Least Connections real-time-ஆ எந்த server-ல குறைவான active connections இருக்குதோ அதற்கு அனுப்பும் — request processing time மாறுபடும் scenarios-க்கு இது சிறந்தது.

**Q:** Session persistence இல்லாம போனா என்ன பிரச்சனை வரும்?
*Answer:* User-ன் session data ஒரு specific server-ல store ஆகி இருந்தா, அடுத்த request வேற server-க்கு route ஆனா, அந்த server-க்கு session தெரியாது — user மறுபடியும் authenticate பண்ண வேண்டியிருக்கும். இதை sticky sessions அல்லது external session store (Redis) மூலம் தீர்க்கலாம்.

**Q:** Load Balancer ஒரு server down-னு எப்படி கண்டுபிடிக்கும்?
*Answer:* Periodic health checks மூலம் — Load Balancer ஒவ்வொரு server-க்கும் small request (உதாரணமா `/health` endpoint) அனுப்பும். Response வரலைன்னா அல்லது error வந்தான்னா, அந்த server-ஐ unhealthy mark பண்ணி, traffic அனுப்புறதை நிறுத்திடும்.

**Q:** Layer 4-க்கும் Layer 7 Load Balancing-க்கும் என்ன வித்தியாசம், எப்போ எதை use பண்ணுவீங்க?
*Answer:* Layer 4 IP/port மட்டும் பார்த்து route பண்ணும் — fast, simple TCP traffic-க்கு நல்லது. Layer 7 HTTP content (URL path, headers) பார்த்து smart routing பண்ணும் — உதாரணமா, path அடிப்படையில வெவ்வேறு backend groups-க்கு route பண்ணணும்னா Layer 7 தேவை.

---

## Quick Revision Summary

- Load Balancer distributes traffic across multiple instances of the SAME service for scalability and availability
- Common algorithms: Round Robin, Least Connections, Weighted Round Robin, IP Hash, Least Response Time
- Layer 4 = IP/port based routing (fast, basic); Layer 7 = HTTP content-aware routing (smarter, path/header based)
- Health checks let the Load Balancer detect and stop routing to unhealthy instances
- Session persistence problem: solve with sticky sessions OR (better) external session store like Redis so servers stay stateless
- Load Balancer itself needs redundancy to avoid becoming a single point of failure
- ECR Now uses Least Connections across multiple case-reporting-service instances, since processing time varies per trigger event
- Health checks ensure a slow/unhealthy instance doesn't delay legally time-sensitive case reports

**Mahi:** Super Thiru, இப்போ Load Balancer-ன் internals கிளியர்-ஆ புரியுது.

**Thiru:** Correct Mahi. அடுத்த episode-க்கு போலாம்.

---
*End of Episode: Load Balancer*
