# Java Interview Podcast — Episode: CI/CD Pipeline Basics
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, self-intro பண்ணும்போது "எங்க team CI/CD pipeline use பண்றோம்" nu சொல்றோம், ஆனா அது exact-ஆ எப்படி வேலை செய்யுதுனு தெளிவா தெரியலை. CI/CD என்றால் என்ன?

**Thiru:** **CI/CD** என்பது **Continuous Integration** மற்றும் **Continuous Delivery/Deployment**-ன் short form. **Continuous Integration (CI)** என்றால், developers frequently (நாள்தோறும், அல்லது ஒரு day-ல பல முறை) தங்க code changes-ஐ ஒரு shared repository-க்கு merge பண்ணி, ஒவ்வொரு merge-ஓடும் automatic-ஆ build மற்றும் tests run ஆகும். **Continuous Delivery/Deployment (CD)** என்றால், code, tests pass ஆன பிறகு, automatic-ஆ (அல்லது ஒரே ஒரு click-ல) production-க்கு deploy ஆகும் process.

**Mahi:** Manual-ஆ build பண்ணி, manual-ஆ deploy பண்ணலாமே, ஏன் இதற்கு pipeline வேணும்?

**Thiru:** Manual process-ல human error அதிகம், நேரமும் அதிகம் ஆகும். ஒரு developer தன் laptop-ல test பண்ணி "என் machine-ல வேலை செய்யுது" என்று சொன்னாலும், production environment வேற மாதிரி இருந்தா issue வரலாம். CI/CD pipeline இதையெல்லாம் **automate** பண்ணி, consistent-ஆ, fast-ஆ, reliable-ஆ code-ஐ production வரைக்கும் கொண்டு போகும்.

---

## 1. Real World Analogy

**Mahi:** Analogy சொல்லுங்க.

**Thiru:** ஒரு car manufacturing assembly line-ஐ நினைச்சுக்கோ. ஒவ்வொரு part வந்ததும், அது automatic-ஆ quality check-க்கு போகும் — engine correct-ஆ fit ஆகுதா, brake test pass ஆகுதா என்று. எல்லா checks-ம் pass ஆனா தான், அடுத்த stage-க்கு car போகும், கடைசியா showroom-க்கு (production) அனுப்பப்படும். ஒரு part fail ஆனா, அந்த car assembly line-லேயே நிறுத்தப்படும், showroom-க்கு போகாது.

CI/CD pipeline இதே மாதிரி — code ஒவ்வொரு "stage"-ஐயும் (build, test, quality check) pass பண்ணித்தான் production-க்கு போகும். ஒரு stage fail ஆனா, deployment நிறுத்தப்படும்.

---

## 2. CI vs CD — The Difference

**Mahi:** CI-க்கும் CD-க்கும் exact difference என்ன? இரண்டும் ஒண்ணு தானா?

**Thiru:** இல்ல, வேற வேற. **Continuous Integration (CI)** என்பது **build + test** stage வரைக்கும் — developer code push பண்ணதும், automatic-ஆ compile ஆகி, unit tests, integration tests run ஆகும். Goal — bugs-ஐ early-ஆ கண்டுபிடிக்கறது.

**Continuous Delivery** என்பது CI-க்கு அடுத்தபடி — tests pass ஆன பிறகு, code automatic-ஆ **deployable state**-ல தயார் ஆகி இருக்கும், ஆனா production-க்கு போக ஒரு **manual approval** தேவைப்படலாம்.

**Continuous Deployment** என்பது ஒரு step மேல போய், manual approval-ஐயும் தவிர்த்து, tests pass ஆனதும் **automatic-ஆவே** production-க்கு deploy ஆகிடும்.

| Stage | What happens | Human involvement |
|---|---|---|
| **Continuous Integration** | Build + run tests on every code push | None (fully automatic) |
| **Continuous Delivery** | Code is deployment-ready, staged for release | Manual approval before production push |
| **Continuous Deployment** | Every passing change goes straight to production | None (fully automatic) |

---

## 3. Typical Pipeline Stages

**Mahi:** ஒரு real CI/CD pipeline-ல என்னென்ன stages இருக்கும்?

**Thiru:** பொதுவா இந்த order-ல stages இருக்கும்:

1. **Source** — developer code push பண்ணும் (Git commit/push trigger பண்ணும்)
2. **Build** — code compile ஆகும் (Maven/Gradle build)
3. **Unit Tests** — individual components-க்கு tests run ஆகும்
4. **Code Quality Check** — static analysis tools (SonarQube போன்றவை) code smell, vulnerabilities check பண்ணும்
5. **Integration Tests** — multiple components ஒன்றாக சேர்ந்து சரியா வேலை செய்யுதான்னு check பண்ணும்
6. **Package/Containerize** — application-ஐ deployable artifact-ஆ (JAR, Docker image) build பண்ணும்
7. **Deploy to Staging** — production மாதிரியே இருக்கும் test environment-ல deploy பண்ணும்
8. **Deploy to Production** — final stage, live users-க்கு release ஆகும்

```
Typical CI/CD Pipeline Flow:

[Git Push] → [Build] → [Unit Tests] → [Code Quality] → [Integration Tests]
                                                                │
                                                                ▼
                                          [Package as Docker Image]
                                                                │
                                                                ▼
                                              [Deploy to Staging]
                                                                │
                                              (manual approval, if Continuous Delivery)
                                                                │
                                                                ▼
                                             [Deploy to Production]
```

---

## 4. Sample Pipeline Configuration

**Mahi:** Code-ல இது எப்படி configure பண்றாங்க?

**Thiru:** Jenkins, GitLab CI, GitHub Actions போன்ற tools use பண்றாங்க. உதாரணமா, GitHub Actions-ல ஒரு simple pipeline இப்படி இருக்கும்:

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Build with Maven
        run: mvn clean compile

      - name: Run unit tests
        run: mvn test

      - name: Build Docker image
        run: docker build -t case-reporting-service:${{ github.sha }} .

      - name: Deploy to staging
        run: ./deploy.sh staging
```

இது ஒவ்வொரு `main` branch push-லயும் automatic-ஆ trigger ஆகி, build, test, deploy — எல்லாத்தையும் pண்ணும்.

---

## 5. Edge Cases

**Mahi:** Interview-ல trap பண்ணும் edge case சொல்லுங்க.

**Thiru:** ஒரு classic trap — "Deployment fail ஆனா என்ன பண்றது?" இதற்கு **Rollback strategy** தேவை — ஒன்னு, previous stable version-க்கு automatic-ஆ revert பண்றது, அல்லது **Blue-Green Deployment** [production-ல இரண்டு identical environments வைத்திருந்து, ஒன்றில் புது version deploy பண்ணி, சரியா வேலை செய்யுதா check பண்ணி, traffic-ஐ switch பண்ணும் strategy] use பண்றது — புது version issue இருந்தா, traffic-ஐ பழைய environment-க்கே திரும்ப switch பண்ணிடலாம்.

இன்னொரு trap — "Continuous Deployment எல்லா teams-க்கும் நல்லதா?" இல்ல. Regulated industries-ல (healthcare, finance போன்றவை), compliance requirements காரணமா, production-க்கு போகும் முன்பு manual review/approval கட்டாயமா தேவைப்படலாம் — அப்படி இருந்தா **Continuous Delivery** தான் suitable, Continuous Deployment இல்ல.

---

## 6. ECR Now Production Experience

**Mahi:** நம்முடைய ECR Now project-ல CI/CD எப்படி set up பண்ணிருக்கோம்?

**Thiru:** ECR Now [Electronic Case Reporting Now — hospital EHR systems-லிருந்து disease reporting-ஐ CDC-க்கு automatic-ஆக அனுப்பும் Spring Boot microservice] healthcare domain-ஆ இருப்பதால், compliance requirements strict-ஆ இருக்கும். அதனால, நாங்க **Continuous Delivery** approach follow பண்றோம் — Continuous Deployment இல்ல.

Pipeline flow: developer code push பண்ணதும், automatic-ஆ build, unit tests, integration tests run ஆகும். FHIR document generation logic போன்ற critical parts-க்கு extra test coverage requirement இருக்கு. எல்லா tests pass ஆனா, staging environment-ல automatic-ஆ deploy ஆகும். Production-க்கு போக, ஒரு **manual approval gate** இருக்கு — ஏன்னா disease reporting logic-ல bug வந்தா, legally time-sensitive reports affect ஆகும், அதனால extra caution தேவை.

Rollback strategy-க்கு, ஒவ்வொரு deployment-ம் **versioned Docker image**-ஆ tag ஆகி இருக்கும் — issue வந்தா, previous stable image-க்கு fast-ஆ revert பண்ண முடியும்.

---

## 7. Senior/Architect Perspective

**Mahi:** Senior engineer இதை எப்படி approach பண்ணணும்?

**Thiru:** Senior level-ல கேட்கவேண்டிய questions:

- Pipeline-ல எந்த stage-ல fail ஆனா, developer-க்கு எவ்வளவு வேகமா feedback கிடைக்குது? (Fast feedback loop முக்கியம்)
- Test coverage போதுமா? Flaky tests [சில நேரம் pass, சில நேரம் fail ஆகும் unreliable tests] pipeline-ஐ unreliable-ஆ ஆக்குதா?
- Rollback strategy உறுதியா இருக்கா? Production issue வந்தா, எவ்வளவு வேகமா revert பண்ண முடியும்?
- Secrets (DB passwords, API keys) pipeline-ல எப்படி securely manage ஆகுது? (hardcode பண்ணக்கூடாது)
- Multiple microservices இருந்தா, ஒவ்வொரு service-க்கும் தனித்தனி pipeline இருக்கா, இல்ல shared pipeline-ஆ இருக்கா? Independent deployability-க்கு தனித்தனி pipeline தேவை.

---

## 8. Interview Deep-Dive Questions

**Q:** Continuous Delivery-க்கும் Continuous Deployment-க்கும் என்ன வித்தியாசம்?
*Answer:* இரண்டுமே tests pass ஆன பிறகு code-ஐ deployment-ready ஆக்கும். Continuous Delivery-ல production-க்கு போக manual approval தேவை. Continuous Deployment-ல, manual approval இல்லாமல் automatic-ஆவே production-க்கு deploy ஆகிடும்.

**Q:** CI pipeline-ல ஒரு test fail ஆனா என்ன நடக்கணும்?
*Answer:* Pipeline அந்த stage-லேயே stop ஆகணும், code merge/deploy ஆகக்கூடாது. Developer-க்கு உடனே notification போகணும் — இது தான் CI-ன் core purpose, bugs-ஐ production-க்கு போகும் முன்பே early-ஆ கண்டுபிடிக்கறது.

**Q:** Regulated industries (healthcare, finance)-ல Continuous Deployment பொதுவா use பண்ணுவாங்களா?
*Answer:* அரிதாகவே. Compliance requirements காரணமா, production-க்கு போகும் முன்பு manual review/approval தேவைப்படும் — அதனால Continuous Delivery தான் பெரும்பாலும் use பண்றாங்க, Continuous Deployment இல்ல.

**Q:** Deployment fail ஆனா rollback strategy எப்படி இருக்கணும்?
*Answer:* Versioned artifacts (Docker images, JAR versions) வைத்திருக்கணும், previous stable version-க்கு fast-ஆ revert பண்ண முடியும் மாதிரி. Blue-Green Deployment அல்லது Canary Deployment போன்ற strategies, issue-ஐ முழு user base-க்கும் போகாம limit பண்ணி, safe rollback-ஐ சாத்தியப்படுத்தும்.

---

## Quick Revision Summary

- CI (Continuous Integration) = automatic build + test on every code push, catches bugs early
- Continuous Delivery = code is always deployment-ready, but production push needs manual approval
- Continuous Deployment = every passing change goes straight to production, no manual gate
- Typical pipeline: Build → Unit Tests → Code Quality Check → Integration Tests → Package → Deploy to Staging → Deploy to Production
- Rollback strategies (versioned artifacts, Blue-Green Deployment) are essential for handling failed deployments
- Regulated industries (like healthcare) usually stick to Continuous Delivery, not Continuous Deployment, due to compliance needs
- ECR Now uses Continuous Delivery — automatic through staging, manual approval gate before production due to healthcare compliance
- Each microservice should ideally have its own independent pipeline to preserve independent deployability

**Mahi:** Super Thiru, இப்போ CI/CD pipeline-ன் stages கிளியர்-ஆ புரியுது.

**Thiru:** Correct Mahi. Self-intro & Project Architecture topics முழுசா முடிச்சாச்சு. அடுத்த category-க்கு போலாமா?

---
*End of Episode: CI/CD Pipeline Basics*
