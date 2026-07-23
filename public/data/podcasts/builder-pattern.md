# Java Interview Podcast — Episode: Builder Pattern
### Hosts: Mahi & Thiru

---

**Mahi:** இன்னைக்கு நாம Builder Pattern பத்தி பேசலாம். இது என்ன pattern?

**Thiru:** கண்டிப்பா Mahi. Builder Pattern ஒரு முக்கியமான **Design Pattern** [மென்பொருள் வடிவமைப்பு முறை]. இது code-ஐ reusable மற்றும் maintainable ஆக மாற்றுவதற்கு ரொம்ப useful.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** Subway sandwich வாங்குற மாதிரி தான். உங்களுக்கு என்னென்ன ingredients வேணும்னு step-by-step ஆ add பண்ணி கடைசில ஒரு முழு sandwich வாங்குவீங்க. அது தான் Builder. இதுல எல்லாமே ஒரு குறிப்பிட்ட வழியில நடக்கும், அதனால எந்த confusion-உம் வராது.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Java-ல இது implement பண்றதுக்கு class design ரொம்ப முக்கியம். இந்த code block-ஐ பாரு:
```java
public class Computer {
    private String hdd, ram;
    private boolean isGraphicsCardEnabled;
    private Computer(ComputerBuilder builder) {
        this.hdd = builder.hdd;
        this.ram = builder.ram;
        this.isGraphicsCardEnabled = builder.isGraphicsCardEnabled;
    }
    public static class ComputerBuilder {
        private String hdd, ram;
        private boolean isGraphicsCardEnabled;
        public ComputerBuilder(String hdd, String ram) {
            this.hdd = hdd; this.ram = ram;
        }
        public ComputerBuilder setGraphicsCard(boolean enabled) {
            this.isGraphicsCardEnabled = enabled; return this;
        }
        public Computer build() { return new Computer(this); }
    }
}
```
இப்படித் தான் internally object creation அல்லது behavior control ஆகுது. இது ரொம்ப effective ஆன வழி.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Builder | Factory |
|--------|----------|----------|
| Focus | Step-by-step object creation | Single-step object creation |
| Return | Returns same builder till build() | Returns completely created object |
| Parameters | Handles optional parameters easily | Hard to manage many parameters |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Thread safety issue வரலாம். Builder object thread safe கிடையாது, அதனால build() method call பண்ற வரைக்கும் அனாவசியமான modifications நடக்காம பாத்துக்கணும். நிறைய பேரு இதை miss பண்ணிடுவாங்க, ஆனா senior level interview-ல இது ரொம்ப முக்கியம்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** நிறைய boilerplate code எழுத வேண்டியிருக்கும். Lombok @Builder use பண்ணி இதை avoid பண்ணலாம். Immutable objects create பண்ண Builder ரொம்ப useful. அதனால monitoring மற்றும் memory profiling ரொம்ப அவசியம்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க HL7 Message objects create பண்ண Builder pattern use பண்றோம். Message-ல நிறைய optional segments இருக்கும். இது system stability-ஐ ரொம்பவே இம்ப்ரூவ் பண்ணிருக்கு.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Constructors-ல 4-க்கு மேல parameters இருந்தா, குறிப்பா optional parameters இருந்தா Builder pattern use பண்றது best practice. Code readability நல்லா இருக்கும். Design principles-ஐ எப்பவுமே priority-ஆ வச்சு யோசிக்கணும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Why use Builder over constructor overloading?
*Answer:* Constructor overloading (Telescoping constructor) is hard to read and maintain. Builder provides clear step-by-step initialization.

**Q:** Is the constructed object immutable?
*Answer:* Yes, usually the target class only has getters and no setters, making the final object immutable.

---

## Quick Revision Summary

- Builder Pattern provides a clean way to solve recurring design problems.
- Always consider edge cases like thread safety and memory leaks.
- Real-world production implementation always varies slightly from textbook examples.
- Always remember the core intent of Builder Pattern before applying it.
- Practice the Java implementation thoroughly.
- Understand the pros and cons compared to alternatives.
- Realize how it fits into the broader software architecture.
