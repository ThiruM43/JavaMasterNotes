# Java Interview Podcast — Episode: Git Branching Strategies
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, டீம்-ல நிறைய பேர் வேலை செய்யும்போது code குழப்பமாகாம இருக்க Git Branching ரொம்ப முக்கியம். எந்த strategy best-னு சொல்லுங்க.

**Thiru:** கண்டிப்பா Mahi. **Git Branching Strategy** [Developers code-ஐ எப்படி branch பண்ணி, merge பண்றாங்க-னு define பண்ற rules]. GitFlow, GitHub Flow, Trunk-Based Development னு நிறைய இருக்கு.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு Highway construction யோசிச்சுக்கோ.
- Main Highway தான் **Main Branch**.
- புதுசா ஒரு flyover கட்டுறாங்க-னா, பக்கத்துல ஒரு service road (Feature Branch) போட்டு, வேலை முடிஞ்சதும் Main Highway கூட சேர்ப்பாங்க (Merge).

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** GitFlow-ல 5 branches இருக்கும்.
1. `main` - Production ready code.
2. `develop` - Integration branch.
3. `feature/xyz` - New features.
4. `release/v1.0` - Preparing for release.
5. `hotfix/bug` - Urgent production fixes.

```bash
git checkout -b feature/login develop # Create feature from develop
git commit -m "Added login"
git checkout develop
git merge feature/login # Merge back to develop
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Strategy | Concept | Best For |
|--------|----------|----------|
| GitFlow | Strict, multiple branches (main, develop, release) | Large enterprise apps with scheduled releases |
| GitHub Flow | Simple, `main` + `feature` branches | Web apps with Continuous Deployment |
| Trunk-Based | Committing directly to `main` (trunk) often | Mature Agile teams, CI/CD, Microservices |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** "Git Rebase-க்கும் Merge-க்கும் என்ன வித்தியாசம்?"-னு கேட்பாங்க. Merge ஒரு புது commit create பண்ணி history-ஐ combine பண்ணும். Rebase வந்து உங்க commits-ஐ target branch-ஓட tip-ல அப்படியே எடுத்து வைக்கும், history clean-ஆ (linear) இருக்கும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Merge Conflicts தான் பெரிய தலைவலி. ரொம்ப நாளா feature branch-ஐ வச்சுக்கிட்டு, கடைசி நேரத்துல merge பண்ணா நிறைய conflicts வரும். அதனால அடிக்கடி develop/main-ல இருந்து pull பண்ணிக்கிட்டே இருக்கணும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க Feature Branch Workflow use பண்றோம். JIRA ticket number வச்சு branch create பண்ணுவோம் (e.g., `feature/ECR-123-FHIR-parser`). PR (Pull Request) raise பண்ணி, SonarQube pass ஆனதும் `main`-ல merge பண்ணிடுவோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Trunk-Based Development தான் modern CI/CD-க்கு பெஸ்ட். ஆனா அதுக்கு நல்ல automated test coverage இருக்கணும். Feature Flags (Toggles) use பண்ணி, half-finished code-ஐ கூட main-ல merge பண்ணலாம், ஆனா prod-ல hide ஆகி இருக்கும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Squash merge-னா என்ன?
*Answer:* Feature branch-ல இருக்குற 10 commits-ஐயும் ஒண்ணா சேர்த்து (squash) ஒரே commit-ஆ main branch-ல merge பண்றது. History ரொம்ப clean ஆ இருக்கும்.

**Q:** Hotfix branch எங்க இருந்து பிரிப்பீங்க?
*Answer:* Production-ல இருக்குற issue-ங்கறதால, `main` branch-ல இருந்து தான் பிரிப்போம். Fix பண்ணிட்டு `main` அண்ட் `develop` ரெண்டுலயும் merge பண்ணுவோம்.

---

## Quick Revision Summary

- GitFlow is strict, good for scheduled releases.
- GitHub Flow is lightweight, good for continuous deployment.
- Trunk-based development requires high test coverage and feature flags.
- Rebase keeps history linear; Merge creates a merge commit.
