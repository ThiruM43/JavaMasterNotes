# Java Interview Podcast — Episode: CORS
### Hosts: Mahi & Thiru

---

**Mahi:** வணக்கம் Thiru! Web applications-ல அடிக்கடி வர CORS error பத்தி பேசலாம். CORS-னா என்ன?

**Thiru:** வணக்கம் Mahi! **CORS** [Cross-Origin Resource Sharing] என்பது ஒரு security feature. Browser default-ஆ Same-Origin Policy follow பண்ணும், அதாவது ஒரு domain-ல இருந்து இன்னொரு domain-க்கு API call பண்ண விடாது. CORS மூலமா எந்த domain-க்கு access கொடுக்கலாம்னு server முடிவு பண்ணும்.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** கண்டிப்பா Mahi. ஒரு apartment-ல security guard இருக்காரு. நீ அதே apartment-ல இருந்தா ஈஸியா போகலாம் (Same-Origin). ஆனா வெளிய இருந்து யாராவது வந்தா, அவங்க பேரு guest list-ல இருக்கானு guard செக் பண்ணுவாரு. அந்த guest list தான் CORS policy.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Browser direct-ஆ API-ஐ call பண்ணாம, முதல்ல ஒரு `OPTIONS` request அனுப்பும், இதுக்கு பேரு **Preflight Request**. Server-ல இருந்து `Access-Control-Allow-Origin` header-ல அந்த domain இருந்தா மட்டும் தான், browser actual `GET` or `POST` request-ஐ அனுப்பும். Spring Boot-ல CORS எப்படி configure பண்ணலாம்னு பாரு:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("https://myapp.com")
                .allowedMethods("GET", "POST", "PUT")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. Same-Origin Policy மற்றும் CORS-க்கு உள்ள வித்தியாசத்தை இந்த table-ஐ பாரு:

| Aspect | Same-Origin Policy (SOP) | CORS |
|--------|--------------------------|------|
| Purpose | Default browser security | Relaxation of SOP |
| Access | Only same domain/port/protocol | Allowed external domains |
| Preflight | தேவையில்லை | Complex requests-க்கு `OPTIONS` request நடக்கும் |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** "Wildcard `*` use பண்ணலாமா?" அப்டின்னு கேட்பாங்க. `allowedOrigins("*")` குடுத்தா யார் வேணும்னாலும் API access பண்ணலாம், அது தப்பு. இன்னொன்னு, credentials (cookies) அனுப்பும்போது wildcard `*` use பண்ண முடியாது, specific origin தான் குடுக்கணும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** API Gateway-ல CORS configure பண்ணிருக்கோம், ஆனா Spring Boot-லையும் configure பண்ணா conflicts வரும். CORS errors browser-ல மட்டும் தான் வரும், Postman-ல வராது. இதனால developer confuse ஆவாங்க.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க React dashboard use பண்றோம். Dashboard `ui.ecrnow.com`-ல ஓடும், backend `api.ecrnow.com`-ல ஓடும். அதனால CORS configure பண்ணி, UI domain-க்கு மட்டும் access குடுத்துருக்கோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Architect-ஆ, microservices architecture-ல ஒவ்வொரு service-லையும் CORS config பண்ணாம, API Gateway (Kong / Spring Cloud Gateway) level-ல central-ஆ handle பண்றது maintainability-க்கு ரொம்ப நல்லது.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Preflight request எப்போ நடக்கும்?
*Answer:* Simple requests (GET, POST with standard headers)-க்கு நடக்காது. ஆனா custom headers (e.g., `Authorization`) இருந்தாலோ, `PUT/DELETE` methods இருந்தாலோ browser `OPTIONS` request அனுப்பும்.

**Q:** Postman-ல் ஏன் CORS error வராது?
*Answer:* CORS என்பது browser implement பண்ணிருக்க security mechanism. Postman browser கிடையாது, அதனால Same-Origin Policy-ஐ அது enforce பண்ணாது.

---

## Quick Revision Summary

- CORS browser-ன் Same-Origin Policy-ஐ relax செய்ய உதவுகிறது.
- `OPTIONS` method மூலம் preflight request நடக்கும்.
- Postman-ல் CORS error வராது, browser-ல் மட்டுமே வரும்.
- Security-க்காக `*` wildcard-ஐ தவிர்க்க வேண்டும்.
- API Gateway-ல் CORS config செய்வது best practice.
