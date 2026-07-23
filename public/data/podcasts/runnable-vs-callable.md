# Java Interview Podcast — Episode: Runnable vs Callable
### Hosts: Mahi & Thiru

---

**Mahi:** இன்னைக்கு Runnable vs Callable பத்தி பேசலாம். இது ரெண்டுக்கும் என்ன வித்தியாசம்?

**Thiru:** கண்டிப்பா Mahi. **Runnable** [ஒரு thread-ஐ execute பண்ண உதவும் interface, ஆனா எந்த result-ம் தராது] மற்றும் **Callable** [இதுவும் thread-ஐ execute பண்ணும், ஆனா ஒரு result-ஐ return பண்ணும், exception throw பண்ணும்].

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** Runnable ஒரு postman மாதிரி, லெட்டர் கொடுத்துட்டு வந்துருவாரு, பதில் எதிர்பார்க்க மாட்டாரு. Callable ஒரு delivery boy மாதிரி, பொருளை கொடுத்துட்டு signature வாங்கிட்டு (result) வருவாரு.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Java 1.5-ல Callable introduce பண்ணாங்க. Callable `call()` method-ஐ வச்சிருக்கு, அது Generic type return பண்ணும். Runnable `run()` method வச்சிருக்கு, அது void.

```java
// Runnable example
Runnable r = () -> System.out.println("Running");

// Callable example
Callable<String> c = () -> {
    return "Result from callable";
};
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Runnable | Callable |
|--------|----------|----------|
| Return Type | void | Generic type (T) |
| Exception | Checked exception throw பண்ண முடியாது | Exception throw பண்ணலாம் |
| Method | run() | call() |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Callable-ஐ Thread class-க்குள்ள directly pass பண்ண முடியுமான்னு கேப்பாங்க. முடியாது. Thread class Runnable-ஐ மட்டும்தான் ஏத்துக்கும். Callable-ஐ FutureTask-ல wrap பண்ணிதான் Thread-க்கு தர முடியும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Callable use பண்ணி Future.get() கூப்பிடும்போது, அது blocking call. அதனால thread stuck ஆக வாய்ப்பு இருக்கு. Timeout specify பண்றது ரொம்ப முக்கியம்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க external API calls பண்ணும்போது Callable use பண்ணுவோம். ஏன்னா எங்களுக்கு response status தேவை. Background cleanup jobs-க்கு Runnable use பண்ணுவோம், ஏன்னா அங்க result தேவையில்லை.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Fire-and-forget tasks-க்கு Runnable போதும். ஆனா data aggregation, scatter-gather patterns பண்ணும்போது கண்டிப்பா Callable/Future combination தான் use பண்ணனும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Runnable-ல Exception வந்தா எப்படி handle பண்றது?
*Answer:* Thread.UncaughtExceptionHandler use பண்ணி handle பண்ணலாம்.

**Q:** ExecutorService-ல ரெண்டையும் எப்படி submit பண்றது?
*Answer:* submit() method Runnable, Callable ரெண்டையும் ஏத்துக்கும். ஆனா execute() method Runnable மட்டும் தான் ஏத்துக்கும்.

---

## Quick Revision Summary

- Runnable returns void, Callable returns a generic type.
- Callable can throw checked exceptions, Runnable cannot.
- Use FutureTask to run a Callable in a normal Thread.
- ExecutorService.submit() supports both.
