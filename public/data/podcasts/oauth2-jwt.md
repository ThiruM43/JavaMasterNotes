# Java Interview Podcast — Episode: OAuth2 & JWT
### Hosts: Mahi & Thiru

---

**Mahi:** வணக்கம் Thiru! இன்னைக்கு interview-ல அதிகமா கேட்கப்படுற OAuth2 மற்றும் JWT பத்தி பேசலாம். OAuth2-னா என்ன?

**Thiru:** வணக்கம் Mahi! கண்டிப்பா பேசலாம். **OAuth2** [Open Authorization] என்பது ஒரு authorization framework. ஒரு user தன்னோட credentials-ஐ (username/password) share பண்ணாமலே, ஒரு third-party application-க்கு access கொடுக்கலாம். **JWT** [JSON Web Token] என்பது ரெண்டு parties நடுவுல securely data-ஐ transfer பண்ண use ஆகுற ஒரு token format.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** கண்டிப்பா Mahi. ஒரு 5-star hotel-ஐ யோசிச்சு பாரு. நீ room book பண்ண உடனே, receptionist உனக்கு ஒரு key card கொடுப்பாங்க. அந்த key card-ஐ வச்சு நீ உன் room, gym, pool-க்கு போகலாம், ஆனா kitchen-க்கு போக முடியாது. இங்க receptionist தான் Authorization Server, key card தான் JWT, நீ access பண்ற room தான் Resource Server.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Client முதலில் Authorization Server-கிட்ட credentials கொடுத்து authenticate பண்ணும். Server ஒரு JWT token-ஐ return பண்ணும். Client அந்த token-ஐ `Authorization: Bearer <token>` header-ல வச்சு Resource Server-ஐ call பண்ணும். JWT-ல மூணு parts இருக்கு: Header, Payload, Signature. Spring Boot-ல எப்படி filter பண்றோம்னு இந்த code-ஐ பாரு:

```java
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            // Verify signature and extract user claims
            if (jwtService.isTokenValid(jwt)) {
                // Set SecurityContext
            }
        }
        filterChain.doFilter(request, response);
    }
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. Session மற்றும் JWT-க்கு உள்ள வித்தியாசத்தை இந்த table-ஐ பாரு:

| Aspect | Session Cookies | JWT (Stateless) |
|--------|-----------------|-----------------|
| Storage | Server memory / DB | Client browser (LocalStorage / SessionStorage) |
| Scalability | கஷ்டம் (Needs sticky sessions or Redis) | சுலபம் (Self-contained) |
| Security | CSRF attack வர வாய்ப்பு இருக்கு | XSS attack வர வாய்ப்பு இருக்கு |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Token revocation ஒரு பெரிய trap. JWT stateless-ஆ இருக்கறதுனால, logout பண்ண உடனே token-ஐ server-ல delete பண்ண முடியாது. Token expire ஆகுற வரைக்கும் அது valid தான். இதை சமாளிக்க token blacklist பண்ணனும், இல்லனா short expiry time வைக்கணும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** JWT payload-ல sensitive data (password, SSN) வைக்க கூடாது, ஏன்னா அது Base64 URL encoded மட்டும் தான், encrypted கிடையாது. Token size ரொம்ப பெருசா ஆனா network latency அதிகமாகும். Key rotation பண்றப்போ downtime வராம பாத்துக்கணும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க SMART on FHIR tokens use பண்றோம். OAuth2 scopes (e.g., `patient/*.read`) வச்சு, எந்த specific data-ஐ access பண்ணலாம்னு JWT-ல restrict பண்ணிருக்கோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Architect-ஆ, microservices architecture-ல token validation-ஐ ஒவ்வொரு service-லையும் பண்ணணுமா இல்ல API Gateway-ல பண்ணணுமானு முடிவு பண்ணனும். JWKS (JSON Web Key Set) use பண்ணி keys-ஐ dynamically fetch பண்ணுறது best practice.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Refresh token ஏங்க use பண்றோம்?
*Answer:* Access token-க்கு short expiry (e.g., 15 mins) இருக்கும். User-ஐ மறுபடியும் login பண்ண சொல்லாம, backend-ல புது access token வாங்க refresh token use ஆகும்.

**Q:** JWT signature எப்படி create ஆகுது?
*Answer:* Header மற்றும் Payload-ஐ Base64 encoded பண்ணி, அதோட secret key சேர்த்து HMAC SHA256 (HS256) அல்லது RSA (RS256) algorithm use பண்ணி signature generate ஆகும்.

---

## Quick Revision Summary

- OAuth2 ஒரு authorization framework.
- JWT மூணு parts கொண்டது: Header, Payload, Signature.
- JWT stateless ஆக இருப்பதால் scalability அதிகம்.
- Payload-ல் sensitive data வைக்கக்கூடாது.
- Logout பண்ணும்போது client side-ல் token அழிக்கப்படும், server side-ல் blacklist செய்யலாம்.
