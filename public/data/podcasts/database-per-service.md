# Java Interview Podcast — Episode: Database per Service Pattern
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, Monolith vs Microservices episode-ல "database per service" nu சொன்னீங்க. இது exact-ஆ என்ன pattern?

**Thiru:** **Database per Service pattern** என்பது, microservices architecture-ல ஒவ்வொரு service-க்கும் தன்னோட **own, private database** இருக்கணும் என்ற principle. வேற service-ஆல அந்த database-ஐ நேரடியா access பண்ண முடியாது — data வேணும்னா, அந்த service-ன் API மூலமா தான் கேட்கணும், நேரடியா table-ஐ query பண்ணக்கூடாது.

**Mahi:** ஏன் இப்படி strict-ஆ database separate பண்ணணும்? ஒரே database share பண்ணா என்ன பிரச்சனை?

**Thiru:** Share பண்ணா, microservices-ன் core benefit-ஆன **independent deployability** [ஒவ்வொரு service-யும் மற்ற services-ஐ affect பண்ணாம தனியா deploy பண்ணும் திறன்] போயிடும். ஒரு team, தன்னோட service-க்கு DB schema change பண்ணணும்னா, மற்ற teams-ன் services அந்த table-ஐ use பண்றதால், அவங்க கூட break ஆகிடுவாங்க. Database per service, இந்த **tight coupling**-ஐ தவிர்க்கும்.

---

## 1. Real World Analogy

**Mahi:** Analogy சொல்லுங்க.

**Thiru:** ஒரு apartment building-ல தனித்தனி flats-ஐ நினைச்சுக்கோ. ஒவ்வொரு flat-க்கும் தன்னோட own kitchen storage இருக்கும் — அடுத்த flat-க்காரர் உன் kitchen-க்குள்ள வந்து, உன் ration items எடுத்துக்க முடியாது. அவங்களுக்கு ஏதாவது வேணும்னா, உன் கதவை தட்டி கேட்கணும் (API call), நீ அவங்களுக்கு கொடுக்கிறியா இல்லையான்னு தீர்மானிப்பது உன் control-ல தான் இருக்கும்.

Shared database என்பது, ஒரே kitchen-ஐ எல்லா flats-ம் share பண்றது மாதிரி — ஒருவர் rearrange பண்ணா, மற்றவங்களுக்கு பொருள் எங்கே இருக்குனு தெரியாம போயிடும்.

---

## 2. Why This Matters — Coupling Problem

**Mahi:** Shared database இருந்தா real-ஆ என்ன தப்பா நடக்கும்?

**Thiru:** உதாரணம் பார்ப்போம். Patient Service, Billing Service, Case Reporting Service — மூணுமே ஒரே `patients` table-ஐ share பண்றதா வெச்சுக்கோ.

```
BAD - Shared Database Anti-Pattern:

  [Patient Service] ─┐
  [Billing Service]  ─┼──► [Shared "patients" table]
  [Case Report Svc]  ─┘

Problem: Patient Service team wants to rename a column,
but Billing Service and Case Report Service code queries
that same column directly → both break silently.
```

இதுல, Patient Service team ஒரு column rename பண்ணா, Billing Service-ன் SQL query உடனே fail ஆகும் — ஆனா Billing Service team-க்கு அந்த change பத்தியே தெரியாது, deploy பண்ணின பிறகுதான் production-ல crash தெரியும்.

**Database per Service** இதை தடுக்கும்:

```
GOOD - Database per Service:

  [Patient Service] ──► [Patient DB]
        ▲
        │ (REST API call only)
        │
  [Billing Service] ──► [Billing DB]
  [Case Report Svc] ──► [CaseReport DB]

Patient Service can change its internal schema freely —
other services only see the stable API contract, not the table structure.
```

---

## 3. The Challenge — Cross-Service Queries & Joins

**Mahi:** ஆனா database வேற வேறா இருந்தா, ஒரு patient-ன் billing history-ம் case report history-ம் ஒரே screen-ல காட்டணும்னா எப்படி பண்றது? SQL JOIN பண்ண முடியாதே?

**Thiru:** சரியான கேள்வி — இது தான் இந்த pattern-ன் **biggest trade-off**. Database வேற வேறா இருக்கும்போது, traditional SQL JOIN across services சாத்தியமே இல்ல. அதற்கு பதிலா, இரண்டு approaches use பண்றாங்க:

**API Composition** — calling service, multiple services-ஐ separately call பண்ணி, application code-ல results-ஐ combine பண்ணும்.

```java
// API Composition - joining data at the application layer
@Service
public class PatientDashboardService {

    public PatientDashboard getDashboard(Long patientId) {
        Patient patient = patientServiceClient.getPatient(patientId);
        List<Invoice> invoices = billingServiceClient.getInvoices(patientId);
        List<CaseReport> reports = caseReportServiceClient.getReports(patientId);

        return new PatientDashboard(patient, invoices, reports); // combined in code, not SQL
    }
}
```

**Event-Driven Data Sync** — ஒரு service, தேவையான data-ஐ **events** மூலமா கேட்டு, தன்னோட local copy-ஆ (read-only) வைத்திருக்கும். உதாரணமா, Billing Service, Patient Service-லிருந்து "patient created/updated" events subscribe பண்ணி, patient name-ஐ தன் local DB-ல duplicate-ஆ வைத்திருக்கலாம் — invoice generate பண்ணும்போது நேரடியா call பண்ண தேவையில்லாம.

---

## 4. Comparison Table

| Aspect | Shared Database | Database per Service |
|---|---|---|
| **Deployment independence** | Broken — schema change affects multiple services | Preserved — each service evolves independently |
| **Data consistency** | Easy (single ACID transaction) | Hard — needs Saga pattern or eventual consistency |
| **Cross-entity queries** | Simple SQL JOIN | API Composition or event-driven sync needed |
| **Team autonomy** | Low — schema changes need cross-team coordination | High — each team owns their schema |
| **Failure isolation** | Weak — DB issue affects all services | Strong — one service's DB issue doesn't directly break others |
| **Operational complexity** | Lower | Higher (multiple databases to manage) |

---

## 5. Edge Cases

**Mahi:** Interview-ல trap பண்ணும் edge case சொல்லுங்க.

**Thiru:** ஒரு classic trap — "Database per service-னா, transaction integrity எப்படி maintain பண்றது?" Monolith-ல, ஒரே DB transaction-ல multiple tables update பண்ணி, ஏதாவது fail ஆனா முழுசையும் rollback பண்ணலாம். Multiple databases-ல, இது சாத்தியமே இல்ல. அதற்கு **Saga pattern** [multi-step transaction-ஐ, ஒவ்வொரு step-க்கும் compensating action வெச்சு manage பண்ணும் approach] தேவைப்படும் — ஒரு step fail ஆனா, முந்தைய steps-ஐ manual-ஆ undo பண்ணும் compensating actions run ஆகும்.

இன்னொரு trap — "எல்லா microservice-க்கும் completely வேற database engine use பண்ணலாமா?" ஆமா, technically use பண்ணலாம் — Patient Service PostgreSQL use பண்ணலாம், Case Report Service MongoDB use பண்ணலாம். இதுக்கு **polyglot persistence** [service-ன் data pattern-க்கு எது சரியோ, அதை choose பண்ணும் freedom] என்று பெயர். ஆனா operational complexity அதிகரிக்கும் — multiple DB engines maintain பண்ண team-க்கு skill/tooling தேவை.

---

## 6. ECR Now Production Experience

**Mahi:** நம்முடைய ECR Now project-ல Database per Service எப்படி apply ஆகுது?

**Thiru:** ECR Now [Electronic Case Reporting Now — hospital EHR systems-லிருந்து disease reporting-ஐ CDC-க்கு automatic-ஆக அனுப்பும் Spring Boot microservice] system-ல, `case-reporting-service`-க்கு தன்னோட database இருக்கு — trigger events, submission status, CDC response records இதுல இருக்கும். `patient-service`-க்கு அதன் own database — patient demographics.

`case-reporting-service`-க்கு patient details தேவைப்படும்போது, நேரடியா patient DB-ஐ query பண்ணாது — `patient-service`-ன் REST API call பண்ணி தான் தேவையான fields பெறும். இதனால, Patient Service team, தங்க internal schema-ஐ (உதாரணமா, ஒரு column split பண்றது) freely change பண்ண முடியும், case-reporting-service-ஐ affect பண்ணாம — API contract மட்டும் stable-ஆ இருந்தா போதும்.

**Submission status tracking**-க்கு, CDC response processing service, case-reporting-service-லிருந்து events subscribe பண்ணி, status updates-ஐ தன்னோட local database-ல reflect பண்ணும் — இது event-driven sync-க்கு real example.

---

## 7. Senior/Architect Perspective

**Mahi:** Senior engineer இதை எப்படி approach பண்ணணும்?

**Thiru:** Senior level-ல கேட்கவேண்டிய questions:

- Cross-service data தேவைப்படும் scenarios-க்கு API Composition போதுமா, இல்ல event-driven sync வேணுமா? Query frequency, latency requirements இதை தீர்மானிக்கும்.
- Multi-service transactions-க்கு Saga pattern implement பண்ணிருக்கோமா? Compensating actions சரியா design பண்ணிருக்கோமா?
- Team boundaries database boundaries-உடன் align ஆகுதா? (Conway's Law — organization structure, system architecture-ஐ reflect பண்ணும்)
- Polyglot persistence value கொடுக்குமா இந்த context-ல, இல்ல operational complexity-ஐ மட்டும் அதிகரிக்குமா?
- Data duplication (event-driven sync-ல) staleness risk-ஐ எப்படி handle பண்றோம்? Eventual consistency acceptable-ஆ இருக்கா?

---

## 8. Interview Deep-Dive Questions

**Q:** Database per Service pattern-ன் main benefit என்ன?
*Answer:* Independent deployability — ஒவ்வொரு service-ன் team-ம், தன் database schema-ஐ மற்ற services-ஐ break பண்ணாம freely change பண்ண முடியும். இது tight coupling-ஐ தவிர்த்து, teams autonomy-ஆ வேலை பண்ண உதவும்.

**Q:** Database per service இருந்தா, cross-service SQL JOIN எப்படி பண்றது?
*Answer:* நேரடியா SQL JOIN பண்ண முடியாது. இரண்டு approach — API Composition (application layer-ல results combine பண்றது) அல்லது event-driven data sync (ஒரு service, தேவையான data-ஐ events மூலம் subscribe பண்ணி local read-only copy வைத்திருப்பது).

**Q:** Multiple databases-ல transaction consistency எப்படி maintain பண்றீங்க?
*Answer:* Single ACID transaction சாத்தியம் இல்ல. Saga pattern use பண்ணணும் — ஒவ்வொரு step-ம் தன் own database-ல commit பண்ணும், ஏதாவது step fail ஆனா, முந்தைய steps-ஐ compensating actions மூலம் manually undo பண்ணணும்.

**Q:** Polyglot persistence என்றால் என்ன, அது எப்போ பயனுள்ளதாக இருக்கும்?
*Answer:* ஒவ்வொரு service-ம், அதன் data pattern-க்கு பொருத்தமான DB engine choose பண்றது — உதாரணமா relational data-க்கு PostgreSQL, document data-க்கு MongoDB. Data access patterns வேறுபடும் services-க்கு பயனுள்ளது, ஆனா operational complexity-ஐ கணக்கில் எடுத்துக்கொள்ளணும்.

---

## Quick Revision Summary

- Database per Service = each microservice owns a private database; other services access data only via API, never direct DB queries
- Solves tight coupling caused by shared databases — schema changes no longer break unrelated services
- Trade-off: cross-service SQL JOINs are no longer possible
- Two solutions: API Composition (combine data in application code) or event-driven sync (subscribe to events, keep a local copy)
- Multi-service transactions need the Saga pattern with compensating actions instead of single ACID transactions
- Polyglot persistence = each service can pick the DB engine that best fits its data, at the cost of operational complexity
- ECR Now: case-reporting-service and patient-service each own their database; data is fetched via REST API or synced via events, never joined directly
- Team/database boundaries should align with service boundaries for real autonomy

**Mahi:** Super Thiru, இப்போ Database per Service pattern கிளியர்-ஆ புரியுது.

**Thiru:** Correct Mahi. அடுத்த episode-க்கு போலாம்.

---
*End of Episode: Database per Service Pattern*
