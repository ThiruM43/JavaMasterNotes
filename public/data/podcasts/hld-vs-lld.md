# Java Interview Podcast — Episode: High-Level Design (HLD) vs Low-Level Design (LLD)
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, project architecture explain பண்ணும்போது interviewer "உங்க system-ல HLD எப்படி இருந்தது, LLD எப்படி இருந்தது" என்று கேட்பாங்க. இந்த இரண்டுக்கும் என்ன வித்தியாசம்?

**Thiru:** நல்ல கேள்வி Mahi. **HLD (High-Level Design)** என்பது system-ன் **bird's-eye view** [பறவை மேலிருந்து பார்க்கும் மாதிரி, மொத்த picture-ஐ ஒரே பார்வையில் காட்டும் view] — modules என்னென்ன இருக்கு, அவை எப்படி ஒன்றோடு ஒன்று interact பண்றது, data flow எப்படி இருக்கு என்பதை காட்டும். **LLD (Low-Level Design)** என்பது ஒவ்வொரு module-க்குள்ளும் போய், actual classes, methods, database schema, algorithms — code-க்கு நேரடியாக translate ஆகக்கூடிய level-ல design பண்றது.

**Mahi:** அப்போ HLD architect பண்ணுவாங்க, LLD developer பண்ணுவாங்களா?

**Thiru:** பொதுவா அப்படித்தான் பிரிக்கப்படும், ஆனா senior/lead level-ல நீ இரண்டையுமே பண்ணணும். HLD இல்லாம LLD start பண்ணா, system-ன் பெரிய picture இல்லாமல் code எழுதுவே — module boundaries தப்பா இருக்கலாம். LLD இல்லாம HLD மட்டும் இருந்தா, developer-கிட்ட implementation details தெளிவா இருக்காது.

---

## 1. Real World Analogy

**Mahi:** Analogy சொல்லுங்க.

**Thiru:** ஒரு வீடு கட்டுறதை நினைச்சுக்கோ. **HLD** என்பது architect வரைஞ்ச **building blueprint** — எத்தனை floors, எந்த room எங்க இருக்கு, kitchen எங்க, bedroom எங்க, water supply எப்படி flow ஆகும் என்பது. **LLD** என்பது ஒவ்வொரு room-க்குள்ளும் போய், எந்த wall-ல எத்தனை electrical points வேணும், எந்த brand-ன tiles, pipe diameter எவ்வளவு — construction team நேரடியா வேலை செய்யக்கூடிய level detail.

Blueprint இல்லாம room-க்குள்ள tiles போட ஆரம்பிச்சா, மொத்த வீடும் balance இல்லாம ஆகிடும். Detail இல்லாம blueprint மட்டும் வெச்சா, construction team என்ன செய்யணும்னு தெரியாது.

---

## 2. What Goes Into HLD

**Mahi:** HLD document-ல என்னென்ன இருக்கும்?

**Thiru:** HLD-ல பொதுவா இவை இருக்கும்:

- **System architecture diagram** — Monolith-ஆ, இல்ல Microservices-ஆ, எத்தனை services இருக்கு
- **Component/module breakdown** — உதாரணமா, Patient Service, Case Reporting Service, Notification Service
- **Data flow** — request எப்படி system-ல ஒரு component-லிருந்து இன்னொரு component-க்கு போகும்
- **Technology stack** — Spring Boot, PostgreSQL, Kafka, Redis — எது எதற்கு use ஆகும்
- **Non-functional requirements** — scalability, availability, latency targets
- **External integrations** — third-party APIs, other systems

```
HLD Example (conceptual, not code):

  [Hospital EHR System] 
        │
        ▼
  [IMAP Polling Service] ──► [Message Queue (Kafka)]
        │                           │
        ▼                           ▼
  [FHIR Parser Service]     [Case Reporting Service]
        │                           │
        └───────────►  [CDC Submission Service]
```

இது code இல்லை — modules எப்படி connect ஆகுதுனு காட்டுற picture.

---

## 3. What Goes Into LLD

**Mahi:** LLD-ல என்னென்ன வரும்?

**Thiru:** LLD அதைவிட ஒரு step கீழே போகும்:

- **Class diagrams** — classes, their attributes, methods, relationships (inheritance, composition)
- **Database schema** — tables, columns, foreign keys, indexes
- **API contracts** — request/response structure, endpoint design
- **Sequence diagrams** — method calls எந்த order-ல நடக்கும்
- **Design patterns applied** — Factory, Builder, Strategy எங்க use ஆகுது
- **Algorithm details** — specific logic (validation rules, retry logic, business rules)

```java
// LLD example - actual class-level detail
public class CaseReportService {
    private final PatientRepository patientRepository;
    private final FhirBuilder fhirBuilder;
    private final CdcSubmissionClient cdcClient;

    public SubmissionResult submitCaseReport(TriggerEvent event) {
        Patient patient = patientRepository.findById(event.getPatientId())
                .orElseThrow(() -> new PatientNotFoundException(event.getPatientId()));
        EicrDocument eicr = fhirBuilder.buildEicr(patient, event);
        return cdcClient.submit(eicr);
    }
}
```

இது தான் LLD level — actual method signatures, exception handling, class responsibilities எல்லாம் தெளிவா தெரியும்.

---

## 4. Comparison Table

| Aspect | HLD | LLD |
|---|---|---|
| **Focus** | System-wide structure | Module/class-level detail |
| **Audience** | Architects, stakeholders, cross-team leads | Developers implementing the code |
| **Output** | Architecture diagrams, component list | Class diagrams, schema, API specs |
| **Detail Level** | Abstract, "what" | Concrete, "how" |
| **Contains code?** | No | Sometimes — pseudocode or actual snippets |
| **Changes frequency** | Rarely changes once approved | Changes often during implementation |
| **Example question** | "How many services do you have?" | "How does your retry logic work?" |

---

## 5. Edge Cases

**Mahi:** Interview-ல trap பண்ணும் edge case சொல்லுங்க.

**Thiru:** ஒரு classic trap — "HLD-ல technology stack குறிப்பிட வேண்டுமா?" ஆமா, ஆனா **implementation details இல்லாமல்**. உதாரணமா, HLD-ல "we use a message queue for async processing" என்று சொல்வோம், ஆனா "Kafka topic name X, partition count Y" போன்ற details LLD-க்குத்தான் போகும்.

இன்னொரு trap — "microservices-ல ஒவ்வொரு service-க்கும் தனி LLD வேணுமா?" ஆமா, ஒவ்வொரு service-க்கும் அதற்குள்ள classes, DB schema வேற வேற இருக்கும், அதனால தனி LLD document வைப்பது நல்லது. ஆனா HLD ஒரே ஒன்று — முழு system-க்கும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்முடைய ECR Now project-ல HLD, LLD எப்படி இருந்தது?

**Thiru:** ECR Now [Electronic Case Reporting Now — hospital EHR systems-லிருந்து disease reporting-ஐ CDC-க்கு automatic-ஆக அனுப்பும் Spring Boot microservice] project-ல, HLD level-ல நாங்க முதலில் decide பண்ணது — IMAP polling, FHIR parsing, CDC submission — இவை மூணும் தனித்தனி concerns-ஆ இருக்கணுமா, இல்ல ஒரே service-ல இருக்கணுமா என்பது. Failure isolation காரணமா தனித்தனி modules-ஆ வைக்க முடிவெடுத்தோம் — இது HLD level decision.

LLD level-ல, ஒவ்வொரு module-க்குள்ளும் போய், **FHIR Parser Service**-ல எந்த classes இருக்கும் (`EicrBuilder`, `TriggerCodeMatcher`), database-ல எந்த tables (`patients`, `trigger_events`, `submission_status`), retry logic exact-ஆ எப்படி இருக்கும் (எத்தனை attempts, backoff interval எவ்வளவு) — இதெல்லாம் தீர்மானித்தோம்.

Interview-ல project explain பண்ணும்போது, முதலில் HLD level-ல system picture கொடுத்து, அப்புறம் interviewer கேட்ட specific question-க்கு LLD level detail-க்கு போறது தான் correct approach.

---

## 7. Senior/Architect Perspective

**Mahi:** Senior engineer இதை எப்படி balance பண்ணணும்?

**Thiru:** Senior level-ல கேட்கவேண்டிய questions:

- HLD approve ஆகும் முன்பே LLD-க்குள்ள போய் over-engineer பண்றோமா? — இது time waste-ஆ ஆகலாம், ஏன்னா HLD change ஆனா LLD முழுசும் மாறணும்.
- HLD-ல போதுமான non-functional requirements (scalability, latency, availability) capture பண்ணிருக்கோமா?
- Team communication-க்கு HLD document போதுமா, இல்ல ஒவ்வொரு developer-க்கும் தனித்தனி LLD walkthrough வேணுமா?
- HLD-ல edge cases, failure scenarios consider பண்ணிருக்கோமா, இல்ல அது LLD-ல தான் கண்டுபிடிக்கப்படுமா?

ஒரு architect-ன முக்கிய skill என்னன்னா, HLD-ல எவ்வளவு detail போடணும், எப்போ developer team-கிட்ட LLD freedom கொடுக்கணும் என்று balance பண்றது.

---

## 8. Interview Deep-Dive Questions

**Q:** HLD-ம் LLD-ம் யார் பண்றது என்று fixed rule உண்டா?
*Answer:* Traditionally architects HLD பண்ணி, developers LLD பண்ணுவாங்க. ஆனா senior/lead level engineers-க்கு இரண்டு skills-ம் வேணும் — சின்ன teams-ல ஒரே நபர் இரண்டையும் பண்ணுவது common.

**Q:** HLD document-ல database column names குறிப்பிட வேண்டுமா?
*Answer:* இல்ல. Column-level detail LLD-க்குத்தான். HLD-ல "we use PostgreSQL for relational data" என்று சொன்னால் போதும்.

**Q:** ஒரு system-ல HLD தவறா இருந்தா என்ன நடக்கும்?
*Answer:* மொத்த system-ன் module boundaries, scaling strategy, failure isolation எல்லாமே தப்பா அமையும். LLD level-ல எவ்வளவு நல்லா code எழுதினாலும், wrong HLD-ஐ fix பண்ண முடியாது — architecture-ஐயே redesign பண்ணனும்.

**Q:** Interview-ல project architecture கேக்கும்போது எந்த level-ல ஆரம்பிக்கணும்?
*Answer:* எப்பவும் HLD level-ல ஆரம்பிக்கணும் — system-ன் மொத்த picture, modules, data flow. அப்புறம் interviewer specific-ஆ ஏதாவது கேட்டா (உதாரணமா "retry logic எப்படி handle பண்றீங்க"), அப்போ LLD level detail-க்கு போகணும்.

---

## Quick Revision Summary

- HLD = system-wide "what" — modules, architecture diagram, data flow, tech stack, non-functional requirements
- LLD = module-level "how" — class diagrams, DB schema, API contracts, actual algorithm/code detail
- HLD audience: architects/stakeholders; LLD audience: developers implementing code
- HLD rarely changes once approved; LLD evolves during implementation
- Each microservice usually gets its own LLD, but the system has one shared HLD
- ECR Now: HLD decided module separation (IMAP, FHIR parsing, CDC submission); LLD decided actual classes, schema, retry logic
- Interview strategy: start explaining architecture at HLD level, drop to LLD only when the interviewer asks for specifics
- A wrong HLD can't be fixed by good LLD — architecture decisions need to be right first

**Mahi:** Super Thiru, இப்போ HLD, LLD difference கிளியர்-ஆ புரியுது.

**Thiru:** Correct Mahi. அடுத்த episode-க்கு போலாம்.

---
*End of Episode: High-Level Design (HLD) vs Low-Level Design (LLD)*
