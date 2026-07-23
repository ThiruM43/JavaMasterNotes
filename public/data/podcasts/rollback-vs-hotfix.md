# Java Interview Podcast — Episode: Rollback Strategy / Hotfix vs Full Deployment
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, இதுவரைக்கும் production issue-ஐ எப்படி diagnose பண்றதுன்னு பார்த்தோம். Root cause கண்டுபிடிச்ச பிறகு, fix-ஐ எப்படி production-க்கு கொண்டு போறது? "Rollback பண்ணலாமா, hotfix பண்ணலாமா" nu decision எடுக்கணுமே?

**Thiru:** சரியான கேள்வி Mahi, incident response-ன் கடைசி, மிக முக்கியமான step இது தான். **Rollback** என்றால், புது deployment-ஐ **undo** பண்ணி, முந்தைய stable version-க்கு திரும்ப போறது. **Hotfix** என்றால், root cause-க்கு ஒரு **targeted, minimal fix** எழுதி, அதை urgent-ஆ, fast-track process-ல production-க்கு deploy பண்றது. **Full deployment** என்றால் normal, complete release cycle-ல, எல்லா planned changes-உடன் deploy பண்றது.

**Mahi:** எப்போ rollback பண்ணணும், எப்போ hotfix பண்ணணும்?

**Thiru:** இது தான் key decision. Simple rule — **புது deployment தான் issue-ஐ ஏற்படுத்தி இருந்தா, rollback தான் fastest, safest option**. Issue, deployment-க்கு முன்பே இருந்திருந்தா (existing bug), அல்லது rollback சாத்தியமே இல்லாத scenario-ல (database schema change போன்றவை), hotfix தேவைப்படும்.

---

## 1. Real World Analogy

**Mahi:** Analogy சொல்லுங்க.

**Thiru:** ஒரு restaurant, தன் menu-ல ஒரு புது dish add பண்ணிருக்கு-னு வெச்சுக்கோ, அது customers-ஐ sick ஆக்கிடுச்சு. **Rollback** என்றால், உடனே அந்த dish-ஐ menu-லிருந்து எடுத்து, பழைய menu-க்கு திரும்ப போறது — fast, safe, ஏற்கனவே prove ஆன menu-க்கு போறது. **Hotfix** என்றால், அந்த dish-ஐ menu-லேயே வெச்சுக்கிட்டு, chef உடனே recipe-ல ஒரு specific ingredient-ஐ மாத்தி, "இது தான் problem"-னு தெரிஞ்சு, அதை மட்டும் fix பண்றது — dish continue ஆகும், ஆனா recipe fix ஆகிடும்.

Rollback fast ஆனா, "புது dish-ஐயே இழந்துடலாம்" (feature loss). Hotfix, feature-ஐ வைச்சுக்கிட்டே fix பண்ணும், ஆனா correct diagnosis தேவை, நேரமும் கொஞ்சம் அதிகமா ஆகும்.

---

## 2. Rollback — When and How

**Mahi:** Rollback எப்போ ideal option, எப்படி பண்றது?

**Thiru:** Rollback ideal-ஆ இருக்கும் scenarios:

- புது deployment-க்கு பிறகு உடனே issue வந்தா (timestamp correlation clear-ஆ காட்டும்)
- Root cause இன்னும் clear-ஆ தெரியாம இருந்தா, ஆனா fast-ஆ system-ஐ stable ஆக்கணும்னா
- Database schema change இல்லாத deployment-ஆ இருந்தா (backward-compatible rollback சாத்தியம்)

```bash
# Rollback using versioned Docker images (as discussed in CI/CD episode)
kubectl rollout undo deployment/case-reporting-service

# Or, rollback to a specific previous version
kubectl set image deployment/case-reporting-service \
    case-reporting-service=case-reporting-service:v1.42.0
```

**Blue-Green Deployment** [production-ல இரண்டு identical environments (Blue, Green) வைத்திருந்து, ஒன்றில் புது version deploy பண்ணி, traffic-ஐ switch பண்ணும் strategy] use பண்ணிருந்தா, rollback இன்னும் வேகமா நடக்கும் — traffic-ஐ பழைய environment-க்கே திரும்ப switch பண்ணிடலாம், code redeploy பண்ண தேவையே இல்ல.

```
Blue-Green Rollback:

Before rollback:  [Load Balancer] → [Green environment - v2.0 (buggy)]
                                     [Blue environment - v1.9 (stable, idle)]

After rollback:   [Load Balancer] → [Blue environment - v1.9 (stable)] ← instant switch
                                     [Green environment - v2.0 (idle, being fixed)]
```

---

## 3. Hotfix — When and How

**Mahi:** Hotfix எப்போ தேவை, rollback சாத்தியம் இல்லாத scenario என்ன?

**Thiru:** Hotfix தேவைப்படும் scenarios:

- **Database migration** ஏற்கனவே apply ஆகிடுச்சு, rollback பண்ணா data inconsistency வரும் (உதாரணமா, ஒரு column drop பண்ணப்பட்டிருந்தா, பழைய code அந்த column expect பண்ணும், ஆனா column இல்ல)
- Issue, புது deployment-க்கு relate ஆகாத, long-standing bug-ஆ இருந்தா (rollback பண்ணினாலும் bug தொடரும்)
- Critical business requirement-க்கு, feature-ஐ இழக்காம fix பண்ணணும் — உதாரணமா, healthcare context-ல, case reporting feature-ஐ rollback பண்ணா, legally required reporting நின்னுடும்

```java
// Hotfix example - targeted fix for a specific bug, minimal change
// BEFORE (buggy) - no timeout, causing thread pool exhaustion
public String submit(TriggerEvent event) {
    return restTemplate.postForObject(cdcUrl, event, String.class);
}

// AFTER (hotfix) - minimal, targeted change, nothing else touched
public String submit(TriggerEvent event) {
    RequestConfig config = RequestConfig.custom()
        .setConnectTimeout(3000)
        .setSocketTimeout(5000)
        .build();
    return restTemplate.postForObject(cdcUrl, event, String.class); // with timeout now applied
}
```

Hotfix-ன் core principle — **minimal, targeted change**. Hotfix-ல, unrelated refactoring, unrelated feature additions சேர்க்கக்கூடாது — risk-ஐ குறைவா வைக்கணும், ஏன்னா இது urgent, fast-tracked deployment.

---

## 4. Comparison Table

| Aspect | Rollback | Hotfix | Full Deployment |
|---|---|---|---|
| **Speed** | Fastest (minutes) | Fast (needs a targeted code fix + test + deploy) | Slowest (full release cycle) |
| **Risk** | Low (reverting to known-stable state) | Moderate (new code, but minimal scope) | Higher (bundles many changes) |
| **When used** | New deployment caused the issue | Rollback isn't possible/safe, or bug predates deployment | Planned, non-urgent releases |
| **Testing rigor** | None needed (already tested previously) | Focused testing on the specific fix | Full regression testing |
| **Feature impact** | Loses the new feature/change temporarily | Feature stays, bug is patched | N/A (this IS the feature release) |

---

## 5. Edge Cases

**Mahi:** Interview-ல trap பண்ணும் edge case சொல்லுங்க.

**Thiru:** ஒரு classic trap — "Database schema change இருந்தா rollback எப்போவுமே சாத்தியம் இல்லையா?" Depend பண்ணும். **Backward-compatible migrations** [புது column add பண்றது போன்ற changes, பழைய code-ஐ break பண்ணாத மாதிரி இருக்கும்] பண்ணிருந்தா, rollback இன்னும் சாத்தியம் — column இருந்தாலும், பழைய code அதை use பண்ணாம வேலை செய்யும். ஆனா **column drop, rename, அல்லது data transformation** போன்ற **breaking changes** பண்ணிருந்தா, rollback சாத்தியமே இல்ல — hotfix தான் ஒரே வழி.

இன்னொரு trap — "Hotfix-ல full testing தேவையில்லையா, urgent-ஆ இருக்கே?" Full regression testing தேவையில்ல, ஆனா **hotfix specific-ஆ affect பண்ணும் area-க்கு focused testing** கட்டாயம் தேவை. "Urgent" என்பது testing-ஐ skip பண்ணுறதுக்கு reason இல்ல — quality bar குறைக்காம, scope-ஐ மட்டும் narrow பண்ணணும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்முடைய ECR Now project-ல rollback vs hotfix decision எடுத்த real scenario சொல்லுங்க.

**Thiru:** ECR Now [Electronic Case Reporting Now — hospital EHR systems-லிருந்து disease reporting-ஐ CDC-க்கு automatic-ஆக அனுப்பும் Spring Boot microservice] system-ல, **Thread Starvation episode-ல discuss பண்ணின incident** — CDC timeout missing-ஆ இருந்ததால் thread pool exhaustion நடந்தது — அது ஒரு **long-standing bug** ஆ இருந்தது, recent deployment காரணமா வரலை (traffic spike காரணமா exposed ஆனது). அதனால rollback பண்ணி பயன் இல்ல — bug அப்படியே இருக்கும். இதற்கு **hotfix** தான் approach — timeout add பண்ணி, targeted fix-ஆ, fast-track review-உடன் deploy பண்ணோம்.

வேறு ஒரு scenario-ல, ஒரு புது deployment-க்கு பிறகு, immediately case report submission failure rate spike ஆனது. Timestamp correlation clear-ஆ காட்டிச்சு — deployment time-உடன் exact-ஆ match ஆச்சு. Database changes எதுவும் அந்த deployment-ல இல்லாததால், உடனே **rollback** பண்ணோம் — 5 நிமிடத்துக்குள்ள system stable ஆகிடுச்சு. அப்புறம் calm-ஆ, root cause investigate பண்ணி, correct fix-ஐ next planned release-ல சேர்த்தோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Senior engineer இதை எப்படி approach பண்ணணும்?

**Thiru:** Senior level-ல கேட்கவேண்டிய questions:

- Deployment strategy (Blue-Green, Canary) rollback-ஐ fast-ஆ, low-risk-ஆ ஆக்குமா? Design level-லேயே இதை plan பண்ணியிருக்கோமா?
- Database migrations எப்போவும் backward-compatible-ஆ design பண்ணப்படுதா, rollback option-ஐ preserve பண்ண?
- Hotfix process, normal release process-ல இருந்து வேறா, fast-track ஆனாலும் required quality gates (code review, targeted tests) இருக்கா?
- Rollback vs Hotfix decision எடுக்க, team-க்கு clear criteria/runbook இருக்கா, incident நேரத்தில் confusion இல்லாம act பண்ண?
- Rollback பண்ணின பிறகு, "why did this happen" root cause analysis follow-up பண்ணப்படுதா, அதே issue திரும்ப வராம இருக்க?

---

## 8. Interview Deep-Dive Questions

**Q:** Rollback-க்கும் Hotfix-க்கும் decision எடுக்க முதல் question என்ன கேட்பீங்க?
*Answer:* "இந்த issue, recent deployment-க்கு பிறகு தான் வந்ததா?" Yes-ன்னா, rollback fastest, safest option. No-ன்னா (long-standing bug), அல்லது rollback சாத்தியமே இல்லாத scenario-ன்னா (breaking DB change), hotfix தேவை.

**Q:** எப்போ rollback சாத்தியமே இல்ல?
*Answer:* Deployment-ல breaking database changes இருந்தா (column drop, rename, data transformation) — பழைய code, புது schema-உடன் compatible-ஆ இல்லாம போகும். Backward-compatible migrations (column add பண்றது) இருந்தா, rollback இன்னும் சாத்தியம்.

**Q:** Hotfix deploy பண்றதுக்கு முன்பு testing skip பண்ணலாமா, urgent-ஆ இருக்கே?
*Answer:* Full regression testing skip பண்ணலாம், ஆனா hotfix specific-ஆ affect பண்ணும் area-க்கு focused testing கட்டாயம் தேவை. Urgency, quality bar குறைக்க காரணம் இல்ல, scope-ஐ narrow பண்ணி வேகமா test பண்ணணும்.

**Q:** Blue-Green Deployment, rollback-ஐ எப்படி fast ஆக்கும்?
*Answer:* Blue-Green-ல, இரண்டு identical environments இருக்கும் — புது version ஒன்றில் deploy ஆகி, traffic switch ஆகும். Issue வந்தா, traffic-ஐ பழைய environment-க்கே திரும்ப switch பண்ணிடலாம் — code redeploy பண்ண தேவையே இல்ல, இது seconds-ல நடக்கும்.

---

## Quick Revision Summary

- Rollback = revert to the previous stable version; fastest and safest when a NEW deployment caused the issue
- Hotfix = minimal, targeted code fix, fast-tracked to production; needed when rollback isn't possible or the bug predates the deployment
- Key decision question: "Did this start right after the latest deployment?" — Yes → rollback; No → hotfix
- Rollback is not possible after breaking database changes (column drop/rename); backward-compatible migrations preserve rollback capability
- Blue-Green Deployment makes rollback near-instant by switching traffic between two live environments
- Hotfixes still need focused testing on the affected area — urgency doesn't excuse skipping quality checks
- Full deployment = the normal, planned release cycle with full regression testing, used for non-urgent changes
- ECR Now: a long-standing timeout bug exposed by traffic spike needed a hotfix; a regression right after a fresh deployment was resolved via rollback in minutes

**Mahi:** Super Thiru, இப்போ rollback-ஐயும் hotfix-ஐயும் எப்படி தேர்வு பண்றதுனு கிளியர்-ஆ புரியுது. Production Issue Handling category முழுசா முடிச்சாச்சு!

**Thiru:** Correct Mahi. அடுத்த category-க்கு போலாமா?

---
*End of Episode: Rollback Strategy / Hotfix vs Full Deployment*
