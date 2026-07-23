# Java Interview Podcast — Episode: Docker Basics for Java
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, இப்போல்லாம் Java projects எல்லாமே Docker குள்ள தான் ஓடுது. Docker-னா என்ன, அது ஏன் இவ்ளோ முக்கியம்?

**Thiru:** கண்டிப்பா Mahi. **Docker** [அப்ளிகேஷனை அதோட dependencies கூட சேர்த்து ஒரு container-ஆ மாத்துற technology]. முன்னாடி "என் மெஷின்ல ஒர்க் ஆகுது, சர்வர்ல ஒர்க் ஆகல"-னு சொல்வாங்க. அதை solve பண்ணத் தான் Docker வந்துச்சு.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** சரக்கு கப்பல்ல (Cargo ship) பொருட்கள் அனுப்பும்போது, ஒவ்வொரு பொருளையும் தனித்தனியா வைக்காம, எல்லாத்தையும் Standardized **Shipping Containers**-க்குள்ள வச்சு அனுப்புவாங்க. Docker-உம் அதே தான். நம்ம Java app, OS, JRE எல்லாத்தையும் ஒரு box-க்குள்ள போட்டு எங்கு வேணாலும் run பண்ணலாம்.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** ஒரு `Dockerfile` எழுதி, அதை build பண்ணி Image ஆ மாத்துவோம். அந்த Image-ஐ run பண்ணா அது Container.

```dockerfile
# Base image
FROM eclipse-temurin:17-jre-alpine

# Set working directory
WORKDIR /app

# Copy the jar file
COPY target/myapp.jar myapp.jar

# Run the application
ENTRYPOINT ["java", "-jar", "myapp.jar"]
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. VM (Virtual Machine) க்கும் Container-க்கும் உள்ள வித்தியாசம்:
| Aspect | Virtual Machine | Docker Container |
|--------|----------|----------|
| OS | Guest OS needs to be installed | Shares the Host OS kernel |
| Boot Time | Minutes | Seconds |
| Resource Usage | Heavy (CPU, RAM) | Lightweight |
| Isolation | Hardware level | Process/Namespace level |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** "Docker image size-ஐ எப்படி குறைப்பீங்க?"-னு கேட்பாங்க. Multi-stage build use பண்ணலாம். JDK-ஐ build பண்ண use பண்ணிட்டு, JRE-ஐ மட்டும் run பண்ண use பண்ணா size ரொம்ப கம்மி ஆகிடும். Alpine based images use பண்ணலாம்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Security தான் மெயின். Container குள்ள ரூட் யூசரா (root user) app-ஐ ரன் பண்ணக் கூடாது. Memory limits (`-m`) செட் பண்ணலைனா, container மொத்த RAM-ஐயும் எடுத்துட்டு host crash ஆகிடும் (OOM Killer).

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க Spring Boot 3-ஓட AOT (Ahead Of Time) compilation use பண்ணி GraalVM native image-ஆ மாத்துறோம். அதனால Docker image size ரொம்ப கம்மி, startup time மில்லிசெகண்ட்ஸ்-ல இருக்கு.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Observability ரொம்ப முக்கியம். Container log-ஐ எப்படி ELK stack-க்கு அனுப்புறது, metrics-ஐ எப்படி Prometheus-க்கு அனுப்புறது-னு யோசிக்கணும். Stateless ஆ design பண்ணனும், அப்போ தான் scale பண்ண ஈஸியா இருக்கும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** `CMD` க்கும் `ENTRYPOINT` க்கும் என்ன வித்தியாசம்?
*Answer:* `ENTRYPOINT` வந்து container start ஆகும்போது execute ஆகுற main command. `CMD` வந்து அதுக்கு பாஸ் பண்ற default arguments.

**Q:** Docker volumes எதுக்கு use ஆகுது?
*Answer:* Container அழிஞ்சாலும் data அழியாம இருக்க (Persistent storage) Volumes use ஆகுது (e.g., Database data).

---

## Quick Revision Summary

- Docker solves the "works on my machine" problem.
- Containers share the host OS kernel and are lightweight.
- Use multi-stage builds and Alpine images to reduce image size.
- Never run containers as root in production.
