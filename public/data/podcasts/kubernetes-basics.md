# Java Interview Podcast — Episode: Kubernetes Basics
### Hosts: Mahi & Thiru

---

**Mahi:** Thiru, Docker வச்சு container create பண்ணிட்டோம். ஆனா production-ல நூற்றுக்கணக்கான containers-ஐ எப்படி manage பண்றது? அதுக்குத் தான் Kubernetes (K8s) ஆ?

**Thiru:** கரெக்ட் Mahi! **Kubernetes** [ஒரு Container Orchestration Tool]. Docker container உருவாக்கும், ஆனா Kubernetes அந்த containers-ஐ எப்ப start பண்ணனும், எப்போ scale பண்ணனும், fail ஆனா எப்படி restart பண்ணனும்-னு manage பண்ணும்.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** ஒரு orchestra வச்சுக்கோ.
- இசைக்கலைஞர்கள் (Musicians) தான் **Docker containers**.
- அவங்கள ஒருங்கிணைச்சு, யார் எப்போ வாசிக்கணும்-னு சொல்ற Music Director (Conductor) தான் **Kubernetes**.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** K8s-ல **Master Node** (Control plane) மற்றும் **Worker Nodes** இருக்கும். YAML file வழியா நம்ம requirement-ஐ Master-கிட்ட சொன்னா, அது Worker nodes-ல Pods-ஆ ரன் பண்ணும்.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: spring-boot-app
spec:
  replicas: 3 # Run 3 instances
  selector:
    matchLabels:
      app: java-app
  template:
    metadata:
      labels:
        app: java-app
    spec:
      containers:
      - name: java-app
        image: my-repo/my-java-app:1.0
        ports:
        - containerPort: 8080
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. K8s-ஓட core components-ஐ பாரு:
| Component | What it is | Example |
|--------|----------|----------|
| Pod | Smallest deployable unit | Wraps 1 or more containers |
| Deployment | Manages Pod replicas | Ensures 3 copies run always |
| Service | Networking and Load Balancing | Exposes Pods to external world |
| ConfigMap/Secret | Externalized configuration | DB URLs, Passwords |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** "Pod fail ஆனா என்ன ஆகும்?"-னு கேட்பாங்க. Kubernetes auto-healing support பண்ணுது. Pod fail ஆனா Deployment controller உடனே புது Pod-ஐ வேற node-ல start பண்ணிடும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Resource allocation. Java app-க்கு memory சரியா allocate பண்ணலைனா K8s OOM (Out of Memory) Killed எர்ரர் அடிச்சு Pod-ஐ restart பண்ணிட்டே இருக்கும். Liveness and Readiness probes சரியா configure பண்ணனும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க AWS EKS (Elastic Kubernetes Service) use பண்றோம். Load அதிகமாகும்போது HPA (Horizontal Pod Autoscaler) வழியா 2 Pods-ல இருந்து 10 Pods-க்கு தானா scale ஆகுற மாதிரி set பண்ணிருக்கோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** K8s ரொம்ப complex. தேவையில்லாம K8s use பண்ணக் கூடாது. Graceful shutdown ரொம்ப முக்கியம். K8s Pod-ஐ kill பண்ணும்போது Spring Boot-க்கு SIGTERM signal போகும், அதை process பண்ணி DB connections-ஐ close பண்ணனும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** Liveness probe-க்கும் Readiness probe-க்கும் என்ன வித்தியாசம்?
*Answer:* Readiness probe பாஸ் ஆனா தான் traffic pod-க்கு வரும். Liveness probe fail ஆனா pod restart ஆகும்.

**Q:** NodePort-க்கும் LoadBalancer-க்கும் என்ன வித்தியாசம்?
*Answer:* NodePort வந்து Worker node-ஓட port-ஐ expose பண்ணும். LoadBalancer Cloud provider-ஓட (e.g., AWS ELB) load balancer-ஐ create பண்ணி traffic route பண்ணும்.

---

## Quick Revision Summary

- Kubernetes orchestrates containers (scaling, healing, networking).
- Pod is the smallest unit containing one or more containers.
- Deployments manage replicas and rolling updates.
- Liveness/Readiness probes ensure healthy routing and restarts.
