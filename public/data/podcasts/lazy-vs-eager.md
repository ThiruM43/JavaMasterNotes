# Java Interview Podcast — Episode: Lazy vs Eager Loading
### Hosts: Mahi & Thiru

---

**Mahi:** இன்னைக்கு நாம JPA-ல Lazy vs Eager Loading பத்தி பேசலாம். Data fetch பண்ணும்போது இது ஏன் ரொம்ப முக்கியம்?

**Thiru:** கண்டிப்பா Mahi. **Fetching Strategy** [எப்போ DB ல இருந்து data எடுக்கணும்னு சொல்றது] performance-ஐ டைரக்ட்டா affect பண்ணும். தேவைப்படும்போது மட்டும் எடுக்குறது Lazy, முன்னாடியே எல்லாத்தையும் எடுக்குறது Eager.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஹோட்டல்ல போய் Meals order பண்றத நினைச்சுக்கோ.
**Eager Loading:** நீ Meals கேட்ட உடனே, சாதம், சாம்பார், ரசம், மோர், அப்பளம் னு எல்லாத்தையும் ஒன்னா கொண்டு வந்து வெச்சிடுவாங்க. (உனக்கு பிடிக்குதோ இல்லையோ).
**Lazy Loading:** முதல்ல சாதம் மட்டும் வைப்பாங்க. நீ எப்ப சாம்பார் கேக்குறியோ அப்ப மட்டும் தான் சாம்பார் கொண்டு வருவாங்க. Memory/Food waste ஆகாது!

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** JPA-ல OneToMany, ManyToMany default-ஆ Lazy. ManyToOne, OneToOne default-ஆ Eager. Hibernate internally proxy class use பண்ணி Lazy loading-ஐ manage பண்ணும்.

```java
@Entity
public class User {
    @Id
    private Long id;

    // Eager by default (Single entity)
    @ManyToOne(fetch = FetchType.EAGER)
    private Department department;

    // Lazy by default (Collection)
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Order> orders;
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Feature | Lazy Loading | Eager Loading |
|--------|----------|----------|
| **Data Fetch Time** | When explicitly accessed (`getOrders()`) | Immediately with the parent |
| **Performance** | Better memory, multiple queries (N+1) | Heavy memory, Single join query |
| **Default For** | `@OneToMany`, `@ManyToMany` | `@ManyToOne`, `@OneToOne` |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** "LazyInitializationException ஏன் வருது?" னு கேப்பாங்க. Entity-ஐ DB-ல இருந்து எடுத்துட்டு, Transaction close ஆன அப்புறம் UI layer-ல போய் `user.getOrders()` னு கூப்பிட்டா, DB connection இல்லாததால இந்த exception வரும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Eager loading-ஐ எல்லா எடத்துலயும் use பண்ணா OutOfMemoryError (OOM) வரும். ஏன்னா தேவை இல்லாத எல்லா data-வும் memory-ல load ஆகிடும். அதனால default Lazy வெச்சிட்டு, எப்ப தேவையோ அப்ப மட்டும் `JOIN FETCH` use பண்ணி eager-ஆ எடுக்கணும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) Patient records கூட அவங்களோட 100+ lab observations இருக்கும். நாங்க strict-ஆ LAZY loading தான் use பண்றோம். Specific reports generate பண்ணும்போது மட்டும் `@EntityGraph` use பண்ணி eager-ஆ fetch பண்ணிப்போம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** DTO (Data Transfer Object) projection use பண்ணனும். Architect-ஆ entity-ஐ அப்படியே REST API-ல expose பண்ண விடமாட்டோம். DTO-ல என்ன fields தேவையோ அதை மட்டும் query பண்ணி எடுப்போம், இதனால lazy/eager குழப்பமே வராது.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** How does Hibernate implement Lazy Loading?
*Answer:* Hibernate uses Proxy classes. `User` entity load ஆகும்போது அதோட `orders` list-க்கு ஒரு proxy object assign ஆகும். எப்ப `getOrders()` call ஆகுதோ, அப்ப proxy object DB-ஐ hit பண்ணி data-வை load பண்ணும்.

**Q:** How to resolve LazyInitializationException?
*Answer:* 1. `@Transactional` use பண்ணி session-ஐ open-ஆ வைக்கலாம். 2. `JOIN FETCH` query மூலமா முன்னாடியே load பண்ணலாம் (Best). 3. Open Session In View (OSIV) pattern use பண்ணலாம் (Not recommended).

---

## Quick Revision Summary

- Lazy loading fetches data on-demand using proxies.
- Eager loading fetches data immediately with the parent.
- Collections (`@OneToMany`) are Lazy by default.
- Single associations (`@ManyToOne`) are Eager by default.
- `LazyInitializationException` occurs when accessing proxy outside transaction.
