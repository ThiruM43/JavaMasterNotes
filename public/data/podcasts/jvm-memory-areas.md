# Java Interview Podcast — Episode: JVM Memory Areas
### Hosts: Mahi & Thiru

---

**Mahi:** JVM Memory Areas பத்தி கொஞ்சம் detail-ஆ சொல்லுங்க.

**Thiru:** கண்டிப்பா Mahi. **Memory Areas** [Runtime Data Areas] என்பது JVM execute ஆகும்போது data-வை store பண்ற இடங்கள். இதுல Heap, Stack, Method Area (Metaspace), PC Register, மற்றும் Native Method Stack-னு 5 parts இருக்கு.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு office-ஐ எடுத்துக்கோ. Heap-ங்கிறது common storage room, எல்லாரும் use பண்ணிக்கலாம். Stack-ங்கிறது ஒவ்வொரு employee-க்கும் இருக்குற personal desk, அவங்க current வேலைக்காக மட்டும் use பண்ணுவாங்க. Metaspace-ங்கிறது rule book, எப்படி வேலை செய்யணும்னு எழுதி வெச்சிருப்பாங்க.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** Objects எல்லாம் Heap-ல create ஆகும். Methods call பண்ணும்போது local variables எல்லாம் Stack-ல store ஆகும். Class metadata Metaspace-ல இருக்கும்.

```java
public class MemoryExample {
    public void display() {
        int localVariable = 10; // Stored in Stack
        String text = new String("Hello"); // Object in Heap, reference in Stack
    }
}
```
இங்க `text` object Heap-ல இருக்கு, ஆனா அதோட reference Stack memory-ல store ஆகுது.

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Aspect | Heap Memory | Stack Memory |
|--------|----------|----------|
| Storage | Objects and instance variables | Local variables and method calls |
| Scope | Global access | Thread local |
| Error | OutOfMemoryError | StackOverflowError |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** String Pool எங்க இருக்குனு கேட்பாங்க. Java 8-க்கு அப்புறம் String Pool Heap memory-ல தான் இருக்கு. முன்னாடி அது PermGen-ல இருந்துச்சு. இத சரியா சொல்லணும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Memory leak ஆனா Heap space fill ஆகி `OutOfMemoryError` வரும். Recursion தப்பா எழுதுனா `StackOverflowError` வரும். இத monitor பண்ண Heap dump எடுத்து analyze பண்ணுவோம்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க பெரிய XML/JSON files process பண்ணும்போது Heap memory fill ஆகாம இருக்க streaming APIs use பண்ணுவோம். Metaspace limit செட் பண்ணி monitor பண்றோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Architect-ஆ Heap vs Non-Heap memory requirements-ஐ கணக்கிடணும். Thread pool size அதிகமா இருந்தா Stack memory consumption அதிகமாகும், அதனால சரியான balance கொண்டு வரணும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Heap memory-ல என்னென்ன regions இருக்கு?
*Answer:* Young Generation (Eden, Survivor spaces) மற்றும் Old Generation இருக்கு.

**Q:** Metaspace-க்கும் PermGen-க்கும் என்ன வித்தியாசம்?
*Answer:* Java 8-ல PermGen-ஐ remove பண்ணிட்டு Metaspace கொண்டு வந்தாங்க. Metaspace native memory-ஐ use பண்ணும், அதனால auto-scale ஆகும்.

---

## Quick Revision Summary

- Heap is for objects, Stack is for method execution.
- String pool is part of the Heap memory.
- StackOverflowError happens due to deep recursion.
- Metaspace replaced PermGen in Java 8.
