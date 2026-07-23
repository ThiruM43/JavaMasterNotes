# Java Interview Podcast — Episode: Template Method Pattern
### Hosts: Mahi & Thiru

---

**Mahi:** இன்னைக்கு நாம Template Method Pattern பத்தி பேசலாம். இது என்ன pattern?

**Thiru:** கண்டிப்பா Mahi. Template Method Pattern ஒரு முக்கியமான **Design Pattern** [மென்பொருள் வடிவமைப்பு முறை]. இது code-ஐ reusable மற்றும் maintainable ஆக மாற்றுவதற்கு ரொம்ப useful.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** வீடு கட்டுற மாதிரி. Foundation, Walls, Roof-னு ஒரு sequence இருக்கு. ஆனா ஒவ்வொரு வீடும் design-ல வேற மாதிரி இருக்கலாம். Sequence மாறாது. இதுல எல்லாமே ஒரு குறிப்பிட்ட வழியில நடக்கும், அதனால எந்த confusion-உம் வராது.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Java-ல இது implement பண்றதுக்கு class design ரொம்ப முக்கியம். இந்த code block-ஐ பாரு:
```java
public abstract class HouseTemplate {
    public final void buildHouse() { // Template method
        buildFoundation(); buildPillars(); buildWalls();
    }
    private void buildFoundation() { System.out.println("Foundation"); }
    protected abstract void buildPillars();
    protected abstract void buildWalls();
}
public class WoodenHouse extends HouseTemplate {
    protected void buildPillars() { System.out.println("Wood Pillars"); }
    protected void buildWalls() { System.out.println("Wood Walls"); }
}
```
இப்படித் தான் internally object creation அல்லது behavior control ஆகுது. இது ரொம்ப effective ஆன வழி.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Template Method | Strategy |
|--------|----------|----------|
| Mechanism | Inheritance | Composition |
| Algorithm level | Fixes skeleton, subclasses fill steps | Entire algorithm is interchangeable |
| Flexibility | Less flexible (compile time) | More flexible (runtime) |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Base class-ல final keyword use பண்ணலைன்னா subclasses template method-ஐயே override பண்ணி structure-ஐ மாத்திடும். நிறைய பேரு இதை miss பண்ணிடுவாங்க, ஆனா senior level interview-ல இது ரொம்ப முக்கியம்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Frameworks-ல (Spring JdbcTemplate) அதிகமா use ஆகுது. Inversion of control நடக்கும் (Hollywood Principle - Don't call us, we'll call you). அதனால monitoring மற்றும் memory profiling ரொம்ப அவசியம்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க mail processing pipeline-க்கு (Read -> Parse -> Validate -> Save) Template method use பண்றோம். இது system stability-ஐ ரொம்பவே இம்ப்ரூவ் பண்ணிருக்கு.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Code duplication-ஐ avoid பண்ண சிறந்த வழி. Core logic-ஐ abstract class-ல வச்சிட்டு, specific logic-ஐ மட்டும் subclass-ல எழுதலாம். Design principles-ஐ எப்பவுமே priority-ஆ வச்சு யோசிக்கணும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** What is the Hollywood Principle?
*Answer:* 'Don't call us, we'll call you' - the superclass calls the subclass methods, not the other way around.

**Q:** Why make the template method final?
*Answer:* To prevent subclasses from changing the algorithm's skeleton/sequence.

---

## Quick Revision Summary

- Template Method Pattern provides a clean way to solve recurring design problems.
- Always consider edge cases like thread safety and memory leaks.
- Real-world production implementation always varies slightly from textbook examples.
- Always remember the core intent of Template Method Pattern before applying it.
- Practice the Java implementation thoroughly.
- Understand the pros and cons compared to alternatives.
- Realize how it fits into the broader software architecture.
