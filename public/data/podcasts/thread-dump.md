# Java Interview Podcast — Episode: Thread Dump (jstack)
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, production server hang ஆகிடுச்சுன்னா, senior engineers முதலில் "thread dump எடு" nu சொல்றாங்க. இது என்ன, எப்படி உதவும்?

**Thiru:** **Thread dump** என்பது ஒரு specific moment-ல, JVM-க்குள்ள run ஆகிட்டிருக்கும் **எல்லா threads-ன் snapshot** [அந்த நேரத்தில் ஒவ்வொரு thread என்ன செய்துகிட்டிருக்கு, என்ன state-ல இருக்கு என்பதை காட்டும் ஒரு report]. இதுல ஒவ்வொரு thread-க்கும் — அதன் state (RUNNABLE, BLOCKED, WAITING), அது எந்த method-ல இருக்கு, **stack trace** [method calls ஒன்றை ஒன்று call பண்ணி, current point வரைக்கும் வந்த path] என்ன — எல்லாம் தெரியும்.

**Mahi:** Server hang ஆகிடுச்சுன்னா, thread dump எப்படி பிரச்சனையை கண்டுபிடிக்க உதவும்?

**Thiru:** Server "hang" ஆனா, அர்த்தம் — requests process ஆகாம stuck ஆகி இருக்கு. Thread dump எடுத்தா, எந்த threads stuck ஆகி இருக்கு, என்ன method-ல stuck ஆகி இருக்கு, ஒரு thread இன்னொரு thread-ஐ block பண்றதா என்பது எல்லாம் தெரியும் — இதுவே root cause கண்டுபிடிக்க முதல் step.

---

## 1. Real World Analogy

**Mahi:** Analogy சொல்லுங்க.

**Thiru:** ஒரு traffic jam-ஐ நினைச்சுக்கோ. ஒரு helicopter மேலிருந்து photo எடுத்தா, அந்த ஒரே நிமிடத்தில் ஒவ்வொரு car எங்க நிக்குது, எந்த direction-ல முகம் திருப்பியிருக்கு, ஏதாவது accident block பண்றதா என்பது தெரியும். Thread dump இதே மாதிரி — JVM-ன் ஒரு "helicopter photo", அந்த moment-ல ஒவ்வொரு thread எங்க stuck-ஆ இருக்கு என்பதை காட்டும்.

---

## 2. How to Take a Thread Dump

**Mahi:** Thread dump எப்படி எடுப்பது?

**Thiru:** Java-ல பல வழிகள் இருக்கு, `jstack` தான் மிகவும் common tool.

```bash
# Find the process ID (PID) of your Java application
jps -l

# Take a thread dump using jstack
jstack <PID> > threaddump.txt

# Alternative: send SIGQUIT signal (Linux/Mac) - dump goes to stdout/log file
kill -3 <PID>
```

Production-ல, ஒரு issue நடக்கும்போது, **ஒரே dump மட்டும் எடுக்காம, 3-4 dumps சில seconds interval-ல** எடுக்கணும் — ஒரு single snapshot-ல ஒரு thread stuck-ஆ தெரியலாம், ஆனா multiple dumps-ல அதே thread அதே place-ல தொடர்ந்து இருந்தா, அது real problem-ன்னு confirm பண்ணலாம்.

```bash
for i in 1 2 3 4; do
  jstack <PID> > threaddump_$i.txt
  sleep 10
done
```

---

## 3. Reading a Thread Dump — Thread States

**Mahi:** Thread dump-ல output எப்படி இருக்கும், எப்படி படிக்கறது?

**Thiru:** ஒவ்வொரு thread entry-ம் இப்படி இருக்கும்:

```
"http-nio-8080-exec-5" #45 daemon prio=5 os_prio=0 tid=0x00007f8a1c00d000 nid=0x4a2 waiting on condition [0x00007f8a08bfe000]
   java.lang.Thread.State: BLOCKED (on object monitor)
        at com.ecrnow.service.CaseReportService.submitReport(CaseReportService.java:47)
        - waiting to lock <0x00000006c1234567> (a com.ecrnow.service.CdcSubmissionClient)
        at com.ecrnow.controller.CaseReportController.submit(CaseReportController.java:23)
```

இதுல முக்கிய thread states:

- **RUNNABLE** — thread actively CPU-ல execute ஆகிட்டிருக்கு
- **BLOCKED** — thread ஒரு **lock** [synchronized block/method access பண்ண தேவைப்படும் permission] கிடைக்க wait பண்றது, வேற thread அந்த lock வைச்சிருக்கு
- **WAITING** — thread indefinite-ஆ wait பண்றது (உதாரணமா `wait()`, `join()` call பண்ணி), யாராவது notify பண்ணும் வரைக்கும்
- **TIMED_WAITING** — thread ஒரு குறிப்பிட்ட time வரைக்கும் wait பண்றது (உதாரணமா `sleep(5000)`)

BLOCKED state-ல அதிக threads இருந்தா, அது **lock contention** [பல threads ஒரே lock-க்காக போட்டி போடும் நிலை] problem-ன்னு signal.

---

## 4. Real Example — Finding a Stuck Thread

**Mahi:** Real production scenario-ல எப்படி use ஆகும் காட்டுங்க.

**Thiru:** Case Reporting Service hang ஆகிடுச்சுன்னு வெச்சுக்கோ. Thread dump எடுத்தா, இப்படி பல threads BLOCKED state-ல இருக்கும்:

```
"http-nio-8080-exec-1" BLOCKED
        at com.ecrnow.service.CdcSubmissionClient.submit(CdcSubmissionClient.java:89)
        - waiting to lock <0x00000006c1234567> (a java.lang.Object)

"http-nio-8080-exec-2" BLOCKED
        at com.ecrnow.service.CdcSubmissionClient.submit(CdcSubmissionClient.java:89)
        - waiting to lock <0x00000006c1234567> (a java.lang.Object)

"http-nio-8080-exec-3" RUNNABLE
        at com.ecrnow.service.CdcSubmissionClient.submit(CdcSubmissionClient.java:85)
        - locked <0x00000006c1234567> (a java.lang.Object)
        at java.net.SocketInputStream.socketRead0(Native Method)
```

இதை படிச்சா தெரியுது — thread `exec-3`, lock `0x00000006c1234567`-ஐ hold பண்ணிக்கிட்டு, ஒரு network call-ல (`socketRead0`) stuck ஆகி இருக்கு. மற்ற threads (`exec-1`, `exec-2`) அதே lock-க்காக wait பண்ணிக்கிட்டு இருக்கு. Root cause — CDC server slow-ஆ respond பண்றது, அது lock-ஐ hold பண்ணும் thread-ஐ stuck பண்ணுது, அதனால மற்ற requests-ம் block ஆகுது.

---

## 5. Edge Cases

**Mahi:** Interview-ல trap பண்ணும் edge case சொல்லுங்க.

**Thiru:** ஒரு classic trap — "Thread dump எடுக்கறது production-ஐ affect பண்ணுமா?" `jstack` ஒரு lightweight operation, application-ஐ restart பண்ண தேவையில்ல, milliseconds-ல complete ஆகிடும். ஆனா, high-load production system-ல, jstack எடுக்கும்போது ஒரு **brief pause** [very short stop-the-world pause] நடக்கலாம் — impact minimal தான், ஆனா அவசியம் இல்லாம பலமுறை எடுக்கக்கூடாது.

இன்னொரு trap — "ஒரே ஒரு thread dump போதுமா root cause கண்டுபிடிக்க?" இல்ல. ஏற்கனவே சொன்ன மாதிரி, single dump-ல ஒரு thread stuck-ஆ தெரியலாம், ஆனா அது temporary-ஆ இருக்கலாம். Multiple dumps (3-4, சில seconds gap-ல) எடுத்து, அதே thread அதே place-ல தொடர்ந்து stuck-ஆ இருக்கானு compare பண்ணித்தான் confirm பண்ணணும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்முடைய ECR Now project-ல thread dump use பண்ணின real scenario சொல்லுங்க.

**Thiru:** ECR Now [Electronic Case Reporting Now — hospital EHR systems-லிருந்து disease reporting-ஐ CDC-க்கு automatic-ஆக அனுப்பும் Spring Boot microservice] system-ல, ஒரு முறை peak hours-ல response time suddenly spike ஆகி, requests hang ஆகும் மாதிரி தெரிஞ்சது. Thread dump எடுத்தா, பல threads `CdcSubmissionClient`-ல BLOCKED state-ல இருந்தது — CDC server-க்கு network call **timeout configure பண்ணாம** இருந்ததால், ஒரு slow CDC response, thread-ஐ indefinite-ஆ hold பண்ணிக்கிட்டு இருந்துச்சு.

இது discover ஆனதும், fix — network call-க்கு explicit **timeout** add பண்றது, மற்றும் synchronized block-ஐ narrow பண்ணி, lock hold duration குறைக்கறது. இந்த incident தான், நாங்க Circuit Breaker pattern implement பண்ண முடிவெடுக்க காரணம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Senior engineer இதை எப்படி approach பண்ணணும்?

**Thiru:** Senior level-ல கேட்கவேண்டிய questions:

- Production incidents-க்கு thread dump எடுக்கும் process automated-ஆ இருக்கா, இல்ல manual-ஆ SSH பண்ணி எடுக்கணுமா? (automated tools இருக்கணும், incident நேரத்தில் manual access delay ஆகும்)
- Thread dump analysis-க்கு tools use பண்றோமா (fastThread, IBM Thread and Monitor Dump Analyzer), இல்ல manual-ஆ படிக்கறோமா?
- Recurring lock contention patterns proactive-ஆ monitor பண்ணுறோமா, incident நடக்கும் முன்பே கண்டுபிடிக்க முடியுமா?
- Thread pool sizing, lock granularity — design level-லேயே இந்த issues-ஐ தவிர்க்க முடியுமா?

---

## 8. Interview Deep-Dive Questions

**Q:** Thread dump-ல BLOCKED state-க்கும் WAITING state-க்கும் என்ன வித்தியாசம்?
*Answer:* BLOCKED — thread ஒரு synchronized lock கிடைக்க wait பண்றது, வேற thread அந்த lock வைச்சிருக்கு. WAITING — thread indefinite-ஆ wait பண்றது (`wait()`, `join()` call பண்ணி), lock-க்காக இல்ல, ஒரு notify signal-க்காக.

**Q:** ஒரே ஒரு thread dump எடுத்தா போதுமா?
*Answer:* போதாது. Multiple dumps (3-4, சில seconds gap-ல) எடுத்து compare பண்ணணும் — அதே thread அதே place-ல தொடர்ந்து stuck-ஆ இருந்தா தான் அது real, persistent problem-ன்னு confirm பண்ணலாம்.

**Q:** Thread dump-ல lock contention எப்படி கண்டுபிடிப்பீங்க?
*Answer:* பல threads BLOCKED state-ல, ஒரே lock object (`waiting to lock <address>`) க்காக wait பண்றதை பார்த்து கண்டுபிடிக்கலாம். அந்த lock-ஐ hold பண்ணிக்கிட்டிருக்கும் thread-ஐ (`locked <address>`) கண்டுபிடிச்சா, அது என்ன செய்துகிட்டிருக்கு, ஏன் stuck ஆகி இருக்கு என்பதை trace பண்ணலாம்.

**Q:** jstack production-ல run பண்றது safe-ஆ?
*Answer:* ஆமா, lightweight operation, application restart தேவையில்ல. Brief momentary pause நடக்கலாம், ஆனா impact minimal. Best practice — தேவைப்படும்போது மட்டும் run பண்றது, தொடர்ந்து automate பண்ணி run பண்ணக்கூடாது.

---

## Quick Revision Summary

- Thread dump = a snapshot of every thread's state and stack trace at one moment
- `jstack <PID>` is the standard tool to capture it; `kill -3 <PID>` also works
- Thread states: RUNNABLE (executing), BLOCKED (waiting for a lock), WAITING (indefinite wait), TIMED_WAITING (wait with timeout)
- Take 3-4 dumps a few seconds apart to confirm a thread is genuinely stuck, not just momentarily busy
- Look for multiple threads BLOCKED on the same lock address — that's lock contention
- The thread holding the lock (marked "locked") is usually where the real root cause is
- jstack is lightweight and safe to run in production
- ECR Now: thread dump revealed threads stuck on an unbounded CDC network call, missing timeout — led to adding timeouts and a Circuit Breaker

**Mahi:** Super Thiru, இப்போ thread dump எப்படி read பண்றதுனு கிளியர்-ஆ புரியுது.

**Thiru:** Correct Mahi. அடுத்த episode-க்கு போலாம்.

---
*End of Episode: Thread Dump (jstack)*
