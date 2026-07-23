# Java Interview Podcast — Episode: API Gateway
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, microservices architecture பற்றி பேசும்போது **API Gateway** எப்போவும் வரும். இது என்ன, ஏன் தேவை?

**Thiru:** **API Gateway** என்பது microservices architecture-ல ஒரு **single entry point** [வெளியிலிருந்து வரும் எல்லா requests-க்கும் ஒரே ஒரு நுழைவு வாசல்] — client, backend-ல இருக்கும் பல services-ஐ நேரடியா call பண்றதுக்கு பதிலா, எல்லா requests-ம் முதலில் API Gateway-க்கு வரும், அது தேவையான service-க்கு route பண்ணும்.

**Mahi:** Client நேரடியா service-ஐ call பண்ணலாமே, ஏன் இடையில ஒரு Gateway வேணும்?

**Thiru:** நல்ல கேள்வி. Microservices architecture-ல, ஒரு system-ல 10, 20 services இருக்கலாம். Client (mobile app, web app) ஒவ்வொரு service-ன் exact URL, port தெரிஞ்சு வெச்சு call பண்றது practical இல்ல. அது மட்டுமில்லாம, authentication, rate limiting, logging போன்ற **cross-cutting concerns** [எல்லா services-க்கும் பொதுவா தேவைப்படும் functionality] ஒவ்வொரு service-லயும் தனித்தனியா implement பண்றது duplicate வேலை. API Gateway இதையெல்லாம் ஒரே இடத்தில் centralize பண்ணும்.

---

## 1. Real World Analogy

**Mahi:** Analogy சொல்லுங்க.

**Thiru:** ஒரு பெரிய office building-ஐ நினைச்சுக்கோ. அதுல accounting department, HR department, IT department — வேற வேற floors-ல இருக்கும். Visitor நேரடியா ஒவ்வொரு department-க்கும் தனித்தனி entrance வழியா போக முடியாது. அதுக்கு பதிலா, building-க்கு ஒரே **reception desk** (API Gateway) இருக்கும் — visitor அங்க வந்து, "நான் HR department-க்கு போகணும்" என்று சொல்ல, reception அவரை சரியான floor-க்கு direct பண்ணும். அதே reception desk visitor-ன் ID verify பண்ணும் (authentication), entry log பண்ணும் (logging), ஒரே நேரத்தில் எத்தனை பேர் உள்ள வரலாம் என்று control பண்ணும் (rate limiting).

---

## 2. Core Responsibilities of API Gateway

**Mahi:** API Gateway exact-ஆ என்னென்ன வேலை பண்ணும்?

**Thiru:** முக்கிய responsibilities இவை:

- **Request Routing** — incoming request-ஐ சரியான backend service-க்கு forward பண்றது
- **Authentication & Authorization** — ஒவ்வொரு request-ம் valid user/token-ஆ இருக்கானு check பண்றது, backend services இதை தனித்தனியா செய்ய தேவையில்லாம
- **Rate Limiting** — ஒரு client எவ்வளவு requests அனுப்பலாம் என்று limit பண்றது
- **Load Balancing** — ஒரு service-ன் multiple instances இருந்தா, traffic-ஐ சமமா distribute பண்றது
- **Request/Response Transformation** — protocol conversion (உதாரணமா REST-ஐ backend-ல gRPC-ஆ மாத்றது)
- **Logging & Monitoring** — centralized-ஆ request logs, metrics capture பண்றது
- **Response Caching** — repeated requests-க்கு backend call பண்ணாம cache-லிருந்தே response கொடுக்கறது

```
Client Request Flow with API Gateway:

  [Mobile App / Web Client]
            │
            ▼
      [API Gateway]
   ┌────────┼────────┐
   │  Auth check      │
   │  Rate limiting    │
   │  Routing decision │
   └────────┼────────┘
            │
   ┌────────┼─────────────┐
   ▼        ▼              ▼
[Patient   [Case Report   [Notification
 Service]   Service]       Service]
```

---

## 3. API Gateway vs Load Balancer

**Mahi:** Load Balancer-ம் similar-ஆ traffic-ஐ direct பண்றதே, அப்போ API Gateway-க்கும் Load Balancer-க்கும் என்ன வித்தியாசம்?

**Thiru:** இது ஒரு classic confusion point. **Load Balancer** ஒரே service-ன் **multiple identical instances** [ஒரே code run ஆகும் பல copies] இடையில traffic-ஐ distribute பண்ணும் — அது request-ன் content-ஐ பத்தி அதிகம் யோசிக்காது, simple algorithm (round-robin, least connections) வைத்து traffic split பண்ணும்.

**API Gateway** அதைவிட smart-ஆ இருக்கும் — request-ன் path/content பார்த்து **வெவ்வேறு services-க்கு** route பண்ணும், authentication செய்யும், rate limiting பண்ணும். Practical-ஆ, ஒரு API Gateway-க்குப் பின்னால, ஒவ்வொரு service-க்கும் தனித்தனி Load Balancer இருக்கலாம்.

| Aspect | Load Balancer | API Gateway |
|---|---|---|
| **Purpose** | Distribute traffic across instances of ONE service | Route to DIFFERENT services + cross-cutting concerns |
| **Intelligence** | Simple algorithms (round-robin, least connections) | Content-aware routing, auth, transformation |
| **Layer** | Network/transport layer (L4) or basic HTTP (L7) | Application layer (L7), business-aware |
| **Typical position** | In front of one service's instances | In front of the entire microservices system |

---

## 4. Edge Cases

**Mahi:** Interview-ல trap பண்ணும் edge case சொல்லுங்க.

**Thiru:** ஒரு classic trap — "API Gateway single point of failure ஆகாதா?" ஆமா, இது ஒரு real concern. API Gateway down ஆனா, முழு system-க்கும் entry point இல்லாம போயிடும். இதை தீர்க்க, API Gateway-ஐயே **highly available** [multiple instances, auto-failover மூலம் downtime தவிர்க்கும் design] ஆக deploy பண்ணணும் — Load Balancer-க்கு பின்னால multiple Gateway instances வைச்சு.

இன்னொரு trap — "API Gateway-ல business logic வைக்கலாமா?" கூடாது. API Gateway-ன் வேலை routing, auth, rate limiting போன்ற **cross-cutting concerns** மட்டும். Business logic backend services-ல தான் இருக்கணும் — இல்லனா Gateway ஒரு "God object" [ஒரே component-ல அதிகமான responsibilities குவிஞ்சு, maintain பண்ண கஷ்டமான component] ஆகி, deploy பண்றதே ரிஸ்க் ஆகிடும்.

---

## 5. Popular API Gateway Tools

**Mahi:** Real production-ல எந்த tools use பண்றாங்க?

**Thiru:** பல options இருக்கு:

- **Spring Cloud Gateway** — Java/Spring ecosystem-க்கு native fit, reactive programming model வைத்து high performance கொடுக்கும்
- **Netflix Zuul** — legacy option, Spring Cloud Gateway அதிகமா replace பண்ணிக்கிட்டு வருது
- **Kong** — open-source, plugin-based architecture
- **AWS API Gateway** — cloud-managed, AWS ecosystem-க்குள்ள serverless functions-உடன் நல்லா integrate ஆகும்
- **NGINX** — reverse proxy-ஆ மட்டும் இல்லாம, API Gateway features-க்கும் configure பண்ணலாம்

```java
// Spring Cloud Gateway - route configuration example
@Bean
public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
    return builder.routes()
        .route("patient-service", r -> r.path("/api/patients/**")
            .filters(f -> f.stripPrefix(1))
            .uri("lb://patient-service"))
        .route("case-report-service", r -> r.path("/api/case-reports/**")
            .filters(f -> f.stripPrefix(1))
            .uri("lb://case-report-service"))
        .build();
}
```

---

## 6. ECR Now Production Experience

**Mahi:** நம்முடைய ECR Now project-ல API Gateway எப்படி use ஆகுது?

**Thiru:** ECR Now [Electronic Case Reporting Now — hospital EHR systems-லிருந்து disease reporting-ஐ CDC-க்கு automatic-ஆக அனுப்பும் Spring Boot microservice] system-ல, hospital EHR systems வெளியிலிருந்து case report trigger பண்ண request அனுப்பும்போது, அந்த request முதலில் API Gateway-க்குத்தான் வரும்.

Gateway அங்க:
- Hospital system-ன் **authentication token** [API-ஐ யார் call பண்றாங்க என்று verify பண்ண use ஆகும் credential] validate பண்ணும்.
- Request-ஐ correct internal service-க்கு route பண்ணும் — case report trigger-ஆ இருந்தா `case-reporting-service`-க்கு, status check-ஆ இருந்தா `submission-status-service`-க்கு.
- ஒரு hospital system அதிகமான requests அனுப்பினா, **rate limiting** apply பண்ணும் — ஒரு hospital-ன் misbehaving integration, whole system-ஐ overload பண்ணாம தடுக்கும்.

இது இல்லாம, ஒவ்வொரு internal service-லயும் authentication logic தனித்தனியா எழுத வேண்டியிருக்கும் — duplicate code, maintain பண்ண கஷ்டம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Senior engineer இதை எப்படி approach பண்ணணும்?

**Thiru:** Senior level-ல கேட்கவேண்டிய questions:

- API Gateway single point of failure ஆகாம, **high availability**-ஆ deploy பண்ணிருக்கோமா?
- Gateway-ல அதிக logic வைச்சு, அதுவே ஒரு bottleneck ஆகிடுமா? Latency-ஐ Gateway எவ்வளவு add பண்றது?
- Internal services எல்லாம் Gateway வழியா தான் access ஆகணுமா, இல்ல service-to-service internal calls Gateway-ஐ bypass பண்ணலாமா? (பொதுவா internal calls Gateway-ஐ bypass பண்ணி நேரடியா service discovery மூலமா போகும்)
- Gateway configuration changes எப்படி deploy பண்றது — Gateway restart பண்ண வேண்டியிருந்தா, அது downtime-ஆ மாறிடுமா?
- Multiple Gateway instances-க்கு இடையே rate limiting state எப்படி share ஆகும்? (distributed rate limiting-க்கு Redis போன்ற shared store தேவைப்படலாம்)

---

## 8. Interview Deep-Dive Questions

**Q:** API Gateway-க்கும் Load Balancer-க்கும் என்ன வித்தியாசம்?
*Answer:* Load Balancer ஒரே service-ன் multiple instances இடையில traffic distribute பண்ணும் — simple algorithm வைத்து. API Gateway content-aware routing பண்ணும் — request-ன் path பார்த்து வெவ்வேறு services-க்கு route பண்ணும், authentication, rate limiting போன்ற cross-cutting concerns-ஐயும் handle பண்ணும்.

**Q:** API Gateway single point of failure ஆகும் பிரச்சனையை எப்படி தீர்ப்பீங்க?
*Answer:* API Gateway-ஐயே multiple instances-ஆ, Load Balancer-க்கு பின்னால, high availability configuration-ல deploy பண்ணணும். ஒரு instance fail ஆனாலும் மற்ற instances traffic handle பண்ணும்.

**Q:** API Gateway-ல business logic வைக்கலாமா?
*Answer:* கூடாது. Gateway-ன் responsibility routing, auth, rate limiting, logging போன்ற cross-cutting concerns மட்டும். Business logic backend services-ல தான் இருக்கணும், இல்லனா Gateway maintain பண்ண கஷ்டமான, deploy பண்ண ரிஸ்க் ஆன component ஆகிடும்.

**Q:** Service-to-service internal calls-ம் API Gateway வழியா தான் போகணுமா?
*Answer:* பொதுவா இல்ல. API Gateway வெளியிலிருந்து (external clients) வரும் requests-க்கு தான். Internal service-to-service calls, Service Discovery (Eureka, Consul) மூலமா நேரடியா போகும் — Gateway வழியா போனா extra latency, unnecessary hop ஏற்படும்.

---

## Quick Revision Summary

- API Gateway = single entry point for external clients into a microservices system
- Core responsibilities: routing, authentication, rate limiting, load balancing, request/response transformation, logging, caching
- Load Balancer distributes traffic across instances of ONE service; API Gateway routes to DIFFERENT services + handles cross-cutting concerns
- API Gateway should NOT contain business logic — only routing and cross-cutting concerns
- Single point of failure risk — must be deployed with high availability (multiple instances + its own load balancer)
- Popular tools: Spring Cloud Gateway, Kong, AWS API Gateway, NGINX
- ECR Now: Gateway validates hospital system auth tokens, routes to correct internal service, applies rate limiting per hospital integration
- Internal service-to-service calls typically bypass the Gateway and use Service Discovery directly

**Mahi:** Super Thiru, இப்போ API Gateway-ன் role கிளியர்-ஆ புரியுது.

**Thiru:** Correct Mahi. அடுத்த episode-க்கு போலாம்.

---
*End of Episode: API Gateway*
