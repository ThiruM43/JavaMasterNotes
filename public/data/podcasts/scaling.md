# Java Interview Podcast — Episode: Horizontal vs Vertical Scaling
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, இன்னைக்கு system design-ல ரொம்ப முக்கியமான டாபிக், Scaling பத்தி பேசலாம். Horizontal vs Vertical Scaling என்றால் என்ன?

**Thiru:** கண்டிப்பா Mahi. **Vertical Scaling (Scale Up)** [ஒரு server-ல அதிக RAM, CPU சேர்த்து அதோட capacity-ஐ அதிகமாக்குவது] மற்றும் **Horizontal Scaling (Scale Out)** [ஒரு server-க்குப் பதிலா நிறைய புது servers-ஐ network-ல சேர்த்து capacity-ஐ அதிகமாக்குவது].

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** உன்னோட கார்ல 4 பேர் போகலாம். ஆனா 8 பேர் போகணும்னு நெனச்சா, நீ அதே கார்ல பெரிய engine, பெரிய சீட் வெக்கறது **Vertical Scaling**. அதுவே, இன்னொரு புது கார் வாங்கி 4 பேர் அந்த கார்ல போறது **Horizontal Scaling**.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Vertical scaling-ல உனக்கு code change தேவையில்லை, ஆனா hardware limit இருக்கு. Horizontal scaling-ல multiple instances run ஆகும், அதனால load balancer தேவை. Spring Boot-ல ஒரு simple REST controller எப்படி scale ஆகுதுன்னு பாரு:
```java
@RestController
public class ScaleController {
    // Horizontal scaling-ல stateless-ஆ இருக்கணும்.
    @GetMapping("/api/process")
    public String processRequest() {
        return "Processed by server instance: " + System.getenv("HOSTNAME");
    }
}
```
State-ஐ server-ல store பண்ணாம, database அல்லது Redis-ல store பண்ணனும். அப்போதான் horizontal scaling work ஆகும்.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Vertical Scaling | Horizontal Scaling |
|--------|------------------|--------------------|
| Cost | Expensive hardware தேவை | Cheap commodity servers போதும் |
| Limit | Hardware-க்கு ஒரு limit இருக்கு | Unlimited-ஆ servers add பண்ணலாம் |
| Complexity | Easy, load balancer தேவையில்லை | Complex, load balancer மற்றும் distributed state தேவை |
| Downtime | Upgrade பண்ணும்போது downtime வரும் | Zero downtime, servers add பண்ணலாம் |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Interviewer "உங்க application stateful-ஆ இருந்தா எப்படி horizontally scale பண்ணுவீங்க?" அப்படின்னு கேட்பாங்க. நீங்க session data-ஐ memory-ல வெக்காம, Redis அல்லது database-க்கு மாத்தணும்னு சொல்லணும். இன்னொன்னு, Database scaling. Database-ஐ horizontally scale பண்றது கஷ்டம்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Horizontal scaling பண்ணும்போது, data consistency ரொம்ப முக்கியம். ஒரு server-ல update பண்ண data, இன்னொரு server-க்கு உடனே தெரியணும். அப்புறம், log aggregation. 10 servers இருந்தா, 10 logs-ஐயும் ELK (Elasticsearch, Logstash, Kibana) மாதிரி ஒரு system-ல ஒன்னா பாக்கணும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க FHIR data processing-ஐ Kubernetes-ல horizontally scale பண்ணிருக்கோம். Load அதிகமாகும்போது HPA (Horizontal Pod Autoscaler) தானாகவே புது pods-ஐ create பண்ணும். Database-க்கு initial-ஆ vertical scaling பண்ணோம், அப்புறம் read replicas use பண்ணோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Architect-ஆ cost vs performance பாக்கணும். சில சமயம் ஒரு பெரிய server வாங்குறது, 10 சின்ன servers maintain பண்றதை விட ஈஸியா இருக்கும். Microservices architecture-ல எந்த service-க்கு அதிக load வருதோ, அதை மட்டும் horizontally scale பண்ணனும். SPOF (Single Point of Failure) இல்லாம பாத்துக்கணும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Why is horizontal scaling preferred over vertical scaling in modern cloud applications?
*Answer:* Cloud applications-ல horizontal scaling ஈஸியா automate பண்ணலாம், infinite scalability கிடைக்கும், SPOF இருக்காது, cost effective.

**Q:** How do you handle sticky sessions in horizontal scaling?
*Answer:* Sticky sessions use பண்ணலாம், ஆனா best practice என்னன்னா state-ஐ Redis மாதிரி external cache-ல store பண்றதுதான். அப்போ எந்த server fail ஆனாலும் problem இல்லை.

---

## Quick Revision Summary

- Vertical scaling என்றால் hardware upgrade பண்றது (Scale Up).
- Horizontal scaling என்றால் நிறைய servers add பண்றது (Scale Out).
- Horizontal scaling-க்கு load balancer மற்றும் stateless architecture தேவை.
- Cloud மற்றும் Microservices-ல Horizontal scaling தான் best practice.
