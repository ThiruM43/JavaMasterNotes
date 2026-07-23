# Java Interview Podcast — Episode: Proxy Pattern
### Hosts: Mahi & Thiru

---

**Mahi:** இன்னைக்கு நாம Proxy Pattern பத்தி பேசலாம். இது என்ன pattern?

**Thiru:** கண்டிப்பா Mahi. Proxy Pattern ஒரு முக்கியமான **Design Pattern** [மென்பொருள் வடிவமைப்பு முறை]. இது code-ஐ reusable மற்றும் maintainable ஆக மாற்றுவதற்கு ரொம்ப useful.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** Corporate network-ல internet access பண்ண Proxy server use பண்ற மாதிரி. Direct access கிடையாது, proxy வழியா தான் request போகும். அவங்க block/allow பண்ணலாம். இதுல எல்லாமே ஒரு குறிப்பிட்ட வழியில நடக்கும், அதனால எந்த confusion-உம் வராது.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Java-ல இது implement பண்றதுக்கு class design ரொம்ப முக்கியம். இந்த code block-ஐ பாரு:
```java
public interface Image { void display(); }
public class RealImage implements Image {
    public RealImage() { loadFromDisk(); }
    public void display() { System.out.println("Displaying"); }
    private void loadFromDisk() { /* Heavy operation */ }
}
public class ProxyImage implements Image {
    private RealImage realImage;
    public void display() {
        if (realImage == null) realImage = new RealImage();
        realImage.display();
    }
}
```
இப்படித் தான் internally object creation அல்லது behavior control ஆகுது. இது ரொம்ப effective ஆன வழி.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Proxy | Adapter |
|--------|----------|----------|
| Purpose | Control access | Convert interface |
| Interface | Implements same interface as target | Implements different interface |
| Implementation | May lazily create target object | Requires existing target object |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Spring AOP-ல self-invocation proxy வழியா போகாது. (ஒரு method இன்னொரு method-ஐ அதே class-ல call பண்ணா proxy வேலை செய்யாது). நிறைய பேரு இதை miss பண்ணிடுவாங்க, ஆனா senior level interview-ல இது ரொம்ப முக்கியம்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Network overhead வரலாம் (Remote proxy). Dynamic proxies (CGLIB, JDK Proxy) startup time-ஐ increase பண்ணும். அதனால monitoring மற்றும் memory profiling ரொம்ப அவசியம்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க external system calls-க்கு retry logic add பண்ண Spring-ஓட @Retryable (Proxy based) use பண்றோம். இது system stability-ஐ ரொம்பவே இம்ப்ரூவ் பண்ணிருக்கு.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Security, Caching, Lazy loading, Transaction management (Spring @Transactional) எல்லாத்துக்கும் Proxy தான் base. Design principles-ஐ எப்பவுமே priority-ஆ வச்சு யோசிக்கணும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** What is the difference between JDK Dynamic Proxy and CGLIB?
*Answer:* JDK Proxy works on interfaces, CGLIB works by subclassing the target class.

**Q:** Why doesn't @Transactional work on internal method calls?
*Answer:* Because the call doesn't pass through the Spring-generated proxy object.

---

## Quick Revision Summary

- Proxy Pattern provides a clean way to solve recurring design problems.
- Always consider edge cases like thread safety and memory leaks.
- Real-world production implementation always varies slightly from textbook examples.
- Always remember the core intent of Proxy Pattern before applying it.
- Practice the Java implementation thoroughly.
- Understand the pros and cons compared to alternatives.
- Realize how it fits into the broader software architecture.
