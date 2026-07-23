# Java Interview Podcast — Episode: HTTPS/TLS Basics
### Hosts: Mahi & Thiru

---

**Mahi:** வணக்கம் Thiru! இன்னைக்கு HTTPS மற்றும் TLS பத்தி பேசலாம். HTTPS-னா என்ன, அது ஏன் முக்கியம்?

**Thiru:** வணக்கம் Mahi! **HTTPS** [Hypertext Transfer Protocol Secure] என்பது secure communication protocol. Internet-ல நம்ம அனுப்புற data-ஐ (passwords, credit cards) hackers படிக்காம இருக்க encryption use பண்ணுது. **TLS** [Transport Layer Security] என்பது அந்த encryption-ஐ provide பண்ற cryptographic protocol.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** கண்டிப்பா Mahi. நீ ஒரு postcard-ல உன் password எழுதி தபால்ல அனுப்புனா, postman அதை படிக்கலாம் (இது HTTP). ஆனா, அதை ஒரு இரும்பு பெட்டியில போட்டு, பூட்டி அனுப்புனா, சாவி இருக்கறவங்களுக்கு மட்டும் தான் திறக்க முடியும். அந்த secure பெட்டி தான் HTTPS.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** TLS handshake மூலமா இது நடக்கும். Client-ம் server-ம் connect ஆகும்போது, server தன்னோட public certificate-ஐ அனுப்பும். Client அதை verify பண்ணிட்டு, ஒரு session key-ஐ generate பண்ணி public key-ஆல encrypt பண்ணி அனுப்பும். அப்புறம் ரெண்டு பேரும் அந்த session key-ஐ வச்சு data-ஐ மாத்திப்பாங்க. Spring Boot-ல HTTPS enable பண்ற properties code-ஐ பாரு:

```yaml
server:
  port: 8443
  ssl:
    enabled: true
    key-store: classpath:keystore.p12
    key-store-password: mypassword
    key-store-type: PKCS12
    key-alias: tomcat
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. HTTP மற்றும் HTTPS-க்கு உள்ள வித்தியாசத்தை இந்த table-ஐ பாரு:

| Aspect | HTTP | HTTPS |
|--------|------|-------|
| Port | 80 | 443 |
| Data Format | Plain text | Encrypted (Ciphertext) |
| Speed | கொஞ்சம் fast | Encryption-னால கொஞ்சம் slow (ஆனா negligible) |
| Security | Vulnerable to Man-in-the-Middle (MitM) | Secure against MitM attacks |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** "Certificate expired ஆனா என்ன ஆகும்?" அப்டின்னு கேட்பாங்க. Browser user-க்கு warning காட்டும், connection block ஆகலாம். இன்னொரு trap, "Mixed content"-னா என்ன? அதாவது HTTPS page-ல HTTP image load ஆனா browser block பண்ணிடும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** TLS termination எங்க பண்றோம்னு பாக்கணும். Load Balancer-ல termination பண்ணிட்டு, internal network-ல HTTP use பண்ணலாம், ஆனா Zero Trust policy இருந்தா end-to-end encryption தேவை. Certificates renewal process-ஐ automate பண்ணலனா, production down ஆக வாய்ப்பு இருக்கு.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க mTLS (Mutual TLS) use பண்றோம். அதாவது server மட்டும் authenticate ஆனா பத்தாது, client-ம் valid certificate அனுப்பணும். Healthcare data ரொம்ப sensitive என்பதால் இது mandatory.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Architect-ஆ, Let's Encrypt மாதிரி tools வச்சு auto-renewal set பண்ணனும். Weak ciphers மற்றும் பழைய protocols (TLS 1.0, 1.1) disable பண்ணனும். HSTS (HTTP Strict Transport Security) header enable பண்ணி, எப்பவும் HTTPS-ல தான் connect ஆகணும்னு force பண்ணனும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Asymmetric vs Symmetric encryption TLS-ல எப்படி use ஆகுது?
*Answer:* Handshake நடக்கும்போது Asymmetric encryption (Public/Private key) use ஆகும். ஆனா data transfer நடக்கும்போது Symmetric encryption (Session key) use ஆகும், ஏன்னா அது fast.

**Q:** mTLS-னா என்ன?
*Answer:* Mutual TLS. Server மட்டும் certificate தரமா, Client-ம் தன்னோட certificate-ஐ server-க்கு கொடுத்து ரெண்டு side-லும் authentication நடக்கும்.

---

## Quick Revision Summary

- HTTPS = HTTP + TLS.
- Port 443-ல் இயங்கும், data encrypted ஆக இருக்கும்.
- Handshake-ல் asymmetric encryption, data transfer-ல் symmetric encryption.
- Certificate validity மற்றும் ciphers production-ல் முக்கியம்.
- mTLS இரண்டு பக்க authentication-ஐ உறுதி செய்கிறது.
