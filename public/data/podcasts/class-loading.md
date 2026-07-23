# Java Interview Podcast — Episode: Class Loading Mechanism
### Hosts: Mahi & Thiru

---

**Mahi:** Class Loading Mechanism பத்தி கொஞ்சம் detail-ஆ சொல்லுங்க.

**Thiru:** கண்டிப்பா Mahi. **Class Loading** [வகுப்பு ஏற்றுதல்] என்பது Java classes-ஐ memory-க்கு கொண்டு வர்ற process. JVM-ல மூணு main class loaders இருக்கு: Bootstrap, Extension, மற்றும் Application ClassLoader.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு company-ல வேலைக்கு ஆள் எடுக்குற மாதிரி யோசி. Bootstrap ClassLoader தான் CEO, முக்கியமான core members-ஐ மட்டும் எடுப்பாரு. Extension ClassLoader தான் Manager, specific department-க்கு ஆள் எடுப்பாரு. Application ClassLoader தான் HR, சாதாரண employees (நம்ம classes) எடுப்பாங்க.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Class loading மூணு steps-ல நடக்கும்: Loading, Linking, மற்றும் Initialization. Delegation Hierarchy model-ஐ follow பண்ணும். ஒரு class-ஐ load பண்ணனும்னா, முதல்ல parent loader-க்கு request போகும்.

```java
public class ClassLoaderDemo {
    public static void main(String[] args) {
        // AppClassLoader loads this class
        System.out.println(ClassLoaderDemo.class.getClassLoader()); 
        
        // Bootstrap ClassLoader loads String (returns null)
        System.out.println(String.class.getClassLoader()); 
    }
}
```
இங்க `String` class-ஐ Bootstrap loader load பண்ணும், அதனால `null` return ஆகும்.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Loader Type | Path Loaded From | Parent |
|--------|----------|----------|
| Bootstrap | `jre/lib/rt.jar` (Core Java) | None |
| Extension | `jre/lib/ext` | Bootstrap |
| Application | Classpath (our code) | Extension |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Custom ClassLoader எப்படி create பண்றதுன்னு கேட்பாங்க. `java.lang.ClassLoader` class-ஐ extend பண்ணி `findClass()` method-ஐ override பண்ணி நம்ம own class loader-ஐ உருவாக்கலாம்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** `ClassNotFoundException` மற்றும் `NoClassDefFoundError` தான் பெரிய issues. ரெண்டு வேற வேற libraries ஒரே class-ஓட different versions-ஐ use பண்ணா dependency conflicts வரும் (Jar Hell).

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) Spring Boot-ஓட custom class loaders-ஐ நாங்க use பண்றோம். Fat JAR execute ஆகும்போது nested JARs-ஐ load பண்ண Spring Boot-ஓட `LaunchedURLClassLoader` ரொம்ப help பண்ணுது.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Architect-ஆ module boundaries மற்றும் dependencies-ஐ சரியா define பண்ணனும். OSGi framework அல்லது Java 9 Modules (Project Jigsaw) use பண்ணா class loading issues-ஐ நிறைய தவிர்க்கலாம்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Delegation Hierarchy Principle எப்படி வேலை செய்யுது?
*Answer:* ஒரு class loader class-ஐ தேடும்போது, அது முதல்ல parent class loader-கிட்ட delegation பண்ணும். Parent-ஆல கண்டுபிடிக்க முடியலன்னா மட்டுமே child loader அந்த class-ஐ load பண்ணும்.

**Q:** Class.forName() என்ன பண்ணும்?
*Answer:* இது runtime-ல ஒரு class-ஐ load பண்ணி initialize பண்ணும். JDBC drivers-ஐ load பண்ண இது அடிக்கடி use ஆகும்.

---

## Quick Revision Summary

- Bootstrap, Extension, and Application are the three main loaders.
- Follows the Delegation Hierarchy principle.
- Loading, Linking, and Initialization are the phases.
- Custom ClassLoaders can be built by overriding findClass().
