# Java Interview Podcast — Episode: REST vs SOAP vs gRPC vs GraphQL
### Hosts: Mahi & Thiru

---

**Mahi:** வணக்கம் Thiru! Microservices APIs எழுதும்போது எதை choose பண்றதுன்னு நிறைய confusion இருக்கு. REST, SOAP, gRPC, GraphQL - இதோட differences பத்தி சொல்லுங்க.

**Thiru:** வணக்கம் Mahi! கண்டிப்பா. ஒவ்வொன்னும் ஒவ்வொரு தேவைக்காக உருவாக்கப்பட்டது. **REST** [Resource-based architecture], **SOAP** [Strict XML-based protocol], **gRPC** [High-performance RPC framework by Google], மற்றும் **GraphQL** [Query language for APIs by Facebook]. 

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு ஹோட்டலுக்கு சாப்பிட போறதை கற்பனை செஞ்சுக்கோங்க.
- **REST:** Menu card பார்த்து order பண்றது. Fixed menu.
- **GraphQL:** Buffet system மாதிரி. உங்களுக்கு என்னென்ன வேணுமோ அதை மட்டும் குறிப்பா கேட்டு வாங்குறது.
- **gRPC:** VIP fast lane. Kitchen-க்கும் உங்களுக்கும் நேரடி connection, மிக வேகமாக food வரும்.
- **SOAP:** ரொம்ப strict ஆன traditional விருந்து. Rules மீறாம பரிமாறுவாங்க, ஆனா time எடுக்கும்.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** REST HTTP/1.1-ல JSON அனுப்புது. ஆனா gRPC HTTP/2-ல Protobuf (binary format) அனுப்புது.
```protobuf
// gRPC Protobuf Example
syntax = "proto3";
package patient;

service PatientService {
  rpc GetPatient (PatientRequest) returns (PatientResponse);
}

message PatientRequest {
  string patient_id = 1;
}

message PatientResponse {
  string name = 1;
  int32 age = 2;
}
```
gRPC-ல code generate பண்ணி, directly functions-ஐ call பண்ற மாதிரி use பண்ணலாம்.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | REST | gRPC | GraphQL | SOAP |
|--------|----------|----------|----------|----------|
| **Protocol** | HTTP 1.1 / 2 | HTTP/2 (Mandatory) | HTTP 1.1 / 2 | HTTP / SMTP |
| **Data Format**| JSON / XML | Protobuf (Binary) | JSON | XML |
| **Performance**| Moderate | Very High | Moderate | Low |
| **Best For** | Public APIs, CRUD | Internal Microservices | Mobile apps, Complex UIs | Legacy enterprise systems |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** GraphQL-ல "N+1 Problem" ரொம்ப common. ஒரு query-ல nested data கேட்கும்போது, backend-ல நிறைய DB calls போகும். இதை solve பண்ண DataLoader use பண்ணனும். REST-ல over-fetching (தேவைக்கு அதிகமான data வர்றது) ஒரு issue. 

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** gRPC-ஐ நேரடியாக browser-ல இருந்து கூப்பிட முடியாது (gRPC-Web வேணும்). Load balancing gRPC-க்கு கஷ்டம் ஏன்னா HTTP/2 connection-ஐ long-lived ஆக maintain பண்ணும், L7 load balancer கண்டிப்பா வேணும். REST-ல caching ஈஸி, ஆனா GraphQL-ல endpoint ஒன்னு தான் (`/graphql`) அதனால HTTP level caching கஷ்டம்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க external hospitals கூட communicate பண்ண REST (FHIR standards) use பண்றோம். ஆனா எங்க internal microservices-க்கு நடுவுல data pass பண்ண gRPC use பண்றோம், ஏன்னா அது ரொம்ப fast அண்ட் network latency குறைவு.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Client யார்னு பாக்கணும். Public developer API-னா REST தான் best. Mobile team-க்கு நிறைய UI changes இருந்தா GraphQL கொடுங்க. Backend-to-backend high speed communication வேணும்னா gRPC choose பண்ணனும். Legacy bank systems-க்கு மட்டும் SOAP.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** gRPC ஏன் REST-ஐ விட fast ஆக இருக்கு?
*Answer:* gRPC binary data (Protobuf)-ஐ use பண்ணுது, parsing ரொம்ப fast. HTTP/2 use பண்றதால multiplexing, header compression மற்றும் server push support இருக்கு.

**Q:** REST-ல Idempotency எப்படி handle பண்ணுவீங்க?
*Answer:* GET, PUT, DELETE methods இயல்பாகவே idempotent. POST idempotent கிடையாது, அதுக்கு Idempotency-Key header use பண்ணி duplicate requests-ஐ DB-ல check பண்ணுவோம்.

---

## Quick Revision Summary

- REST is simple, universally accepted, uses HTTP verbs.
- gRPC is for high-performance internal microservices using HTTP/2 and Protobuf.
- GraphQL solves over/under-fetching, great for flexible frontends.
- SOAP is legacy, strict XML contract-based (WSDL).
- Choose based on the client (Public=REST, Internal=gRPC, UI=GraphQL).
