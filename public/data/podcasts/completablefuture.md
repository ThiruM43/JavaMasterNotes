# Java Interview Podcast — Episode: CompletableFuture
### Hosts: Mahi & Thiru

---

**Mahi:** இன்னைக்கு CompletableFuture பத்தி பேசலாம். Future இருக்கறப்போ இது ஏன் வந்துச்சு?

**Thiru:** கண்டிப்பா Mahi. **Future** [background task result-ஐ குறிக்கும், ஆனா blocking get() use பண்ணனும்]. **CompletableFuture** [Java 8-ல வந்த asynchronous, non-blocking chaining framework]. இதுல multiple tasks-ஐ combine பண்ணலாம்.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** Future ஒரு டோக்கன் வாங்கிட்டு சாப்பாட்டுக்காக waiting line-ல நிக்கிற மாதிரி (Blocking). CompletableFuture ஒரு Swiggy order மாதிரி. Order போட்டுட்டு வேற வேலை பாக்கலாம், சாப்பாடு வந்ததும் அவங்களே notification (Callback) தருவாங்க.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** CompletableFuture internal-ஆ ForkJoinPool use பண்ணி work ஆகுது. ThenApply, thenAccept மாதிரி methods வழியா callbacks register பண்ணலாம்.

```java
CompletableFuture.supplyAsync(() -> {
    return "Data from DB";
}).thenApply(data -> {
    return data.toUpperCase();
}).thenAccept(result -> {
    System.out.println("Final Result: " + result);
});
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Future | CompletableFuture |
|--------|--------|-------------------|
| Chaining | முடியாது | thenApply(), thenCompose() வழியா பண்ணலாம் |
| Exception Handling | கஷ்டம் (try-catch) | exceptionally(), handle() வழியா easy |
| Completion | Manual-ஆ complete பண்ண முடியாது | complete() method வச்சு manual-ஆ முடிக்கலாம் |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** `thenApply` vs `thenApplyAsync` வித்தியாசம் கேப்பாங்க. `thenApply` previous task ஓடுன அதே thread-ல run ஆகும். `thenApplyAsync` புதுசா வேறொரு thread pool-ல run ஆகும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Default ஆ ForkJoinPool.commonPool() use பண்ணும். நிறைய I/O operations இருந்தா, common pool full ஆகி மொத்த system-ம் slow ஆகிடும். அதனால I/O tasks-க்கு custom Executor pass பண்றது முக்கியம்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க ஒரு patient-ஓட data-ஐ பல FHIR resources (Patient, Condition, Medication) ல இருந்து parallel ஆ fetch பண்ண CompletableFuture.allOf() use பண்றோம். Time ரொம்ப மிச்சமாகுது.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Error handling-ஐ கரெக்டா design பண்ணனும். ஒரு stage fail ஆனா fallback mechanism (like returning default value via `exceptionally`) தரணும். இல்லனா silent failure நடக்கும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** thenApply-க்கும் thenCompose-க்கும் என்ன வித்தியாசம்?
*Answer:* thenApply flat value-ஐ return பண்ணும். thenCompose ஒரு புது CompletableFuture-ஐ return பண்ணும் (Like map vs flatMap).

**Q:** allOf() vs anyOf() என்ன பண்ணும்?
*Answer:* allOf() எல்லா futures-ம் முடியற வரைக்கும் wait பண்ணும். anyOf() ஏதாவது ஒன்னு முடிஞ்சாலே trigger ஆகிடும்.

---

## Quick Revision Summary

- CompletableFuture allows building non-blocking async pipelines.
- Supports rich method chaining (thenApply, thenAccept).
- Provides robust exception handling (exceptionally, handle).
- Always use custom executors for I/O intensive tasks to prevent common pool starvation.
