# Java Interview Podcast — Episode: Timeouts
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, API calls பண்ணும்போது Timeouts பத்தி கேக்குறாங்க. முக்கியமா Connection Timeout, Read Timeout-னு ரெண்டு சொல்றாங்க. அது என்ன?

**Thiru:** கண்டிப்பா Mahi. **Timeouts** [ஒரு request-க்கு எவ்வளவு நேரம் wait பண்ணலாம்னு சொல்றது]. **Connection Timeout** வந்து server கூட first connect ஆக எடுத்துக்குற time. **Read Timeout** வந்து connect ஆனதுக்கு அப்புறம் data வர வரைக்கும் wait பண்ற time.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** நீங்க உங்க friend-க்கு phone பண்றீங்கனு வெச்சுக்கலாம்.
- **Connection Timeout:** Phone ring ஆகிட்டே இருக்கு, ஆனா அவங்க எடுக்கவே இல்ல. எவ்வளவு நேரம் ring ஆக wait பண்ணலாம்ங்குறது தான் Connection Timeout (TCP handshake).
- **Read Timeout:** அவங்க phone-ஐ எடுத்துட்டாங்க, ஆனா ஒண்ணுமே பேசாம அமைதியா இருக்காங்க. அவங்க பேசுற வரைக்கும் நீங்க hold-ல இருக்குற time தான் Read Timeout.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Java-ல HttpClient இல்ல RestTemplate use பண்ணும்போது இதை configure பண்ணனும். இதோ Java 11+ HttpClient example:

```java
import java.net.http.HttpClient;
import java.time.Duration;

public class TimeoutExample {
    public HttpClient createClient() {
        return HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5)) // Connection Timeout: 5 seconds
            .build();
    }
    
    // Request builder read timeout
    // HttpRequest request = HttpRequest.newBuilder()
    //      .uri(URI.create("https://api.example.com"))
    //      .timeout(Duration.ofSeconds(10)) // Read Timeout: 10 seconds
    //      .build();
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Connection Timeout | Read Timeout |
|--------|----------|----------|
| What it means | TCP 3-way handshake completion | Waiting for HTTP response bytes |
| Typical Value | Short (e.g., 2 to 5 seconds) | Longer (e.g., 10 to 30 seconds) |
| Reason for failure | Network issue, firewall, server down | Heavy DB query, slow processing on server |
| Exception | `java.net.ConnectException` | `java.net.SocketTimeoutException` |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** "Timeout set பண்ணலனா என்ன ஆகும்?"னு கேட்பாங்க. Default-ஆ நிறைய HTTP clients-ல infinite timeout இருக்கும் (0-னு set ஆகியிருக்கும்). அப்படின்னா server response தராம இருந்தா, உங்க thread lifetime-க்கு block ஆகி நிக்கும், OutOfMemory இல்ல Thread Pool Exhaustion வந்துடும்னு சொல்லணும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Read timeout-ஐ ரொம்ப கம்மியா வெச்சா, processing முடிஞ்சிருக்கும் ஆனா response வர delay ஆனதுனால client fail ஆகிடும். இதை "False failures"னு சொல்லுவோம். அப்புறம் retry பண்ணா duplicate transactions நடக்கும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க RestTemplate use பண்றோம். CDC FHIR server சில நேரம் ரொம்ப slow-ஆ இருக்கும். அதனால Connection timeout 5 seconds வெச்சுட்டு, Read timeout 30 seconds வெச்சிருக்கோம். Timeouts ஆனா Circuit Breaker தானா OPEN ஆகிடும்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Cascading timeouts ரொம்ப முக்கியம். API Gateway-ல 10 செகண்ட் timeout வெச்சுட்டு, backend service-ல 20 செகண்ட் timeout வெச்சா பிரயோஜனமே இல்ல. Client-ல இருந்து server வரைக்கும் timeouts properly align ஆகியிருக்கணும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Database connection pool-ல timeouts எப்படி set பண்ணுவீங்க?
*Answer:* HikariCP-ல `connectionTimeout` (DB-ல இருந்து connection வாங்க wait பண்ற time) அப்புறம் `maxLifetime` (ஒரு connection-ஐ எவ்வளவு நேரம் உயிரோட வெச்சுருக்கலாம்) set பண்ணுவோம்.

**Q:** Connection pool exhaustion எப்படி நடக்கும்?
*Answer:* Read timeout properly set பண்ணலனா, threads எல்லாம் response-க்கு wait பண்ணி block ஆகிடும். புது requests-க்கு connections கிடைக்காது.

---

## Quick Revision Summary

- Connection Timeout network connect ஆக wait பண்ற time.
- Read Timeout data வர wait பண்ற time.
- Default timeouts எப்பவுமே infinite, அதை மாத்தணும்.
- Timeouts illana Thread pool block ஆகி system crash ஆகிடும்.
