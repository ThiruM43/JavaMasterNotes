# Java Interview Podcast — Episode: Date/Time API
### Hosts: Mahi & Thiru

---

**Mahi:** பழைய `java.util.Date`-ல என்ன problem, ஏன் புது Date/Time API கொண்டு வந்தாங்க?

**Thiru:** கண்டிப்பா Mahi. **Java 8 Date/Time API** [immutable thread-safe API] `java.time` package-ல இருக்கு. பழைய `Date` class mutable, thread-safe கிடையாது, and months 0-indexed ஆ இருந்துச்சு. புது API இது எல்லாத்தையும் solve பண்ணுது.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** பழைய Date class ஒரு pencil-ல எழுதுன calendar மாதிரி, யார் வேணா அழிச்சிட்டு மாத்தலாம் (mutable). ஆனா புது API ஒரு printed calendar மாதிரி, அதை மாத்த முடியாது, புதுசா ஒன்னு தான் print பண்ணனும் (immutable).

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** புது API Joda-Time library-ஐ base பண்ணி JSR-310-ஆ implement பண்ணாங்க. இதுல எல்லா classes-ம் (like `LocalDate`, `LocalTime`, `ZonedDateTime`) immutable and thread-safe.

```java
// Current date
LocalDate today = LocalDate.now();

// Add one month (returns a new object)
LocalDate nextMonth = today.plusMonths(1);

System.out.println(today);
System.out.println(nextMonth);
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | `java.util.Date` | `java.time.LocalDate` |
|--------|------------------|-----------------------|
| Mutability | Mutable | Immutable |
| Thread Safety | Not thread-safe | Thread-safe |
| Month Indexing | Starts from 0 (Jan = 0) | Starts from 1 (Jan = 1) |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** `LocalDate` objects-ஐ `==` operator வச்சு compare பண்ணலாமான்னு கேப்பாங்க. கூடாது! `equals()` இல்ல `isBefore()`, `isAfter()` methods தான் use பண்ணனும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Timezones handle பண்ணும்போது `LocalDateTime` use பண்றது ஆபத்து. Production server வேற timezone-ல run ஆனா values தப்பாகும். Global applications-க்கு எப்பவும் `ZonedDateTime` இல்ல `Instant` use பண்றது தான் safe.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க health events-ஐ track பண்ண `Instant`-ஐ UTC-ல DB-ல store பண்ணுவோம். UI-க்கு அனுப்பும்போது மட்டும் local timezone-க்கு மாத்துவோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Database interactions-க்கு JPA 2.2+ use பண்ணா `java.time` classes native-ஆ support ஆகும். DB-ல timestamp store பண்ணும்போது எப்பவும் UTC standard-ஐ enforce பண்ணனும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** What is the difference between `Period` and `Duration`?
*Answer:* `Period` is used for date-based values (years, months, days). `Duration` is used for time-based values (hours, minutes, seconds, nanoseconds).

**Q:** How do you convert old `java.util.Date` to new `LocalDate`?
*Answer:* `date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate()` அப்படின்னு convert பண்ணலாம்.

---

## Quick Revision Summary

- Introduced in Java 8 to fix thread-safety and mutability issues of old `Date` classes.
- Completely immutable and thread-safe.
- `LocalDate`, `LocalTime`, `LocalDateTime` for human-readable dates/times without timezones.
- `ZonedDateTime` for timezone-aware dates.
- `Instant` represents a specific moment in time (good for timestamps).