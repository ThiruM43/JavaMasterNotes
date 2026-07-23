# Java Interview Podcast — Episode: Rate Limiting Algorithms
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, இன்னைக்கு Rate Limiting Algorithms பத்தி பேசலாம். இதுல நிறைய types இருக்கு, அதெல்லாம் என்ன?

**Thiru:** கண்டிப்பா Mahi. **Rate Limiting** [ஒரு user-ஆல எவ்வளவு requests அனுப்ப முடியும்னு கட்டுப்படுத்துறது]. இதுல main-ஆ Token Bucket, Leaky Bucket, Fixed Window, Sliding Window Logனு நாலு algorithms இருக்கு.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு theme park analogy எடுத்துக்கலாம்.
- **Token Bucket:** Rides-ல tokens குடுத்து போறது. Tokens இருந்தா ride பண்ணலாம்.
- **Leaky Bucket:** ஒரு bucket-ல தண்ணி ஊத்துனா, கீழ இருக்குற ஓட்டை வழியா constant-ஆ வெளிய போறது மாதிரி.
- **Fixed Window:** ஒரு மணி நேரத்துக்கு 5 tokens, அடுத்த மணி நேரத்துக்கு புதுசா 5 tokens.
- **Sliding Window:** எந்த நிமிஷத்துல இருந்து கணக்கு பார்த்தாலும், முந்தைய 60 நிமிஷத்துல 5 tokens தான் allow பண்ணுவோம்.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Token Bucket algorithm-ல ஒரு bucket இருக்கும், அதுல tokens add ஆகிட்டே இருக்கும். Request வரும்போது token இருந்தா process ஆகும், இல்லனா drop ஆகும். இதோ ஒரு simple Java snippet:

```java
public class TokenBucket {
    private final long maxBucketSize;
    private final long refillRate;
    private double currentBucketSize;
    private long lastRefillTimestamp;

    public TokenBucket(long maxBucketSize, long refillRate) {
        this.maxBucketSize = maxBucketSize;
        this.refillRate = refillRate;
        this.currentBucketSize = maxBucketSize;
        this.lastRefillTimestamp = System.nanoTime();
    }

    public synchronized boolean allowRequest(int tokens) {
        refill();
        if (currentBucketSize >= tokens) {
            currentBucketSize -= tokens;
            return true;
        }
        return false;
    }

    private void refill() {
        long now = System.nanoTime();
        double tokensToAdd = (now - lastRefillTimestamp) * refillRate / 1e9;
        currentBucketSize = Math.min(currentBucketSize + tokensToAdd, maxBucketSize);
        lastRefillTimestamp = now;
    }
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Algorithm | Pros | Cons |
|--------|----------|----------|
| Token Bucket | Bursty traffic-ஐ allow பண்ணும். Memory efficient. | Refill rate tune பண்றது கொஞ்சம் கஷ்டம். |
| Leaky Bucket | Constant rate-ல traffic-ஐ process பண்ணும். | Bursty traffic-ஐ drop பண்ணிடும். |
| Fixed Window | Implement பண்ண ரொம்ப easy. | Window edges-ல double traffic allow ஆக வாய்ப்பு இருக்கு. |
| Sliding Window | Edge conditions problem வராது, very accurate. | Memory அதிகம் தேவைப்படும் (logs store பண்ண). |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Interviewer கண்டிப்பா "Fixed window-ல என்ன problem?"னு கேட்பார். Window start ஆகுறப்பவும், end ஆகுறப்பவும் requests burst ஆனா, limit-ஐ விட ரெண்டு மடங்கு traffic server-ஐ hit பண்ணும்னு சொல்லணும். Redis use பண்ணி distributed environment-ல எப்படி limit பண்றதுனும் கேட்பாங்க.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Distributed systems-ல rate limit பண்றது கஷ்டம். Redis use பண்ணி state maintain பண்ணும்போது latency அதிகமாகலாம். User IP வச்சு limit பண்றதா, இல்ல user ID வச்சு பண்றதானு முடிவு பண்றது ரொம்ப முக்கியம்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க Token Bucket algorithm தான் use பண்றோம். FHIR server-க்கு report அனுப்பும்போது, அவங்க API rate limits-ஐ தாண்டி hit பண்ண கூடாதுனு, Resilience4j RateLimiter வெச்சு configure பண்ணிருக்கோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Client-side rate limiting தேவையா, இல்ல server-side மட்டுமா, இல்ல API Gateway (Kong/Apigee) level-ல handle பண்ணலாமானு முடிவு பண்ணனும். Rate limit hit ஆனா HTTP 429 Too Many Requests response தரணும், கூடவே `Retry-After` header சேத்து அனுப்பணும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Redis-ல Token Bucket எப்படி implement பண்ணுவீங்க?
*Answer:* Redis-ல Lua script use பண்ணி atomic operation-ஆ token bucket-ஐ implement பண்ணலாம், அப்போ தான் race conditions வராது.

**Q:** Sliding Window Log-க்கும் Sliding Window Counter-க்கும் என்ன வித்தியாசம்?
*Answer:* Log-ல ஒவ்வொரு request timestamp-ஐயும் store பண்ணுவோம். Counter-ல percentages வெச்சு approximate பண்ணி memory save பண்ணுவோம்.

---

## Quick Revision Summary

- Token Bucket bursty traffic-க்கு நல்லது.
- Leaky Bucket steady flow-க்கு use ஆகும்.
- Fixed window easy ஆனா edge problem இருக்கு.
- Distributed systems-ல Redis+Lua use பண்ணி rate limiting பண்ணுவோம்.
