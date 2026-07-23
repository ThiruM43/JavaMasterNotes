# Java Interview Podcast — Episode: Webhooks vs Polling
### Hosts: Mahi & Thiru

---

**Mahi:** வணக்கம் Thiru! System integration பத்தி பேசும்போது Webhooks மற்றும் Polling அடிக்கடி வருது. இதோட வித்தியாசம் என்ன?

**Thiru:** வணக்கம் Mahi! ஒரு system-ல இருந்து இன்னொரு system-க்கு data updates-ஐ வாங்குறதுக்கான இரண்டு வழிகள் தான் இவை. **Polling** [நாமளே போய் அடிக்கடி செக் பண்றது], **Webhooks** [update வந்ததும் அவங்களே நமக்கு தகவல் சொல்றது].

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** Swiggy-ல food order பண்ணிட்டு வெயிட் பண்றோம்னு வைங்க.
- **Polling:** Delivery boy-க்கு நீங்களே ஒவ்வொரு 5 நிமிஷத்துக்கும் phone பண்ணி, "வந்துட்டீங்களா? வந்துட்டீங்களா?"-னு கேக்குறது.
- **Long Polling:** Phone பண்ணி, அவர் வர வரைக்கும் line-லேயே hold-ல இருக்குறது.
- **Webhook:** Delivery boy வந்து உங்க வீட்டு Calling Bell-ஐ அடிக்கிறது. நீங்க எதுவும் செக் பண்ண தேவையில்லை.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Webhook-ல நாம ஒரு URL-ஐ 3rd party system-ல register பண்ணிடுவோம். Event நடக்கும்போது அவங்க நம்ம URL-க்கு ஒரு POST request அனுப்புவாங்க.
```java
// Webhook endpoint in Spring Boot
@RestController
@RequestMapping("/api/webhooks")
public class PaymentWebhookController {

    @PostMapping("/stripe")
    public ResponseEntity<String> handlePaymentEvent(
            @RequestHeader("Stripe-Signature") String signature,
            @RequestBody String payload) {
        
        // 1. Verify Signature for security
        // 2. Process payload asynchronously
        // 3. Return 200 OK quickly
        return ResponseEntity.ok("Received");
    }
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Short Polling | Long Polling | Webhooks |
|--------|----------|----------|----------|
| **Communication** | Client requests often | Client requests, holds connection | Server pushes to Client URL |
| **Resource Usage**| High (Many empty responses) | Medium (Connections held) | Low (Only called when needed) |
| **Latency** | Medium (Depends on interval) | Low | Very Low (Real-time) |
| **Setup Complexity**| Easy | Medium | Hard (Requires exposed public URL) |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Webhook delivery fail ஆனா என்ன ஆகும்னு கேப்பாங்க. Webhook provider (ex: Stripe, GitHub) retries பண்ணுவாங்க. நாம நம்ம webhook endpoint-ஐ Idempotent-ஆ design பண்ணனும். ஏன்னா provider ஒரே webhook-ஐ ரெண்டு முறை அனுப்ப வாய்ப்பு இருக்கு.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Webhooks-ஐ secure பண்றது ரொம்ப முக்கியம். யாரு வேணாலும் உங்க URL-க்கு request அனுப்பலாம். அதனால HMAC signatures use பண்ணி verify பண்ணனும். Webhook வந்த உடனே data-வை queue (Kafka/RabbitMQ)-ல போட்டுட்டு 200 OK அனுப்பிடனும். Sync-ஆ process பண்ணா timeout ஆகி provider திரும்ப திரும்ப அனுப்புவாங்க.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க IMAP IDLE (Long polling மாதிரி) use பண்றோம் புது emails-க்கு. ஆனா partner hospitals-ல இருந்து EHR updates வரும்போது Webhooks use பண்றோம். CDC-க்கு report success ஆனதும் webhook மூலமா update வாங்குவோம். இதுனால CPU cycle மிச்சமாகுது.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Client-க்கு public facing IP இருக்கான்னு பாக்கணும். Internal VPC-க்குள்ள இருக்குற system-க்கு Webhook வர முடியாது, அப்போ Polling தான் use பண்ணனும். Event volume ரொம்ப அதிகமா இருந்தா, webhooks-ஆல நம்ம system crash ஆக வாய்ப்பு இருக்கு. அப்போ rate limiting use பண்ணனும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Webhook-ஐ எப்படி secure பண்ணுவீங்க?
*Answer:* HTTPS கட்டாயம். Provider அனுப்புற Secret Key வெச்சு Payload-க்கு Hash create பண்ணி, Header-ல வர்ற Signature-உடன் match ஆகுதான்னு HMAC verification பண்ணுவேன்.

**Q:** Polling-ல Exponential Backoff-னா என்ன?
*Answer:* Server error அடிச்சா, உடனே திரும்ப திரும்ப கேக்காம, 2 sec, 4 sec, 8 sec-னு time-ஐ அதிகப்படுத்திக்கிட்டே போயிட்டு request அனுப்புற முறை.

---

## Quick Revision Summary

- Polling is pull-based, Webhooks are push-based.
- Webhooks are highly efficient and real-time.
- Polling wastes resources with empty responses.
- Webhook endpoints must be fast, idempotent, and secure (HMAC).
- Use Long Polling or Server-Sent Events (SSE) if clients cannot expose a public URL.
