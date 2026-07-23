# Java Interview Podcast — Episode: CPU Spike vs Memory Leak Diagnosis
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, இதுவரைக்கும் thread dump, heap dump, deadlock, GC pause, OOM தனித்தனியா பார்த்தோம். Production-ல ஒரு alert வந்தா, "இது CPU spike-ஆ, இல்ல memory leak-ஆ" என்று முதலில் எப்படி தீர்மானிப்பீங்க?

**Thiru:** நல்ல கேள்வி Mahi, இது தான் real production incident-ல முதல் **triage step** [problem-ன் exact category-ஐ வேகமா identify பண்ணும் process]. இரண்டுமே "application slow ஆகி இருக்கு" என்று தோன்றும், ஆனா root cause, symptoms, மற்றும் fix approach முற்றிலும் வேற வேற. இதை குழப்பிக்கிட்டு தப்பான tool-ஐ கவனிச்சா, நேரம் வீணாகும்.

**Mahi:** முதல் step என்ன, incident வந்த உடனே?

**Thiru:** முதல் step — **monitoring dashboard பார்த்து, CPU usage graph-ம், Memory usage graph-ம் compare பண்றது**. இதுவே இரண்டையும் வேறுபடுத்த முதல் clue கொடுக்கும்.

---

## 1. Real World Analogy

**Mahi:** Analogy சொல்லுங்க.

**Thiru:** ஒரு factory-ஐ நினைச்சுக்கோ. **CPU spike** என்பது, machines அதிக வேகமா, அதிக load-ஆ, தொடர்ந்து ஓடிக்கிட்டே இருப்பது மாதிரி — engines heat ஆகி, smoke வருது, ஆனா factory floor-ல space பிரச்சனை இல்ல. **Memory leak** என்பது, factory floor-ல, use பண்ணாத boxes (unused objects) gradual-ஆ குவிஞ்சிட்டே, ஒரு நாள் floor space முழுசும் நிறைஞ்சு, வேலையே பண்ண முடியாம போவது மாதிரி — machines fast-ஆ ஓடலைனாலும், space இல்லாம stuck ஆகும்.

இரண்டு scenario-லயும் "factory வேலை நிக்கிடுச்சு" என்பது ஒரே symptom-ஆ தெரியும், ஆனா காரணம் completely வேற.

---

## 2. Key Symptom Differences

**Mahi:** Symptoms எப்படி வேறுபடும்?

**Thiru:** இதை table-ல பார்ப்போம் — இது தான் core triage knowledge.

| Symptom | CPU Spike | Memory Leak |
|---|---|---|
| **CPU usage** | Very high (80-100%) | Usually normal, unless GC is thrashing |
| **Memory usage** | Usually stable | Steadily increasing over time, never drops back |
| **Response time** | Slow, but somewhat proportional to CPU load | Gets progressively worse over hours/days |
| **Pattern over time** | Can spike suddenly and recover | Gradual, monotonic increase — classic "staircase" pattern |
| **Fixed by restart?** | Temporarily, but recurs if root cause is CPU-bound logic | Yes, temporarily — memory resets, then grows again |
| **First diagnostic tool** | Thread dump (multiple times) | Heap dump + memory usage trend |

**Mahi:** "Staircase pattern" nu சொன்னீங்களே, அது என்ன?

**Thiru:** Memory usage graph-ஐ பார்த்தா, ஒவ்வொரு GC cycle-க்கு பிறகும் memory கொஞ்சம் குறையும், ஆனா **previous baseline-க்கு திரும்ப வராது** — ஒவ்வொரு cycle-க்கும் baseline இன்னும் கொஞ்சம் ஏறிக்கிட்டே இருக்கும். Graph-ல இது ஒரு "staircase" (படிக்கட்டு) மாதிரி தெரியும் — இதுவே classic memory leak visual signature.

```
Memory Leak Pattern (conceptual graph):

Memory
  │           ___
  │        __|   |___
  │     __|          |___
  │  __|                 |___     ← baseline keeps rising after each GC
  │_|                        |__
  └─────────────────────────────► Time
```

---

## 3. Diagnosing CPU Spike — Step by Step

**Mahi:** CPU spike-ஐ எப்படி step-by-step diagnose பண்றது?

**Thiru:** Process இப்படி இருக்கும்:

**Step 1** — OS level-ல, எந்த process அதிக CPU எடுக்குது-ன்னு confirm பண்றது:

```bash
top -H -p <PID>   # shows individual threads consuming CPU within the Java process
```

**Step 2** — அந்த high-CPU thread ID-ஐ **hexadecimal**-ஆ convert பண்றது (thread dumps hex format-ல thread IDs காட்டும்):

```bash
printf "%x\n" <thread_id>
```

**Step 3** — thread dump எடுத்து, அந்த hex ID-ஐ correspond பண்ற thread-ஐ கண்டுபிடிக்கறது:

```bash
jstack <PID> > threaddump.txt
grep -A 20 "nid=0x<hex_id>" threaddump.txt
```

இது exactly எந்த code line, எந்த method, CPU-ஐ அதிகமா consume பண்ணுதுன்னு காட்டும் — உதாரணமா, ஒரு inefficient loop, ஒரு regex catastrophic backtracking, அல்லது infinite loop.

```
"batch-processor-3" #52 RUNNABLE
        at com.ecrnow.util.FhirValidator.validatePattern(FhirValidator.java:112)
        at com.ecrnow.util.FhirValidator.validate(FhirValidator.java:45)
        # This thread is stuck here consuming 95% CPU — likely inefficient regex or loop
```

---

## 4. Diagnosing Memory Leak — Step by Step

**Mahi:** Memory leak-ஐ எப்படி step-by-step diagnose பண்றது?

**Thiru:** Process இது:

**Step 1** — Monitoring tool-ல memory usage trend-ஐ **days/weeks** level-ல பார்த்து, staircase pattern இருக்கானு confirm பண்றது.

**Step 2** — Heap dump எடுக்கறது (`-XX:+HeapDumpOnOutOfMemoryError` அல்லது manual `jmap`).

**Step 3** — Eclipse MAT-ல Histogram பார்த்து, expected-ஐ விட அதிகமா instances இருக்கும் object type கண்டுபிடிக்கறது (இது previous Heap Dump episode-ல detail-ஆ பார்த்தோம்).

**Step 4** — "Merge Shortest Paths to GC Roots" மூலம், அந்த objects-ஐ யார் reference பண்ணி வைச்சிருக்கு-ன்னு trace பண்றது.

இந்த முழு process-ன் key difference — CPU spike-க்கு **thread dump** primary tool, memory leak-க்கு **heap dump** primary tool. இரண்டையும் குழப்பாம, சரியான tool-ஐ முதலில் use பண்றது தான் fast diagnosis-க்கு key.

---

## 5. When Both Happen Together

**Mahi:** இரண்டும் ஒரே நேரத்தில் நடக்குமா? அது confuse பண்ணுமா?

**Thiru:** ஆமா, real production-ல, இது ஒரு classic trap. Memory leak severe-ஆ இருந்தா, Old Generation frequently full ஆகி, **Full GC repeatedly trigger** ஆகும் — GC ஒரு CPU-intensive operation, அதனால memory leak, **secondary-ஆ CPU spike-ஐயும் ஏற்படுத்தும்**. இதை "CPU spike" மட்டும்-ன்னு நினைச்சு, thread dump மட்டும் பார்த்தா, root cause (memory leak) miss ஆகிடும்.

**Correct approach** — CPU spike இருந்தா, first check — **thread dump-ல GC threads அதிகமா active-ஆ இருக்கானு பார்க்கறது**. GC threads தொடர்ந்து busy-ஆ இருந்தா, அது real memory leak-ன் side-effect-ஆ இருக்கலாம், pure CPU-bound bug இல்ல.

```
"G1 Young RemSet Sampling" #15 RUNNABLE  <- if GC-related threads dominate the dump repeatedly,
"G1 Concurrent Refinement Thread#0" #16 RUNNABLE  <- suspect memory leak first, not just CPU-bound code
```

---

## 6. Edge Cases

**Mahi:** Interview-ல trap பண்ணும் edge case சொல்லுங்க.

**Thiru:** ஒரு classic trap — "High CPU usage எப்போவும் bad-ஆ?" இல்ல. Batch job அல்லது data processing task legitimate-ஆ CPU-intensive-ஆ இருக்கலாம் — அது expected behavior. Problem என்பது, **unexpected-ஆ** CPU spike நடக்கும்போது, அல்லது user-facing request handling threads-ல CPU spike நடக்கும்போது.

இன்னொரு trap — "Restart பண்ணி response time சரியாகிடுச்சு, அப்போ problem போச்சா?" இரண்டு scenario-லயும் (CPU spike, memory leak) restart temporary-ஆ சரி பண்ணிடும் — ஆனா root cause fix ஆகலைனா, problem திரும்பவும் வரும். "Restart fixed it" என்பது diagnosis இல்ல, அது symptom management மட்டும் — root cause கண்டுபிடிக்கணும்.

---

## 7. ECR Now Production Experience

**Mahi:** நம்முடைய ECR Now project-ல இந்த இரண்டு scenario-க்கும் real example சொல்லுங்க.

**Thiru:** **CPU spike scenario** — ஒரு FHIR validation logic-ல, ஒரு **regex pattern catastrophic backtracking** [poorly designed regex, specific input-க்கு exponentially அதிக time எடுக்கும் நிலை] ஏற்படுத்திருச்சு, ஒரு specific malformed input வந்தா. CPU 100% ஆகிடுச்சு, ஒரே ஒரு thread stuck ஆகி. `top -H` மூலம் exact thread கண்டுபிடிச்சு, thread dump-ல அந்த regex line-ல stuck-ஆ இருந்ததை பார்த்து, root cause கண்டுபிடிச்சோம். Fix — regex-ஐ optimize பண்றது.

**Memory leak scenario** — முந்தைய episode-ல பார்த்த மாதிரி, IMAP polling module-ல static list unbounded-ஆ grow ஆனது. இதுல முதலில், monitoring dashboard-ல memory usage staircase pattern-ஆ ஏறிக்கிட்டே இருந்ததை கவனிச்சோம் — CPU usage normal-ஆவே இருந்துச்சு. இது தான் "இது CPU இல்ல, memory problem" என்று உடனே direction கொடுத்தது, நேரடியா heap dump-க்கு போனோம்.

இரண்டையும் compare பண்ணா — முதல் case-ல CPU dashboard spike காட்டிச்சு, memory stable-ஆ இருந்துச்சு → thread dump direction. இரண்டாம் case-ல memory dashboard staircase காட்டிச்சு, CPU stable-ஆ இருந்துச்சு → heap dump direction.

---

## 8. Senior/Architect Perspective

**Mahi:** Senior engineer இதை எப்படி approach பண்ணணும்?

**Thiru:** Senior level-ல கேட்கவேண்டிய questions:

- Monitoring dashboards-ல CPU, Memory, GC frequency — மூணுமே ஒரே view-ல correlate பண்ணி பார்க்க முடியுமா? (APM tools இதற்கு உதவும், அடுத்த episode-ல பார்க்கலாம்)
- Incident response runbook இருக்கா — "CPU high-ஆ இருந்தா இதை செய், memory ஏறிக்கிட்டே இருந்தா அதை செய்" என்று clear steps?
- Automated alerting, threshold cross ஆனதும் (memory baseline அதிகரிச்சிட்டே இருந்தா) proactive-ஆ notify பண்ணுமா, issue critical ஆவதற்கு முன்பே?
- Load testing-ல, இந்த இரண்டு patterns-ஐயும் simulate பண்ணி, production-க்கு போவதற்கு முன்பே கண்டுபிடிக்க முடியுமா?
- Team-க்கு, thread dump vs heap dump எப்போ எடுக்கணும் என்ற clarity இருக்கா, incident நேரத்தில் guess பண்ணாம வேகமா act பண்ண முடியுமா?

---

## 9. Interview Deep-Dive Questions

**Q:** CPU spike-க்கும் Memory leak-க்கும் symptom level-ல முதல் வித்தியாசம் என்ன?
*Answer:* CPU spike-ல CPU usage dashboard-ல உடனே high-ஆ (80-100%) தெரியும், memory stable-ஆ இருக்கும். Memory leak-ல memory usage gradual-ஆ, staircase pattern-ல ஏறிக்கிட்டே இருக்கும், CPU usually normal-ஆவே இருக்கும் (severe leak இல்லாதவரை).

**Q:** High CPU thread-ஐ எப்படி exact-ஆ கண்டுபிடிப்பீங்க?
*Answer:* `top -H -p <PID>` மூலம் OS level-ல high-CPU thread ID கண்டுபிடிச்சு, அதை hex-ஆ convert பண்ணி (`printf "%x\n"`), thread dump-ல அதே hex nid உள்ள thread-ஐ கண்டுபிடிக்கணும் — அது exact stack trace, exact code line காட்டும்.

**Q:** Memory leak, CPU spike-ஐயும் ஏற்படுத்த முடியுமா?
*Answer:* ஆமா. Memory leak severe-ஆ இருந்தா, Old Generation frequently full ஆகி, Full GC repeatedly trigger ஆகும் — GC ஒரு CPU-intensive process, அதனால memory leak indirectly CPU spike-ஐயும் காட்டும். Thread dump-ல GC-related threads dominant-ஆ இருந்தா, இதை suspect பண்ணணும்.

**Q:** Restart பண்ணி problem "fix" ஆகிடுச்சுன்னா, அது real fix-ஆ?
*Answer:* இல்ல. Restart, symptom-ஐ temporary-ஆ clear பண்ணும், ஆனா root cause (memory leak, inefficient code) fix பண்ணலைனா, problem recur ஆகும். Diagnosis (thread dump/heap dump analysis) மூலம் root cause கண்டுபிடிச்சு fix பண்றது தான் permanent solution.

---

## Quick Revision Summary

- CPU spike: high CPU usage, stable memory — diagnose with `top -H` + thread dump
- Memory leak: gradual "staircase" memory growth, usually stable CPU — diagnose with monitoring trend + heap dump
- Key tool distinction: thread dump for CPU issues, heap dump for memory issues
- Severe memory leaks can cause secondary CPU spikes via frequent Full GC — check for GC-heavy threads in the dump before assuming pure CPU-bound code
- Process for CPU spike: `top -H -p <PID>` → convert thread ID to hex → grep thread dump for that hex nid
- Process for memory leak: confirm staircase pattern on dashboard → heap dump → Eclipse MAT histogram → trace GC roots
- Restart masks symptoms temporarily in both cases — it is not a diagnosis or a fix
- ECR Now: a catastrophic-backtracking regex caused a pure CPU spike (found via thread dump); an unbounded static list caused a memory leak (found via dashboard trend + heap dump)

**Mahi:** Super Thiru, இப்போ CPU spike-ஐயும் memory leak-ஐயும் எப்படி வேறுபடுத்தி diagnose பண்றதுனு கிளியர்-ஆ புரியுது.

**Thiru:** Correct Mahi. அடுத்த episode-க்கு போலாம்.

---
*End of Episode: CPU Spike vs Memory Leak Diagnosis*
