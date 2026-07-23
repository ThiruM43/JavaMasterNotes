# Java Interview Podcast — Episode: JPA Mapping Pitfalls
### Hosts: Mahi & Thiru

---

**Mahi:** இன்னைக்கு நாம JPA-ல Mapping Pitfalls பத்தி பேசலாம். OneToMany, ManyToMany mapping பண்ணும்போது developers பண்ற தப்புகள் என்ன?

**Thiru:** கண்டிப்பா Mahi. **Entity Mapping** [ரெண்டு tables-ஐ ஜாயின் பண்றது] ரொம்ப ஈஸியா தெரியும், ஆனா சரியா பண்ணலன்னா performance issues, infinite loops, data loss னு நிறைய பிரச்சனைகள் வரும்.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** நீ ஒரு கார் வாங்குற (One-To-Many). நீ தான் Owner, கார் உன்னோடது. Car registration புக்ல உன் பேரு இருக்கணும் (Foreign Key). அதை விட்டுட்டு நீயும் ஒரு நோட்டுல என் கார்-னு எழுதிட்டு, காரும் யாருக்கு சொந்தம்னு தெரியாம இருந்தா குழப்பம் வரும்ல? அதான் Bidirectional mapping-ல ஓனர் யாருனு சரியா சொல்லணும்.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Bidirectional mapping-ல `mappedBy` use பண்ணி owner யாருனு சொல்லணும். Foreign Key எந்த table-ல இருக்கோ அவங்க தான் owner.

```java
@Entity
public class Department {
    @Id
    private Long id;

    // mappedBy says "Employee entity manages this relationship"
    // Prevents creating an extra mapping table
    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL)
    private List<Employee> employees = new ArrayList<>();
}

@Entity
public class Employee {
    @Id
    private Long id;

    // The owning side (Has the Foreign Key department_id)
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. Owning side vs Inverse side பாரு:
| Aspect | Owning Side (Employee) | Inverse Side (Department) |
|--------|----------|----------|
| **Database Key** | Contains the Foreign Key | No Foreign Key |
| **Annotation** | `@JoinColumn` | `mappedBy` attribute |
| **DB Updates** | Hibernate monitors this side | Changes here are ignored for relationships |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** "JSON-ஆ convert பண்ணும்போது Infinite Recursion ஏன் வருது?" னு கேப்பாங்க. Department Employee-ஐ கூப்பிடும், Employee Department-ஐ கூப்பிடும். இதை தடுக்க `@JsonIgnore` அல்லது `@JsonManagedReference` & `@JsonBackReference` use பண்ணனும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** `CascadeType.REMOVE` ரொம்ப ஆபத்து. Department delete ஆனா அதுக்குள்ள இருக்குற எல்லா Employees-ம் delete ஆகிடுவாங்க. Production-ல Soft Delete (`deleted_flag`) use பண்றது தான் best, cascading delete யூஸ் பண்றத தவிர்க்கணும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க `@ManyToMany` mapping-ஐ முடிஞ்சவரைக்கும் avoid பண்ணுவோம். ஏன்னா Hibernate extra hidden table create பண்ணி குழப்பம் பண்ணும். அதுக்கு பதிலா நாங்களே ஒரு Mapping Entity (with `@ManyToOne` twice) create பண்ணிடுவோம், control நம்மகிட்ட இருக்கும்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** List vs Set. `@OneToMany` ல `List` use பண்ணி ரெண்டு collections fetch பண்ணா Hibernate `MultipleBagFetchException` அடிக்கும். அதனால `Set` use பண்றது நல்லது.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** What is the purpose of mappedBy?
*Answer:* Bidirectional relationship-ல எந்த entity-ல Foreign key இல்லையோ, அங்க `mappedBy` use பண்ணுவோம். இது Hibernate-க்கு "ரெண்டும் வேற வேற relation இல்ல, ஒன்னுதான்" னு சொல்லும்.

**Q:** How do you keep bidirectional relationships in sync in Java?
*Answer:* Utility methods எழுதணும். Department-ல `addEmployee(Employee e)` னு ஒரு method எழுதி, அதுல `employees.add(e)` பண்ணிட்டு, `e.setDepartment(this)` பண்ணணும்.

---

## Quick Revision Summary

- Always use `mappedBy` on the non-owning side of a bidirectional relationship.
- The owning side has the `@JoinColumn` (Foreign Key).
- Beware of infinite recursion during JSON serialization (`@JsonIgnore`).
- Avoid `@ManyToMany`; create a mapping entity with two `@ManyToOne`s instead.
- Use helper methods to keep both sides of the relationship in sync in memory.
