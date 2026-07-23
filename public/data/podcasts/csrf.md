# Java Interview Podcast — Episode: CSRF
### Hosts: Mahi & Thiru

---

**Mahi:** வணக்கம் Thiru! CSRF அப்படின்னா என்ன, அது ஏன் web security-ல ரொம்ப முக்கியம்னு பேசலாமா?

**Thiru:** வணக்கம் Mahi! **CSRF** [Cross-Site Request Forgery] என்பது ஒரு attack. ஒரு user ஏற்கனவே login பண்ணி session active-ஆ இருக்கும்போது, hacker ஒரு malicious link மூலமா user-க்கே தெரியாம ஒரு action (e.g., money transfer) பண்ண வைப்பாங்க. 

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** கண்டிப்பா Mahi. நீ bank-ல counter-ல நின்னு காசு குடுக்க form fill பண்ணிட்டு இருக்க. உன் sign-ஐ போட்டுட்டு வேடிக்கை பாக்குற. பின்னாடி இருக்குற திருடன், உன் form-ல amount-ஐ மாத்தி cashier-கிட்ட குடுத்து பணத்தை எடுத்துட்டு போயிடுறான். Bank-க்கு அது நீ குடுத்ததா தான் தெரியும். இதுதான் CSRF.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Browser எப்பவும் requests அனுப்பும்போது, அந்த domain-க்கு உரிய cookies-ஐ தானா சேர்த்து அனுப்பும். Hacker-ன் site-ல இருந்து உன்னோட bank-க்கு request போனாலும் browser session cookie-ஐ அனுப்பும், bank அதை valid-னு நம்பிடும். இதை தடுக்க **CSRF Token** (Synchronizer Token Pattern) use பண்ணுவாங்க. Spring Security-ல எப்படி disable/enable பண்றோம்னு பாரு:

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    // For Stateless APIs (JWT), we disable CSRF
    http.csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth.anyRequest().authenticated());
    
    // Default: CSRF is enabled in Spring Security for Session based apps
    return http.build();
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. XSS மற்றும் CSRF-க்கு உள்ள வித்தியாசத்தை இந்த table-ஐ பாரு:

| Aspect | XSS (Cross-Site Scripting) | CSRF (Cross-Site Request Forgery) |
|--------|----------------------------|-----------------------------------|
| How it works | Malicious JavaScript execute ஆகும் | User-ன் session-ஐ வைத்து request போகும் |
| Target | Application-ஐ நம்புற User | User-ஐ நம்புற Application |
| Prevention | Input escaping / sanitization | CSRF Token, SameSite Cookies |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** "REST API-க்கு CSRF தேவையா?" அப்படின்னு கேட்பாங்க. API JWT (Bearer token) use பண்ணி stateless-ஆ இருந்தா, CSRF attack நடக்காது (ஏன்னா browser token-ஐ தானா அனுப்பாது). ஆனா Session cookies use பண்ணா கண்டிப்பா CSRF protection தேவை.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Load balanced environment-ல server-side session-ல token synchronize ஆகுறது கஷ்டம். இதை சமாளிக்க Double Submit Cookie pattern use பண்ணுவாங்க. Token-ஐ cookie-லையும் request parameter-லையும் அனுப்புவாங்க.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) backend fully JWT based REST API. அதனால நாங்க Spring Security-ல `csrf().disable()` பண்ணிருக்கோம். ஆனா Admin portal (Thymeleaf UI)-க்கு CSRF enable பண்ணிருக்கோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Architect-ஆ, CSRF token மட்டும் பத்தாது. Cookie configuration-ல `SameSite=Strict` அல்லது `Lax` செட் பண்ணனும். இது browser-ஐ cross-site requests-க்கு cookie அனுப்பாம தடுக்கும். இது modern web-ல மிக சிறந்த defense.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** GET requests-க்கு CSRF நடக்குமா?
*Answer:* GET requests state-ஐ மாத்த கூடாது (no side-effects). அதனால GET-க்கு CSRF token செக் பண்ண மாட்டாங்க. POST, PUT, DELETE requests-க்கு மட்டும் தான் CSRF protection தேவை.

**Q:** SameSite cookie attribute-னா என்ன?
*Answer:* SameSite attribute browser-கிட்ட இந்த cookie-ஐ 3rd party site requests-க்கு அனுப்ப கூடாதுனு சொல்லும். `Strict` குடுத்தா சுத்தமா அனுப்பாது.

---

## Quick Revision Summary

- CSRF user-ன் active session-ஐ வைத்து attack செய்கிறது.
- Browser cookies-ஐ தானாக அனுப்புவதே இதற்கு காரணம்.
- Stateless (JWT) APIs-க்கு CSRF protection தேவையில்லை.
- State-changing (POST, PUT) requests-க்கு CSRF token அவசியம்.
- SameSite cookie attribute CSRF-ஐ தடுக்க ஒரு சிறந்த வழி.
