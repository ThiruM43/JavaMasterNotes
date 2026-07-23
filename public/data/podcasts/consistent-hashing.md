# Java Interview Podcast — Episode: Consistent Hashing
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, இன்னைக்கு system design-ல Load Balancing மற்றும் Data Partitioning-க்கு use ஆகுற Consistent Hashing பத்தி பேசலாம். இது என்றால் என்ன?

**Thiru:** கண்டிப்பா Mahi. **Consistent Hashing** [ஒரு distributed system-ல servers add அல்லது remove பண்ணும்போது, குறைந்த அளவு data மட்டும் ரீ-அசைன் ஆகுற மாதிரி hash பண்ற technique]. சாதாரண hashing-ல (hash(key) % N) server count மாறினா எல்லா data-வும் மாறும், இதுதான் problem.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** உன்கிட்ட 3 delivery பாய்ஸ் இருக்காங்க. ஒரு ஏரியாவை மூணா பிரிச்சு அவங்களுக்கு குடுத்துருக்க. இப்போ 4-வது பாய் வந்தா, எல்லாருடைய ஏரியாவையும் மாத்தி குடுக்கிறது சாதாரண hashing. ஆனா Consistent hashing-ல, ஏற்கனவே இருக்கிற ஒருத்தரோட பெரிய ஏரியாவை மட்டும் ரெண்டா பிரிச்சு புது பாய்-க்கு குடுப்போம். மத்த ரெண்டு பேருக்கும் எந்த மாற்றமும் இருக்காது.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** ஒரு virtual ring (0 to 2^32 - 1) கற்பனை பண்ணிக்கோ. Servers-ஐ அதோட IP வெச்சு ring-ல ப்ளேஸ் பண்ணுவோம். Data keys-ஐயும் அதே ring-ல ப்ளேஸ் பண்ணுவோம். ஒரு data எந்த server-க்கு போகணும்னு பாக்க, ring-ல clockwise-ஆ மூவ் பண்ணி முதல்ல வர server-ஐ choose பண்ணுவோம்.
```java
import java.util.SortedMap;
import java.util.TreeMap;

public class ConsistentHash<T> {
    private final SortedMap<Integer, T> circle = new TreeMap<>();
    
    public void addServer(T server) {
        int hash = server.hashCode(); // Simplified hashing
        circle.put(hash, server);
    }
    
    public T getServer(String key) {
        if (circle.isEmpty()) return null;
        int hash = key.hashCode();
        if (!circle.containsKey(hash)) {
            // Clockwise movement
            SortedMap<Integer, T> tailMap = circle.tailMap(hash);
            hash = tailMap.isEmpty() ? circle.firstKey() : tailMap.firstKey();
        }
        return circle.get(hash);
    }
}
```
Virtual nodes use பண்ணி load-ஐ evenly distribute பண்ணலாம்.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Traditional Hashing (Modulo) | Consistent Hashing |
|--------|------------------------------|--------------------|
| Formula | hash(key) % N | Hash ring and clockwise mapping |
| Server Addition | Almost all keys are remapped | Only k/N keys are remapped (k=total keys, N=servers) |
| Server Removal | Total disruption | Only keys from failed server move to next server |
| Load Distribution | Even, but brittle | Can be uneven, solved using Virtual Nodes |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** "Consistent hashing-ல data எப்படி evenly distribute ஆகுது?" அப்படின்னு கேட்பாங்க. Physical servers கம்மியா இருக்கும்போது data evenly distribute ஆகாது (Skewness problem). இதை சால்வ் பண்ண **Virtual Nodes** use பண்ணுவோம்னு சொல்லணும். அதாவது ஒரு physical server-ஐ ring-ல பல இடங்கள்ல map பண்றது.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** State replication ரொம்ப முக்கியம். ஒரு server fail ஆனா, அதோட data அடுத்த server-க்கு போகும். ஆனா அந்த data-ஐ முன்னாடியே replicate பண்ணி வைக்கலன்னா data loss நடக்கும். Cassandra மாதிரி databases-ல replication factor வெச்சு அடுத்த N nodes-ல data காப்பி பண்ணுவாங்க.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க Redis cluster use பண்றோம். Redis cluster உள்ளூர Consistent Hashing principles (Hash slots) use பண்ணிதான் data-ஐ shards-க்குள்ள distribute பண்ணுது. புது Redis node add பண்ணும்போது downtime இல்லாம data rebalance ஆகுது.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Hash function-ஓட quality ரொம்ப முக்கியம். MD5 அல்லது MurmurHash மாதிரி good distribution குடுக்குற hash functions use பண்ணனும். Virtual nodes count எவ்வளவு வைக்கணும்னு முடிவு பண்றது architect-ஓட வேலை. அதிக nodes வெச்சா memory அதிகமாகும், கம்மியா வெச்சா load uneven ஆகும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** What problem does consistent hashing solve in distributed caching?
*Answer:* Cache servers add/remove பண்ணும்போது, cache miss rate-ஐ ரொம்ப கம்மி பண்ணுது. Traditional hashing-ல எல்லா data-வும் DB-ஐ hit பண்ணும் (Cache Stampede), consistent hashing இதை தடுக்குது.

**Q:** How do you implement Virtual Nodes?
*Answer:* `server_IP + "#1"`, `server_IP + "#2"` மாதிரி string append பண்ணி, அதோட hash-ஐ ring-ல வெக்கலாம். ஒரு physical server-க்கு பல virtual keys இருக்கும்.

---

## Quick Revision Summary

- Consistent Hashing - Distributed caching & databases-ல use ஆகும்.
- Server count மாறும்போது, k/N data மட்டும்தான் re-assign ஆகும்.
- Hash Ring-ல clockwise போய் server-ஐ கண்டுபுடிக்கணும்.
- Virtual Nodes use பண்ணி data skewness problem-ஐ சால்வ் பண்ணலாம்.
