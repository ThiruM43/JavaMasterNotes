# Java Interview Podcast — Episode: CDN Basics
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, System Design-ல website speed-ஐ இன்க்ரீஸ் பண்ண CDN பத்தி சொல்லுவாங்க. CDN என்றால் என்ன?

**Thiru:** கண்டிப்பா Mahi. **CDN - Content Delivery Network** [உலகம் முழுக்க வெவ்வேற இடங்கள்ல வெச்சிருக்கற servers-ஓட ஒரு network. இது users-க்கு அவங்க பக்கத்துல இருக்கற server-ல இருந்து static assets-ஐ (images, videos, JS, CSS) வேகமா குடுக்கும்].

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** Amazon-ல பொருள் ஆர்டர் பண்ற மாதிரி யோசி. எல்லா பொருளும் டெல்லி Main Warehouse-ல (Origin Server) இருக்கு. சென்னைல இருந்து ஒருத்தர் ஆர்டர் பண்ணா, டெல்லில இருந்து வர லேட் ஆகும். அதனால Amazon சென்னைல ஒரு Local Godown (CDN Edge Server) வெச்சு, அடிக்கடி விக்கிற பொருட்களை அங்கேயே வெச்சிருப்பாங்க. இப்போ டெலிவரி ரொம்ப fast!

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** User ஒரு URL-ஐ hit பண்ணும்போது, DNS routing நடக்கும். Geo-location வெச்சு user-க்கு ரொம்ப பக்கத்துல இருக்கற CDN Edge server-ஓட IP கிடைக்கும். 
```java
// Spring Boot-ல CDN use பண்ணும்போது, origin server-ல CORS allow பண்ணனும்
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // CDN domains-க்கு மட்டும் access குடுக்கணும்
        registry.addMapping("/assets/**")
                .allowedOrigins("https://cdn.ecrnow.com")
                .allowedMethods("GET", "HEAD");
    }
}
```
CDN-ல ஃபைல் இருந்தா (Cache Hit) உடனே குடுக்கும். இல்லைனா (Cache Miss) Origin Server-ல இருந்து வாங்கி, cache பண்ணிட்டு அப்புறம் குடுக்கும்.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Without CDN | With CDN |
|--------|-------------|----------|
| Latency | High (Data travels long distance) | Low (Data served from nearest Edge server) |
| Server Load | Heavy load on Origin server | Origin server gets very less load |
| Bandwidth Cost | High cost on Origin server | Low cost (CDN bandwidth is cheaper) |
| Security | Vulnerable to DDoS attacks | CDN absorbs DDoS attacks |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** "CDN-ல Cache Invalidation எப்படி பண்ணுவீங்க?" அப்படின்னு கேட்பாங்க. புது வெர்ஷன் CSS ஃபைல் deploy பண்ணும்போது, பழைய ஃபைல் CDN-ல இருக்கும். இதை சால்வ் பண்ண ஃபைல் நேம்-ல version அல்லது hash add பண்ணனும் (e.g. `style_v2.css`). அப்போ CDN அத புது ஃபைல்-னு நெனச்சு Origin-ல இருந்து வாங்கும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Dynamic content-ஐ CDN-ல cache பண்ணக்கூடாது (e.g. User profile details). Cache control headers (Cache-Control: public, max-age=3600) சரியா set பண்ணலனா, தப்பான data user-க்கு போகும் அல்லது secure data லீக் ஆக வாய்ப்பு இருக்கு.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) UI Dashboard-க்கு தேவையான static assets (React JS build files, CSS, Logos) எல்லாத்தையும் AWS CloudFront CDN வழியாதான் serve பண்றோம். இதனால US-ல வெவ்வேற states-ல இருக்கற healthcare providers-க்கு dashboard ரொம்ப fast-ஆ லோட் ஆகுது.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Push vs Pull CDN strategy யோசிக்கணும்.
- Pull CDN: User கேட்டதும் Origin-ல இருந்து எடுக்கும் (Traffic கம்மியா இருக்கற assets-க்கு).
- Push CDN: நாமளே ஃபைலை அப்லோட் பண்ணும்போதே CDN-க்கு push பண்ணிடுவோம் (பெரிய வீடியோ ஃபைல்ஸ், software updates-க்கு).

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** How does a CDN improve website security?
*Answer:* CDN Edge servers-ல Web Application Firewall (WAF) இருக்கும். இது SQL Injection, XSS attacks-ஐ தடுக்கும். மேலும், traffic CDN மூலமா வரதால DDoS attacks Origin server-ஐ பாதிக்காது.

**Q:** Can we cache API responses in CDN?
*Answer:* ஆம், GET API responses-ஐ cache பண்ணலாம். "Edge computing" மூலமா (AWS Lambda@Edge) சின்ன logic-ஐ CDN-லேயே ரன் பண்ணி response குடுக்கலாம்.

---

## Quick Revision Summary

- CDN static assets-ஐ user-க்கு பக்கத்துல இருக்கற server-ல cache பண்ணும்.
- Latency, Server Load, Bandwidth Cost எல்லாத்தையும் குறைக்கும்.
- Cache busting (versioning in filename) மூலமா cache invalidation பண்ணலாம்.
- Security & DDoS protection-க்கும் CDN ரொம்ப முக்கியம்.
