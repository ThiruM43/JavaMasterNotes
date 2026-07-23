# Java Interview Podcast — Episode: API Versioning Strategies
### Hosts: Mahi & Thiru

---

**Mahi:** வணக்கம் Thiru! Microservices-ல API design பண்ணும்போது API versioning பத்தி கேப்பாங்க. அது ஏன் அவ்ளோ முக்கியம்?

**Thiru:** வணக்கம் Mahi! ஒரு API-ஐ release பண்ணிட்டா, நிறைய clients (mobile apps, 3rd party services) அதை use பண்ண ஆரம்பிப்பாங்க. நாளைக்கு நீ API-ல ஒரு breaking change கொண்டு வந்தா, அவங்க system fail ஆகும். அதை avoid பண்ண தான் **API Versioning** use பண்றோம்.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** கண்டிப்பா Mahi. ஒரு car company, பழைய engine model-ஐ மாத்தி புது engine கொண்டு வராங்க. ஆனா பழைய car வாங்குனவங்களுக்கு spare parts தரணும்ல? அதுனால பழைய parts-ம் தயாரிப்பாங்க, புது parts-ம் தயாரிப்பாங்க. இதுதான் versioning.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Spring Boot-ல 3 main ways இருக்கு: URI, Request Parameter, மற்றும் Header/Content-Negotiation versioning. URI versioning தான் ரொம்ப common. இந்த code-ஐ பாரு:

```java
@RestController
public class UserController {

    // URI Versioning
    @GetMapping("/v1/users")
    public String getUsersV1() {
        return "Returns V1 User Object";
    }

    @GetMapping("/v2/users")
    public String getUsersV2() {
        return "Returns V2 User Object with extra fields";
    }
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. Different strategies-க்கு உள்ள வித்தியாசத்தை இந்த table-ஐ பாரு:

| Strategy | Example | Pros | Cons |
|----------|---------|------|------|
| URI Path | `/api/v1/users` | ஈஸியா புரிஞ்சுக்கலாம், cache பண்ண சுலபம் | URL structure மாறும் |
| Query Param | `/api/users?version=1` | URL clean-ஆ இருக்கும் | Caching கொஞ்சம் கஷ்டம் |
| Header | `X-API-Version: 1` | URL மாறாது, REST principles follow பண்ணும் | Test பண்றது (browser-ல) கஷ்டம் |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** "எப்போ புது version create பண்ணனும்?" அப்டின்னு கேட்பாங்க. ஒரு புது field add பண்ணா புது version தேவையில்லை (backward compatible). ஆனா ஒரு field type மாத்துனாலோ, இல்ல mandatory field ஆக்குனாலோ (breaking change) புது version கண்டிப்பா வேணும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Code duplication பெரிய problem. V1, V2 ரெண்டுக்கும் ஒரே logic இருந்தா, maintenance கஷ்டம். Database schema மாத்தும்போது பழைய version API break ஆகாம பாத்துக்கணும் (e.g. adding default values for new non-null columns).

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க FHIR standards follow பண்றோம். FHIR-ல STU3 மற்றும் R4 versions இருக்கு. நாங்க Content-Negotiation (Accept Header) use பண்ணி, client எந்த version கேக்குறாங்களோ அந்த model-ல mapping பண்ணி data அனுப்புவோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Architect-ஆ, API Lifecycle Management முக்கியம். பழைய version-ஐ உடனே delete பண்ண முடியாது. **Sunset strategy** கொண்டு வரணும். அதாவது deprecate பண்ணி, clients-க்கு notice குடுத்து (e.g. Deprecation HTTP header), கொஞ்ச நாள் கழிச்சு தான் retire பண்ணனும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Content Negotiation versioning-னா என்ன?
*Answer:* Client `Accept` header-ல `application/vnd.company.app-v1+json` அப்டின்னு specific version கேட்டு request அனுப்புவாங்க. Server அதுக்கு ஏத்த மாதிரி response தரும்.

**Q:** API Gateway-ல் versioning எப்படி உதவும்?
*Answer:* API Gateway `/v1/` requests-ஐ பழைய legacy microservice-க்கும், `/v2/` requests-ஐ புது microservice-க்கும் route பண்ணும். Code base-ஐ பிரிக்க இது ரொம்ப உதவும்.

---

## Quick Revision Summary

- Breaking changes வரும்போது API versioning அவசியம்.
- URI Path (`/v1/`), Query Param, Headers மூலம் versioning செய்யலாம்.
- URI versioning மிகவும் பிரபலமானது மற்றும் cache செய்ய எளிதானது.
- பழைய API-ஐ உடனே நிறுத்தாமல் Sunset strategy பின்பற்ற வேண்டும்.
- API Gateway மூலமாக version routing செய்வது சிறந்தது.
