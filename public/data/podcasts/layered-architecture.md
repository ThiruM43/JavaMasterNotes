# Java Interview Podcast — Episode: Layered Architecture (Controller → Service → Repository/DAO)
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, ஒவ்வொரு Spring Boot project-லயும் Controller, Service, Repository nu package structure பார்க்குறோம். இது ஏன் இப்படி பிரிக்கப்படுது?

**Thiru:** இதுதான் **Layered Architecture** [application-ஐ responsibility அடிப்படையில் தனித்தனி layers-ஆ பிரிக்கும் design approach] Mahi. ஒவ்வொரு layer-க்கும் ஒரு specific job இருக்கும், அதுக்கு மேல அது தலையிடாது. **Controller** layer request receive பண்ணும், **Service** layer business logic handle பண்ணும், **Repository/DAO** layer database access handle பண்ணும். ஒரு layer இன்னொரு layer-ன் internal details-ஐ தெரிஞ்சுக்கக் கூடாது — அதுதான் core principle.

**Mahi:** ஏன் இப்படி layer-ஆ பிரிக்கணும்? எல்லாத்தையும் ஒரே class-ல எழுதலாமே?

**Thiru:** எழுதலாம், ஆனா அது maintain பண்ண கஷ்டமாகும். Layer-ஆ பிரிச்சா, ஒவ்வொரு layer-ம் **independently testable** ஆகும், responsibility clear-ஆ இருக்கும், ஒரு layer-ல change பண்ணா மற்ற layers-ஐ touch பண்ண தேவையில்லாம இருக்கும்.

---

## 1. Real World Analogy

**Mahi:** Analogy சொல்லுங்க.

**Thiru:** ஒரு restaurant-ஐ நினைச்சுக்கோ. **Waiter** (Controller) customer-கிட்ட order வாங்குவார், அவருக்கு cooking பத்தி தெரியாது. **Chef** (Service) order-ஐ processing பண்ணி, recipe logic apply பண்ணி dish prepare பண்ணுவார், ஆனா raw materials எங்க store பண்ணிருக்கு என்பது அவருக்கு தெரிய தேவையில்லை. **Store keeper** (Repository/DAO) raw materials-ஐ store room-லிருந்து எடுத்துக் கொடுப்பார், cooking அவருக்கு தெரிய தேவையில்லை.

Waiter நேரடியா store room-க்கு போய் materials எடுக்க மாட்டார் — chef-கிட்ட தான் கேப்பார். இதே போல, Controller நேரடியா database access பண்ணக்கூடாது — Service மூலமா தான் போகணும்.

---

## 2. The Three Layers — Responsibility Breakdown

**Mahi:** ஒவ்வொரு layer-ன் exact responsibility என்ன?

**Thiru:** விரிவா பார்ப்போம்.

**Controller Layer** — HTTP request receive பண்ணுது, input validate பண்ணுது (basic level), Service-ஐ call பண்ணுது, response format பண்ணி client-க்கு அனுப்புது. **Business logic இங்க இருக்கக் கூடாது.**

```java
@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientDto> getPatient(@PathVariable Long id) {
        PatientDto patient = patientService.findPatientById(id);
        return ResponseEntity.ok(patient);
    }
}
```

**Service Layer** — business logic, validation rules, orchestration (multiple repositories/services-ஐ coordinate பண்றது), transaction management. **இது தான் application-ன் "brain".**

```java
@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @Transactional
    public PatientDto findPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new PatientNotFoundException(id));
        return mapToDto(patient);
    }
}
```

**Repository/DAO Layer** — database-ஓட நேரடி interaction. SQL queries, JPA methods, data access logic. **Business logic இங்க இருக்கக் கூடாது.**

```java
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByMedicalRecordNumber(String mrn);
}
```

---

## 3. Comparison Table

| Layer | Responsibility | Should NOT contain | Talks to |
|---|---|---|---|
| **Controller** | HTTP handling, request/response mapping | Business logic, DB queries | Service layer only |
| **Service** | Business logic, validation, orchestration, transactions | HTTP-specific code, raw SQL | Repository layer, other Services |
| **Repository/DAO** | Database CRUD operations, queries | Business rules, HTTP concerns | Database only |

---

## 4. Why This Separation Matters — Edge Cases

**Mahi:** இதை follow பண்ணாம code எழுதினா என்ன பிரச்சனை வரும்?

**Thiru:** ஒரு classic mistake — Controller-ல நேரடியா Repository-ஐ inject பண்ணி call பண்றது.

```java
// BAD — Controller directly using Repository, skipping Service
@RestController
public class PatientController {
    private final PatientRepository patientRepository; // WRONG layer skip

    @GetMapping("/{id}")
    public Patient getPatient(@PathVariable Long id) {
        return patientRepository.findById(id).orElseThrow();
        // No business logic, no validation, no transaction control possible here
    }
}
```

இதுல என்ன பிரச்சனை? நாளைக்கு "patient inactive-ஆ இருந்தா error throw பண்ணணும்" போன்ற business rule add பண்ணணும்னா, Controller-ல logic போடணும் — இது architecture-ஐ மீறும். Business logic scatter ஆகி, test பண்றதும் கஷ்டமாகும்.

இன்னொரு trap — Service layer-ல HTTP-specific code வருது.

```java
// BAD — Service layer knows about HTTP, which is Controller's job
@Service
public class PatientService {
    public ResponseEntity<PatientDto> findPatient(Long id) { // WRONG return type
        // Service should never know about ResponseEntity/HTTP status
    }
}
```

Service layer HTTP-ஐ பத்தி தெரியவே கூடாது — அது Controller-ன் responsibility. இப்படி பண்ணா, நாளைக்கு அதே Service-ஐ ஒரு Kafka consumer-லிருந்தோ, batch job-லிருந்தோ call பண்ணணும்னா முடியாது, ஏன்னா அது HTTP-க்கு tightly coupled ஆயிடும்.

---

## 5. DAO vs Repository — What's the Difference?

**Mahi:** DAO-ம் Repository-ம் ஒண்ணு தானா, இல்ல வித்தியாசம் இருக்கா?

**Thiru:** நல்ல கேள்வி, இது often confuse ஆகும். **DAO (Data Access Object)** pattern-ல, நீ manual-ஆ CRUD methods எழுதுவீங்க — `save()`, `findById()`, `delete()` — எல்லாத்தையும் implement பண்ணணும். **Repository** pattern (Spring Data JPA-ல) இதைவிட ஒரு abstraction level மேல — `JpaRepository` interface extend பண்ணா, Spring automatic-ஆ implementation generate பண்ணிடும், நீ method signature மட்டும் define பண்ணா போதும்.

```java
// DAO style - manual implementation
public class PatientDaoImpl implements PatientDao {
    @PersistenceContext
    private EntityManager entityManager;

    public Patient findById(Long id) {
        return entityManager.find(Patient.class, id);
    }
    // every method manually written
}

// Repository style - Spring Data JPA auto-generates implementation
public interface PatientRepository extends JpaRepository<Patient, Long> {
    // no implementation needed, Spring generates it
    Optional<Patient> findByMedicalRecordNumber(String mrn);
}
```

Modern Spring Boot projects-ல பெரும்பாலும் Repository pattern தான் use பண்றாங்க, ஏன்னா boilerplate code குறையும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்முடைய ECR Now project-ல இந்த layering எப்படி இருந்தது?

**Thiru:** ECR Now [Electronic Case Reporting Now — Spring Boot microservice, hospital EHR systems-லிருந்து disease reporting-ஐ CDC-க்கு automatic-ஆக அனுப்பும் system] project-ல strict layering follow பண்ணோம்:

- `CaseReportController` — REST endpoint expose பண்ணி, incoming trigger events receive பண்ணும்.
- `CaseReportService` — business logic handle பண்ணும்: trigger code validate பண்றது, **FHIR resources** [Fast Healthcare Interoperability Resources — healthcare data exchange standard] build பண்றது, CDC submission trigger பண்றது.
- `PatientRepository`, `TriggerEventRepository` — database access மட்டும்.

ஒரு real production benefit — CDC submission logic-ல ஒரு bug fix பண்ணணும்னா, Service layer-ல மட்டும் change பண்ணா போதும், Controller layer touch பண்ண தேவையில்ல. அதே Service method-ஐ **IMAP polling module**-லிருந்தும், **scheduled batch job**-லிருந்தும் call பண்ண முடிஞ்சது — ஏன்னா Service layer HTTP-ஐ பத்தி எதுவும் தெரியாது, pure business logic மட்டும்.

---

## 7. Senior/Architect Perspective

**Mahi:** Senior engineer இந்த topic-ஐ எப்படி approach பண்ணணும்?

**Thiru:** Senior level-ல கேட்கவேண்டிய questions:

- Service layer-ல transaction boundaries சரியா define பண்ணிருக்கோமா? `@Transactional` எந்த method-ல இருக்கணும் என்பது architecture decision.
- Controller layer thin-ஆ இருக்கா, இல்ல business logic leak ஆகுதா?
- ஒரு Service, இன்னொரு Service-ஐ directly call பண்றதா, இல்ல events/message queue மூலமா decouple பண்ணணுமா? (microservices context-ல முக்கியம்)
- DTO (Data Transfer Object) layer boundary-ல எப்போ use பண்ணணும்? — Entity objects நேரடியா Controller-க்கு expose பண்ணக்கூடாது, security மற்றும் coupling பிரச்சனைகள் வரும்.
- Repository layer-ல complex query logic இருந்தா, அது business logic-ஆ மாறிடுமா? — Query itself simple-ஆ இருக்கணும், aggregation/filtering logic Service-ல இருக்கணும்.

---

## 8. Interview Deep-Dive Questions

**Q:** Controller-ல business logic ஏன் வைக்கக்கூடாது?
*Answer:* Controller HTTP concerns-க்கு மட்டும் responsible ஆக இருக்கணும். Business logic அங்க வெச்சா, அதே logic-ஐ வேற entry point-லிருந்து (Kafka consumer, scheduled job) reuse பண்ண முடியாது, test பண்றதும் HTTP layer-ஐ mock பண்ணித்தான் ஆகணும்.

**Q:** DAO-க்கும் Repository-க்கும் என்ன வித்தியாசம்?
*Answer:* DAO pattern-ல developer manual-ஆ CRUD methods implement பண்ணணும். Repository pattern (Spring Data JPA) automatic-ஆ implementation generate பண்ணும், developer method signature மட்டும் define பண்ணா போதும்.

**Q:** Entity object-ஐ நேரடியா Controller response-ஆ அனுப்பலாமா?
*Answer:* Best practice இல்ல. Entity-ல sensitive fields இருக்கலாம், lazy-loaded associations serialize ஆகும்போது error வரலாம். DTO (Data Transfer Object) use பண்ணி, தேவையான fields மட்டும் expose பண்றது correct approach.

**Q:** ஒரு Service, இன்னொரு Service-ஐ directly call பண்றது problem-ஆ?
*Answer:* Single application-க்குள்ள (monolith) பிரச்சனை இல்ல. ஆனா microservices context-ல, ஒரு Service directly வேற Service-ஐ call பண்ணா tight coupling ஏற்படும் — network failure handle பண்ண Circuit Breaker/Retry தேவைப்படும், அல்லது event-driven approach (message queue) பரிசீலிக்கணும்.

---

## Quick Revision Summary

- Three layers: **Controller** (HTTP handling) → **Service** (business logic) → **Repository/DAO** (database access)
- Each layer should only talk to the layer directly below it — Controller should never call Repository directly
- Controller = thin layer, no business logic, no DB queries
- Service = the "brain" — validation, orchestration, `@Transactional` boundaries live here
- Repository/DAO = pure data access — no business rules
- DAO = manual CRUD implementation; Repository (Spring Data JPA) = auto-generated implementation from interface
- Skipping layers (Controller → Repository directly) breaks testability and scatters business logic
- Service layer should never know about HTTP (no `ResponseEntity` in Service methods)
- ECR Now: Service layer reused across REST Controller, IMAP polling module, and scheduled jobs — proof that decoupling HTTP from business logic pays off
- Use DTOs at layer boundaries, especially Controller responses — don't expose Entity objects directly

**Mahi:** Super Thiru, இப்போ layered architecture-ன் purpose கிளியர்-ஆ புரியுது.

**Thiru:** Correct Mahi. அடுத்த episode-க்கு போலாம்.

---
*End of Episode: Layered Architecture (Controller → Service → Repository/DAO)*
