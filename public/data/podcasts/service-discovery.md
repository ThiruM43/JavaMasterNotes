# Java Interview Podcast — Episode: Service Discovery
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, previous episodes-ல API Gateway, Load Balancer பார்த்தோம். இதுல அடிக்கடி **Service Discovery** வார்த்தை வருது. இது என்ன?

**Thiru:** **Service Discovery** என்பது microservices ஒன்றுக்கொன்று **network location** [IP address மற்றும் port number] தெரிஞ்சுக்காமலேயே ஒன்றை ஒன்று கண்டுபிடிக்கும் mechanism. Microservices architecture-ல, ஒவ்வொரு service-ம் multiple instances-ஆ run ஆகும், instances scale ஆகும்போது, restart ஆகும்போது, IP address மாறிக்கிட்டே இருக்கும். Hardcoded IP address வெச்சு ஒரு service இன்னொரு service-ஐ call பண்ணா, IP மாறினதும் அது break ஆகிடும்.

**Mahi:** அப்போ Service Discovery எப்படி இந்த பிரச்சனையை தீர்க்கும்?

**Thiru:** ஒவ்வொரு service-ம் தான் **register** [தன் இருப்பை ஒரு central place-ல தெரியப்படுத்தும் செயல்] பண்ணும் ஒரு central registry-ல. வேற service, IP address தெரிஞ்சுக்காமல், service-ன் **name** வைத்து மட்டும் அந்த registry-கிட்ட "இந்த service எங்க இருக்கு?" என்று கேட்கும், registry current IP address கொடுக்கும்.

---

## 1. Real World Analogy

**Mahi:** Analogy சொல்லுங்க.

**Thiru:** Directory enquiry (100/197 போன்ற) service-ஐ நினைச்சுக்கோ. நீ ஒரு friend-ன் phone number தெரியாம, அவரோட வீட்டு address மட்டும் தெரிஞ்சிருந்தா, directory enquiry-க்கு call பண்ணி, "இந்த address-ல இருக்குற நபர்-ன phone number என்ன?" என்று கேப்பே. அவங்க current, updated number கொடுப்பாங்க. நீ manual-ஆ ஒரு phone book-ல எழுதி வெச்ச number use பண்ணினா, அவர் number மாறிட்டிருந்தா, அந்த old number work ஆகாது.

Service Discovery இதே மாதிரி — services தங்க "current address" (IP:port)-ஐ ஒரு central directory-ல update பண்ணிக்கிட்டே இருக்கும், மற்ற services அந்த directory-கிட்டே கேட்டு latest address பெறும்.

---

## 2. Client-Side vs Server-Side Discovery

**Mahi:** Service Discovery எப்படி implement பண்றாங்க — ஒரே ஒரு approach தானா?

**Thiru:** இல்ல, இரண்டு main patterns இருக்கு.

**Client-Side Discovery** — calling service தானே registry-கிட்ட கேட்டு, load balancing decision எடுத்து, target service-ஐ நேரடியா call பண்ணும்.

```java
// Client-side discovery example (using Eureka + Ribbon-style client)
@Autowired
private DiscoveryClient discoveryClient;

public Patient getPatient(Long id) {
    List<ServiceInstance> instances = discoveryClient.getInstances("patient-service");
    ServiceInstance instance = loadBalance(instances); // client picks one
    String url = instance.getUri() + "/api/patients/" + id;
    return restTemplate.getForObject(url, Patient.class);
}
```

**Server-Side Discovery** — calling service ஒரு fixed URL (Load Balancer/Gateway) call பண்ணும், registry lookup மற்றும் routing decision அந்த intermediate component தான் பண்ணும். Client-க்கு registry பத்தியே தெரிய தேவையில்ல.

```
Server-Side Discovery Flow:

  [Case Report Service] ──► [Load Balancer / Gateway] ──► [Registry lookup] ──► [Patient Service Instance]
        (client doesn't know about registry directly)
```

| Aspect | Client-Side Discovery | Server-Side Discovery |
|---|---|---|
| **Who queries registry** | Calling service itself | Load Balancer/Gateway |
| **Client complexity** | Higher — needs discovery logic | Lower — client just calls fixed URL |
| **Example tools** | Netflix Eureka + Ribbon | AWS ELB, Kubernetes Service |
| **Flexibility** | More control over load balancing | Simpler for developers |

---

## 3. Service Registry — How Registration Works

**Mahi:** Service registry-ல exact-ஆ என்ன நடக்கும்?

**Thiru:** ஒரு service start ஆகும்போது, அது registry-கிட்ட தன்னோட name, IP, port, health check endpoint எல்லாம் register பண்ணும். இதுக்கு **Self-Registration pattern** என்று பெயர்.

```java
// application.yml - Eureka client configuration
spring:
  application:
    name: patient-service
eureka:
  client:
    service-url:
      defaultZone: http://eureka-server:8761/eureka
  instance:
    lease-renewal-interval-in-seconds: 10
```

Service running-ஆ இருக்கும் வரைக்கும், periodic-ஆ registry-க்கு **heartbeat** [service இன்னும் alive-ஆ இருக்கு என்று தெரிவிக்க அனுப்பும் periodic signal] அனுப்பிக்கிட்டே இருக்கும். ஒரு service crash ஆனா அல்லது heartbeat அனுப்பாம நின்னா, registry அதை automatic-ஆ **deregister** பண்ணிடும் — அப்புறம் யாரும் அந்த dead instance-க்கு traffic அனுப்ப மாட்டாங்க.

---

## 4. Edge Cases

**Mahi:** Interview-ல trap பண்ணும் edge case சொல்லுங்க.

**Thiru:** ஒரு classic trap — "Service Registry itself single point of failure ஆகாதா?" ஆமா, registry down ஆனா, services ஒன்றை ஒன்று கண்டுபிடிக்க முடியாது. இதனால, registry-ஐயே **cluster mode**-ல [multiple registry instances ஒன்றுக்கொன்று sync ஆகி, ஒன்று fail ஆனாலும் மற்றது continue ஆகும் setup] deploy பண்ணணும். Netflix Eureka-ல, ஒவ்வொரு client-ம் ஏற்கனவே தெரிஞ்ச service instances-ஐ **local cache**-ல வெச்சிருக்கும் — registry temporary-ஆ unreachable ஆனாலும், client cached data வைத்து short period-க்கு continue பண்ணலாம்.

இன்னொரு trap — "Registry-ல stale entry இருந்தா என்ன ஆகும்?" ஒரு instance crash ஆகி, heartbeat stop ஆனா, registry உடனே அதை remove பண்ணாது — ஒரு **timeout period** வரைக்கும் wait பண்ணும் (உதாரணமா 30-90 seconds). அந்த window-ல, dead instance-க்கு traffic route ஆகலாம், request fail ஆகலாம். அதனால, calling service-ல **retry logic** + Circuit Breaker வெச்சிருப்பது best practice.

---

## 5. Popular Service Discovery Tools

**Mahi:** Real production-ல எந்த tools use பண்றாங்க?

**Thiru:**

- **Netflix Eureka** — Spring Cloud ecosystem-ல widely use ஆகும், self-registration model
- **Consul** (HashiCorp) — service discovery + health checking + key-value store, polyglot environments-க்கு நல்லது
- **Kubernetes native service discovery** — Kubernetes-ல deploy பண்ணா, DNS-based service discovery built-in-ஆ கிடைக்கும், தனி tool வேண்டியதே இல்ல
- **Apache ZooKeeper** — Kafka போன்ற systems-ல internally use ஆகும், general-purpose coordination service

Modern cloud-native systems-ல, Kubernetes use பண்றவங்க பெரும்பாலும் Eureka/Consul போன்ற தனி tool install பண்ணாம, Kubernetes-ன் built-in Service object மற்றும் DNS-ஐயே Service Discovery-க்கு use பண்றாங்க.

---

## 6. ECR Now Production Experience

**Mahi:** நம்முடைய ECR Now project-ல Service Discovery எப்படி use ஆகுது?

**Thiru:** ECR Now [Electronic Case Reporting Now — hospital EHR systems-லிருந்து disease reporting-ஐ CDC-க்கு automatic-ஆக அனுப்பும் Spring Boot microservice] system-ல, `case-reporting-service`, patient demographics வாங்க `patient-service`-ஐ call பண்ணணும். இதுக்கு hardcoded IP வெச்சிருந்தா, deployment-ல instance count மாறினா அல்லது IP change ஆனா, code மாத்தி redeploy பண்ண வேண்டியிருக்கும்.

அதனால, **service name** (`patient-service`) வைத்து தான் call பண்றோம் — Service Discovery underlying-ஆ current healthy instance-ன் actual IP-ஐ resolve பண்ணிக்கொடுக்கும்.

```java
// Using service name instead of hardcoded IP
Patient patient = restTemplate.getForObject(
    "http://patient-service/api/patients/" + patientId,  // service name, not IP
    Patient.class
);
```

இதனால, `patient-service`-ஐ scale பண்ணா (instances அதிகரிச்சா), அல்லது ஒரு instance restart ஆனா, `case-reporting-service`-ல எந்த code change-ம் தேவையில்ல — Service Discovery automatic-ஆ handle பண்ணிடும்.

---

## 7. Senior/Architect Perspective

**Mahi:** Senior engineer இதை எப்படி approach பண்ணணும்?

**Thiru:** Senior level-ல கேட்கவேண்டிய questions:

- Registry down ஆனா system எப்படி behave பண்ணும்? Client-side caching இருக்கா, graceful degradation possible-ஆ?
- Heartbeat interval மற்றும் timeout எவ்வளவு வைச்சிருக்கோம்? Too short-ஆ இருந்தா false-positive deregistration, too long-ஆ இருந்தா dead instances-க்கு traffic தொடர்ந்து போகும் ரிஸ்க்.
- Service Discovery-உடன் Circuit Breaker, Retry logic சரியா integrate ஆகி இருக்கா? Dead instance-க்கு traffic போன edge case-ஐ handle பண்ண முடியுமா?
- Multi-region/multi-datacenter deployment இருந்தா, Service Discovery அதை support பண்றதா? — geographic-aware routing தேவைப்படலாம்.
- Kubernetes environment-ல, தனி Service Discovery tool வேணுமா, இல்ல Kubernetes native features போதுமா?

---

## 8. Interview Deep-Dive Questions

**Q:** Service Discovery ஏன் தேவை, hardcoded IP address use பண்ணக்கூடாதா?
*Answer:* Microservices architecture-ல instances dynamic-ஆ scale ஆகும், restart ஆகும், IP address மாறிக்கிட்டே இருக்கும். Hardcoded IP வெச்சா, ஒவ்வொரு change-க்கும் code redeploy பண்ண வேண்டியிருக்கும். Service Discovery service name வைத்து current IP dynamically resolve பண்ணும்.

**Q:** Client-Side Discovery-க்கும் Server-Side Discovery-க்கும் என்ன வித்தியாசம்?
*Answer:* Client-Side Discovery-ல, calling service தானே registry query பண்ணி, load balancing decision எடுத்து target service-ஐ call பண்ணும். Server-Side Discovery-ல, client ஒரு fixed URL (Load Balancer/Gateway) call பண்ணும், registry lookup அந்த intermediate component தான் பண்ணும் — client-க்கு registry பத்தியே தெரிய தேவையில்ல.

**Q:** Service Registry down ஆனா என்ன நடக்கும்?
*Answer:* புது service instances register பண்ண முடியாது, மற்றும் புது lookups fail ஆகலாம். ஆனா பெரும்பாலான clients local cache வைத்திருப்பதால், ஏற்கனவே தெரிஞ்ச instances-உடன் short period continue பண்ணலாம். Registry-ஐயே cluster mode-ல deploy பண்றது இதைத் தடுக்க best practice.

**Q:** Heartbeat mechanism எப்படி வேலை செய்யும்?
*Answer:* ஒவ்வொரு registered service-ம் periodic-ஆ (உதாரணமா ஒவ்வொரு 10 seconds) registry-க்கு "நான் alive" என்று signal அனுப்பும். Heartbeat ஒரு குறிப்பிட்ட timeout வரைக்கும் வராம போனா, registry அந்த instance-ஐ unhealthy/dead mark பண்ணி, deregister பண்ணிடும்.

---

## Quick Revision Summary

- Service Discovery lets services find each other by NAME instead of hardcoded IP addresses
- Two patterns: Client-Side Discovery (client queries registry directly) vs Server-Side Discovery (Load Balancer/Gateway handles lookup)
- Services self-register on startup and send periodic heartbeats to stay registered
- Missing heartbeats → registry deregisters the instance after a timeout window
- Registry needs to run in cluster mode to avoid being a single point of failure
- Client-side caching helps tolerate temporary registry unavailability
- Popular tools: Netflix Eureka, Consul, Kubernetes native DNS-based discovery, ZooKeeper
- ECR Now calls `patient-service` by name, not hardcoded IP — scaling or restarting instances needs zero code changes
- Retry + Circuit Breaker should always pair with Service Discovery to handle the stale-registry edge case

**Mahi:** Super Thiru, இப்போ Service Discovery எப்படி வேலை செய்யுதுனு கிளியர்-ஆ புரியுது.

**Thiru:** Correct Mahi. அடுத்த episode-க்கு போலாம்.

---
*End of Episode: Service Discovery*
