# Java Interview Podcast — Episode: Database Indexing
### Hosts: Mahi & Thiru

---

**Mahi:** இன்னைக்கு நாம Database Indexing பத்தி பேசலாம். Database performance-ல இது ஏன் இவ்வளவு முக்கியம்?

**Thiru:** கண்டிப்பா Mahi. **Indexing** [Data-வை சீக்கிரமா தேடி எடுக்க உதவுற data structure] ஒரு புக்கோட index page மாதிரி. Index இல்லன்னா database முழு table-ஐயும் scan பண்ணி தேடணும், இதுக்கு பேரு Full Table Scan, ரொம்ப slow.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு 1000 பக்க dictionary எடுத்துக்கோ. உனக்கு 'Java' அப்டிங்கற word தேடணும். Index இல்லன்னா முதல் பக்கத்துல இருந்து ஒவ்வொரு பக்கமா தேடணும். ஆனா index இருந்தா நேரா 'J' section போயிட்டு ஈஸியா கண்டுபிடிச்சிடலாம். Database Indexing-ம் இதே மாதிரி தான் B-Tree data structure வச்சி தேடுறத fast ஆக்குது.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Databases generally B-Tree (Balanced Tree) அல்லது B+ Tree use பண்ணும். Spring Data JPA-ல index எப்படி create பண்றதுன்னு பாரு:

```java
@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_user_email", columnList = "email", unique = true)
})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Index created for fast email lookups
    private String email;
    
    private String username;
}
```
இங்க `email` column-க்கு ஒரு index create பண்ணிருக்கோம், ஏன்னா login பண்ணும்போது email வச்சு தான் அடிக்கடி query பண்ணுவோம்.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. Clustered vs Non-Clustered index table-ஐ பாரு:
| Aspect | Clustered Index | Non-Clustered Index |
|--------|----------|----------|
| **Data Storage** | Dictates physical order of data | Separate structure with pointers |
| **Count per Table** | Only one allowed (usually Primary Key) | Multiple allowed |
| **Speed** | Very fast for retrieval | Fast, but needs one extra hop |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** "எல்லா columns-க்கும் index create பண்ணா database செம்ம fast ஆயிடுமா?" அப்டின்னு கேப்பாங்க. இல்ல, index create பண்ணா Read fast ஆகும், ஆனா Insert, Update, Delete எல்லாம் slow ஆகிடும், ஏன்னா data-வோட சேர்த்து index tree-யும் update ஆகணும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Index bloat ஒரு பெரிய problem. தேவை இல்லாத index நிறைய இருந்தா storage space அதிகமா எடுக்கும். Cardinality கம்மியா இருக்குற column-க்கு (e.g., Gender - Male/Female) index create பண்றது waste, database index-ஐ ignore பண்ணிட்டு full table scan தான் பண்ணும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க report status (`status="PENDING"`) வச்சு நிறைய batch jobs run பண்றோம். ஆனா `status` column-க்கு cardinality கம்மிங்குறதால, `status` + `created_date` சேர்த்து Composite Index create பண்ணோம், அப்போ query performance சூப்பரா improve ஆச்சு.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Query Execution Plan (EXPLAIN query) analyze பண்ண தெரியணும். ஒரு query ஏன் slow-ஆ இருக்கு, அது எந்த index-ஐ use பண்ணுதுன்னு பாத்து, தேவைப்பட்டா covering index create பண்ணி performance tune பண்ணனும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** What is a Covering Index?
*Answer:* ஒரு query-க்கு தேவையான எல்லா columns-ம் index-லயே இருந்தா, database main table-ஐ போய் பாக்க தேவையில்லை. இதான் Covering Index. இது ரொம்ப fast.

**Q:** Why does database use B+ Tree instead of normal BST?
*Answer:* B+ Tree-ல data எல்லாமே leaf nodes-ல தான் இருக்கும், அதோட leaf nodes எல்லாம் linked list மாதிரி connect ஆகியிருக்கும். அதனால range queries (`BETWEEN`, `>`, `<`) பண்றது ரொம்ப fast.

---

## Quick Revision Summary

- Indexing speeds up `SELECT` queries but slows down `INSERT`/`UPDATE`/`DELETE`.
- Clustered index stores actual data, Non-clustered stores pointers.
- B+ Trees are commonly used for database indexes.
- Don't index low-cardinality columns (like boolean/gender).
- Use `EXPLAIN` to understand how your database uses indexes.
