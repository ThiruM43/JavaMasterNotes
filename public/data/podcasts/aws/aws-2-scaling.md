# Advanced AWS Architecture for Java Developers - Transcript

## Introduction

**Mahi:** Hello உங்கள வரவேற்கிறோம், இன்னைக்கு நம்மளோட இந்த ஆழமான அலசலுக்கு. இன்னைக்கு நாம பேச போற topic வந்து ரொம்பவே interesting-ஆனது.

**Thiru:** ஆமா, குறிப்பா developers-க்கு. ஏன்னா நாம AWS cloud-ல High Availability [High Availability - எப்பவுமே down ஆகாம ஓடிக்கிட்டே இருக்குற system], containers [Containers - app-ஐ run பண்றதுக்கு தேவையான எல்லாத்தையும் ஒன்னா சேர்த்து வச்சிருக்குற ஒரு package], அப்புறம் serverless architectures [Serverless architectures - server இருக்கா இல்லையானு நாம கவலைப்படாம code-ஐ மட்டும் run பண்ற system] பத்தி ரொம்ப deep-ஆ பார்க்க போறோம்.

**Mahi:** Correct. இப்போ நீங்க ஒரு Java backend developer அப்படின்னு வச்சுப்போம். நீங்க Spring Boot use பண்ணி ஒரு பெரிய monolithic application [Monolithic application - எல்லா features-உம் ஒரே code base-ல இருக்குற ஒரு பெரிய app] build பண்ணிருக்கீங்க.

**Thiru:** ம்ம்... அதுவும் அந்த real time web socket streaming [Web socket streaming - server-க்கும் browser-க்கும் நடுவுல continuous-ஆ data பரிமாறிக்குற ஒரு technology] எல்லாம் set பண்ணிருக்கீங்கனு வச்சுப்போம். local machine-ல அது Super-ஆ ஓடும்.

**Mahi:** ஆனா அதையே நிஜ உலகத்துல ஒரு production environment-ல ஆயிரக்கணக்கான users access பண்ணும்போது, அது ஒரு பெரிய புயல்ல மாட்டுன மாதிரி ஆயிடும் இல்லையா?

**Thiru:** கண்டிப்பா. அந்த legacy Java 8 monolithic app-ஐ scale பண்ணும்போது [Scale - அதிக traffic வரும்போது app-ஐ பெருசாக்குறது] வர challenges வந்து ரொம்ப அதிகம். அதை எப்படி AWS concepts வச்சு solve பண்றதுன்னு இன்னைக்கு நாம அலச போறோம்.

**Mahi:** அதோட சேர்த்து இத ஒரு SAA அதாவது Solutions Architect Associate exam எழுதுறவங்களுக்கான ஒரு decision framework-ஆவும் [Decision framework - எந்த சூழ்நிலையில எந்த service-ஐ choose பண்ணனும்னு முடிவெடுக்க உதவுற ஒரு வழிகாட்டி] நம்ம கொடுக்க போறோம்.

**Thiru:** ரொம்ப முக்கியம் அது, ஏன்னா exam-ல நிறைய scenario based கேள்விகள் வரும், எப்போ எதை use பண்ணனும்னு தெளிவா தெரியணும்.

**Mahi:** OK, இப்போ topic-குள்ள போலாம். நாம முதல்ல நீங்க சந்திச்ச அந்த legacy scaling பிரச்சனைகள்ல இருந்து ஆரம்பிக்கலாம். இப்போ ஒரு single server-ல உங்க Java app ஓடுது. traffic அதிகமாகுது, server திணறுது.

**Thiru:** அந்த நேரத்துல நாம முதல்ல பண்றது vertical scaling [Vertical scaling - இருக்குற server-லயே RAM, CPU-வை அதிகப்படுத்துறது] தான். அதாவது இருக்குற server-உடைய capacity-ஐ அதிகமாக்குறது.

**Mahi:** ஆமா, AWS-ல ஒரு சின்ன t2.nano-ல ஆரம்பிச்சு பெரிய u12tb1.metal instance வரைக்கும் CPU-வையும் RAM-ஐயும் கூட்டிக்கிட்டே போகலாம்.

**Thiru:** ஆனா அதுக்கு ஒரு limit இருக்கு. ஒரு கட்டத்துக்கு மேல உங்களால hardware-ஐ பெருசாக்க முடியாது. அங்கதான் horizontal scaling [Horizontal scaling - ஒரே மாதிரி நிறைய servers-ஐ புதுசா சேர்த்துக்கிட்டே போறது] உள்ள வருது.

## Core Concept

**Mahi:** அதாவது server-உடைய size-ஐ பெருசாக்குறதுக்கு பதிலா, servers-ஓட எண்ணிக்கையை அதிகமாக்குறது, Correct-உங்களா?

**Thiru:** exactly. AWS-ல இத Auto Scaling Group [Auto Scaling Group (ASG) - தேவைக்கு ஏத்த மாதிரி தானாகவே servers-ஐ கூட்டி குறைக்குற ஒரு service] அதாவது ASG மூலமா ரொம்ப Easy-ஆ automate பண்ணலாம்.

**Mahi:** இப்போ traffic அதிகமாகும்போது ASG புதுசா EC2 instances-ஐ உருவாக்கும், traffic குறையும்போது?

**Thiru:** தேவையில்லாத instances-ஐ அதுவே terminate பண்ணிடும் [Terminate - server-ஐ close பண்றது]. இது கேக்க ரொம்ப Simple-ஆ இருக்கும்.

**Mahi:** ஆனா இங்கதான் ஒரு practical பிரச்சனை வருது. இப்போ நம்மகிட்ட பல servers இருக்கு, 1000 users வராங்க. எந்த user-ஓட request-ஐ எந்த server-க்கு அனுப்புறது?

**Thiru:** அங்கதான் load balancers-ஓட [Load balancers - வர்ற traffic-ஐ எல்லா servers-க்கும் சமமா பிரிச்சு கொடுக்குறது] வேலை ஆரம்பிக்குது. குறிப்பா Application Load Balancer [Application Load Balancer (ALB) - HTTP/HTTPS request-ஐ புரிஞ்சுக்கிட்டு பிரிச்சு கொடுக்குற load balancer] அதாவது ALB.

**Mahi:** சோ users நேரா நம்ம EC2 instances-ஐ hit பண்ண மாட்டாங்க, அவங்க ALB-ஐ தான் hit பண்ணுவாங்க இல்லையா?

**Thiru:** ஆமா, ALB தான் அந்த பல EC2 instances-க்கு traffic-ஐ பிரிச்சு அனுப்பும். எந்த server healthy-ஆ இருக்குன்னு check பண்றதும் அதோட வேலை தான்.

**Mahi:** இங்கதான் விஷயமே ரொம்ப interesting-ஆ ஆகுது. இப்போ நீங்க web socket streaming setup பண்ணிருக்கீங்க, அதுக்கு continuous connection தேவைப்படும்.

**Thiru:** ம்ம்... ஏன்னா web sockets வந்து HTTP மாதிரி stateless [Stateless - user யாருன்னு ஞாபகம் வச்சுக்காம ஒவ்வொரு request-ஐயும் புதுசா பாக்குறது] கிடையாது.

**Mahi:** Correct. ஒரு user ஒரு முறை ஒரு server-க்கு connect ஆயிட்டா, அவரோட அடுத்தடுத்த request-உம் அதே server-க்கு தான் போகணும்.

**Thiru:** ஆமா, ALB சும்மா round robin முறையில [Round Robin - வரிசையா ஒன்னொன்னா எல்லா server-க்கும் மாத்தி மாத்தி அனுப்புறது] அடுத்த server-க்கு மாத்திவிட்டா, user-ஓட session cut ஆயிடும்.

## Real-world Example

**Mahi:** அப்போ அந்த continuous connection-ஐ எப்படி maintain பண்றது?

**Thiru:** இதுக்கு நாம sticky sessions [Sticky sessions - ஒரு user-ஐ எப்பவுமே ஒரே server-க்கு அனுப்புற மாதிரி ஒட்டி வைக்கிறது] use பண்ணுவோம். அதாவது session affinity [Session affinity]. user முதல் முறையா வரும்போது, ALB ஒரு HTTP cookie-ஐ [HTTP cookie - browser-ல save ஆகுற ஒரு சின்ன data file] set பண்ணிடும்.

**Mahi:** OK, அந்த cookie-ல இந்த user எந்த server-க்கு போனாருங்கிற தகவல் இருக்குமா?

**Thiru:** சரியா சொன்னீங்க. இதுல application-based cookies இருக்கு, அப்புறம் duration-based cookies இருக்கு.

**Mahi:** அந்த application-based-ல நம்ம Java application-ஏ உருவாக்குற custom cookie வரலாமா?

**Thiru:** ஆமா, அல்லது AWSALBApp அப்படிங்கிற cookie வரலாம். duration-based-ல AWSALB அப்படின்னு பேர் இருக்கும்.

**Mahi:** அப்போ அடுத்த முறை user வரும்போது, ALB அந்த cookie-ஐ பார்த்துட்டு நேரா பழைய server-க்கே அனுப்பிடும். session cut ஆகாது.

**Thiru:** Correct. ஆனா இங்க நீங்க ஒரு விஷயத்தை கவனிக்கணும். web sockets use பண்ணும்போது sessions ரொம்ப நேரம் open-லயே இருக்கும்.

**Mahi:** அட ஆமா, அப்போ குறிப்பிட்ட users எப்பவும் ஒரே EC2 instance-க்கே தொடர்ந்து போயிட்டு இருந்தா, servers நடுவுல load imbalance [Load imbalance - ஒரு server-ல அதிக load-உம் மத்த server-ல கம்மி load-உம் இருக்குற நிலை] வராதா?

**Thiru:** அதுதான் இதுல இருக்குற பெரிய சிக்கலே. sticky sessions session-ஐ பாதுகாக்கும், ஆனா ஒரு கட்டத்துல load imbalance-ஐ கண்டிப்பா உருவாக்கும்.

**Mahi:** ஒரு server-ல மட்டும் load ஏறிக்கிட்டே போகும், மத்த servers சும்மா உக்காந்துட்டு இருக்கும். இதை எப்படி handle பண்றது?

**Thiru:** அதனாலதான் நாம Auto Scaling Group-ஐ பல Availability Zones-ல [Availability Zones - வெவ்வேறு இடங்கள்ல இருக்குற தனித்தனி data centers] spread பண்ணி வைக்கிறோம். load அதிகமானா புது instances உருவாகும்.

## Under the Hood

**Mahi:** அப்புறம் அந்த connection draining [Connection draining - ஒரு server-ஐ off பண்றதுக்கு முன்னாடி, அதுல இருக்குற users வேலையை முடிக்கிற வரைக்கும் wait பண்றது] concept use பண்ணி புது servers-க்கு traffic-ஐ திருப்புவோம்.

**Thiru:** exactly. ஆனா இப்போ நீங்க ஒரு developer-ஆ யோசிச்சு பாருங்க. இதெல்லாம் set பண்ணி, OS patch பண்ணி [OS patch - operating system-ஐ update பண்றது], server-ஐ manage பண்றது...

**Mahi:** பெரிய தலைவலி தான். எனக்கு இந்த infrastructure management எல்லாம் வேணாம், என் Java application-ஐ Docker-ல [Docker - application-ஐ container-ஆ மாத்துற ஒரு software] package பண்ணிட்டேன். அடுத்தது என்ன?

**Thiru:** அங்கதான் containers. குறிப்பா Amazon ECS [Elastic Container Service - containers-ஐ run பண்ணி manage பண்ற AWS service], அதுலயும் Fargate launch type உள்ள வருது.

**Mahi:** ஓ, Fargate. இது ஒரு serverless container management service ஆச்சே?

**Thiru:** ஆமா. நீங்க infrastructure-ஐ, அதாவது EC2 instances-ஐ manage பண்ண தேவையே இல்ல.

**Mahi:** இதை பாக்க எப்படின்னா, ஒரு Restaurant-ல நீங்க சமையல்காரங்களை வேலைக்கு எடுத்து manage பண்றதுக்கு பதிலா...

**Thiru:** நீங்க உங்க Recipe-ஐ மட்டும் கொடுத்துட்டா போதும், அதாவது உங்க Docker image-ஐ.

**Mahi:** ஆமா, அவங்களே சமைச்சு தந்துடுவாங்க. Fargate அந்த tasks-ஐ run பண்ணிடும்.

**Thiru:** Correct. Fargate உங்களோட focus-ஐ servers-ல இருந்து application logic பக்கம் திருப்புது. நீங்க task definitions [Task definitions - container-க்கு எவ்வளவு RAM, CPU வேணும்னு சொல்ற ஒரு plan] மூலமா எவ்வளவு CPU, RAM வேணும்னு சொன்னா போதும்.

**Mahi:** Wow, அப்ப legacy monolith-ஐ அப்படியே dockerize பண்ணி Fargate-ல போட்டுட்டா OS patching கவலையே இல்ல.

**Thiru:** எந்த கவலையும் இல்ல. ஆனா இங்க ஒரு கேள்வி வரும். containers மூலமா servers-ஐ மறைச்சுட்டோம். ஆனா உங்க Spring Boot app வந்து 24/7 ஓடிக்கிட்டே இருக்குமே?

## Edge Cases & Scenarios

**Mahi:** ஆமா, traffic இல்லைனாலும் அந்த container ஓடுறதுக்கு நான் காசு கொடுத்து ஆகணும். இதைவிட Better-ஆன வழி இருக்கா?

**Thiru:** அதாவது தேவைப்படும்போது மட்டும் ஓடுற ஒரு architecture. எந்த request-உம் இல்லைன்னா bill zero-வா இருக்கணும்.

**Mahi:** ஆமா, அதுதான் வேணும்.

**Thiru:** அதுக்கு நாம முழுமையான serverless architecture-க்கு போகணும். அதாவது AWS Lambda [AWS Lambda - request வந்தா மட்டும் code-ஐ run பண்ணி bill போடுற service].

**Mahi:** OK, இப்போ ஒரு 'My Todo List' Mobile App இருக்குன்னு நினைச்சுப்போம். users வந்து REST API வழியா data-வை access பண்றாங்க.

**Thiru:** அந்த API Gateway [API Gateway - எல்லா API calls-ஐயும் வாங்கி Lambda-வுக்கு அனுப்புற ஒரு வாசல்] வந்து நேரா AWS Lambda function-ஐ invoke பண்ணும் [Invoke - code-ஐ run பண்ண சொல்றது]. எப்பவும் ஓடிக்கிட்டு இருக்குற Spring Boot-க்கு பதிலா, இது event-driven [Event-driven - ஏதாவது நடந்தா மட்டும் வேலை செய்யுறது].

**Mahi:** அப்போ database-க்கு என்ன பண்றது?

**Thiru:** Amazon DynamoDB [DynamoDB - AWS ஓட serverless NoSQL database] use பண்ணலாம். அதுவும் serverless தான். storage-க்கு S3, authentication-க்கு Cognito [Cognito - user login, sign-up manage பண்ற service] use பண்ணிக்கலாம்.

**Mahi:** இது கேக்க ரொம்ப நல்லா இருக்கு. ஆனா இங்கதான் நான் ஒரு pushback [Pushback - ஒரு விஷயத்துல இருக்குற குறையை சுட்டிக்காட்டுறது] தர போறேன்.

**Thiru:** சொல்லுங்க, என்ன பிரச்சனை?

**Mahi:** நாங்க Java-ல Spring Boot use பண்ணும்போது, அந்த JVM start ஆகுறதுக்கே குறைஞ்சது 5-ல இருந்து 10 seconds ஆகும்.

**Thiru:** ஆமா, Java-வோட ஒரு பெரிய challenge அதுதான்.

## Performance & Trade-offs

**Mahi:** அப்போ Lambda-ல ஒவ்வொரு முறையும் புதுசா function invoke ஆகும்போது, இந்த cold start [Cold start - ரொம்ப நேரமா use பண்ணாத ஒரு Lambda-வை முதன்முதல்ல run பண்ணும்போது ஆகுற தாமதம்] பிரச்சனை வராதா? users 10 seconds காத்துக்கிட்டு இருக்கணுமா?

**Thiru:** இது ஒரு மிக முக்கியமான கேள்வி. Lambda-வோட life cycle-ல மூணு phase இருக்கு: Init, Invoke, அப்புறம் Shutdown.

**Mahi:** அந்த Init phase-ல தான் code download ஆகி environment start ஆகுது இல்லையா?

**Thiru:** ஆமா, அந்த Init phase-ல தான் JVM startup நடக்கும். இதுதான் அந்த 10 second cold start-ஐ உருவாக்குது.

**Mahi:** இது production-ல பெரிய பிரச்சனையாச்சே? இதை AWS எப்படி solve பண்றாங்க?

**Thiru:** இதுக்கு அவங்க கொண்டு வந்த தீர்வுதான் SnapStart. இது ரொம்பவே ஒரு powerful-ஆன feature.

**Mahi:** SnapStart-ஆ? இது எப்படி வேலை செய்யும்?

**Thiru:** நீங்க SnapStart-ஐ enable பண்ணிட்டா, AWS உங்க function-ஐ முன்கூட்டியே pre-initialize [Pre-initialize - request வர்றதுக்கு முன்னாடியே start பண்ணி வைக்கிறது] பண்ணிடும்.

**Mahi:** ஓ, அதாவது அந்த Init phase-ஐ முதல்லயே run பண்ணிடுவாங்களா?

**Thiru:** Correct. JVM start ஆகி ready-ஆனதும், அந்த memory state-ஐ அப்படியே ஒரு snapshot [Snapshot - memory-ல இருக்குற data-வை அப்படியே ஒரு image-ஆ save பண்றது] எடுத்து cache பண்ணிடுவாங்க.

**Mahi:** அடா, இது ஒரு video game-ல ஒரு Level-ஐ முடிச்சுட்டு save பண்ணி வைக்கிற மாதிரி இருக்கே?

**Thiru:** exactly அதேதான். அடுத்த முறை invoke ஆகும்போது, அந்த Init phase இருக்காது. நேரா அந்த snapshot-ல இருந்து resume ஆகி Invoke phase-க்கு போயிடும்.

## Summary

**Mahi:** அப்போ அந்த 10 second latency, milliseconds-ஆ மாறிடும். low latency access-க்கு இது Super.

**Thiru:** ஆமா. இது மட்டுமில்லாம, CloudFront Functions [CloudFront Functions - user-க்கு ரொம்ப பக்கத்துல இருக்கிற server-ல சின்ன சின்ன code-ஐ run பண்றது] அப்புறம் Lambda@Edge மூலமா users-க்கு பக்கத்திலேயே code-ஐ run பண்ணி இன்னும் latency-ஐ குறைக்கலாம்.

**Mahi:** Mind blowing. இப்போ நம்மகிட்ட மூணு options இருக்கு. EC2 இருக்கு, ECS Fargate இருக்கு, Lambda-வும் இருக்கு.

**Thiru:** ஆமா, நிறைய விஷயங்கள் பார்த்துட்டோம்.

**Mahi:** இப்போ ஒரு SAA exam scenario-ல, ஒரு developer-ஆ எப்போ எதை use பண்ணனும்னு எப்படி முடிவு பண்றது? ஒரு சின்ன framework மாதிரி சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா.

**Mahi:** Rule number 1: EC2. உங்களுக்கு OS level-ல full control வேணும், legacy app-ஐ மாத்த முடியாது...

**Thiru:** அப்புறம் முக்கியமா அந்த web sockets மாதிரி long-lived persistent connections [Persistent connections - ரொம்ப நேரத்துக்கு cut ஆகாம இருக்குற connections] வேணும்னா?

**Mahi:** Correct. அப்போ நீங்க EC2 + ASG + ALB with sticky sessions use பண்ணனும். இது the traditional way [The traditional way - பழைய, வழக்கமான முறை].

**Thiru:** OK, அப்போ rule number 2: ECS Fargate?

**Mahi:** நீங்க உங்க Spring Boot app-ஐ Docker-ல package பண்ணிட்டீங்க, ஆனா EC2 servers-ஐ manage பண்ண விரும்பல அப்படின்னா...

**Thiru:** நான் Fargate-ஐ choose பண்ணனும். tasks-ஐ மட்டும் scale பண்ணிக்கலாம், infrastructure தலைவலி இல்ல.

## Interview Deep-Dive Q&A

**Mahi:** exactly. இது the container way [The container way - container முறை]. அப்புறம் rule number 3: Lambda.

**Thiru:** இது எப்பவும் ஓட தேவையில்லை, request வரும்போது மட்டும் run ஆகணும் அப்படிங்கிற scenario-க்கு தானே?

**Mahi:** ஆமா, ஒரு REST API மாதிரி. pay for what you use model வேணும்னா, Lambda + API Gateway use பண்ணுங்க. இது the event-driven way [The event-driven way - event அடிப்படையிலான முறை].

**Thiru:** and மறக்காம, அந்த Java cold start-ஐ தவிர்க்க, SnapStart-ஐ enable பண்ணிக்கணும்.

**Mahi:** ரொம்ப Correct. இந்த மூணு framework-ஐ ஞாபகம் வச்சுக்கிட்டா exam-ல Easy-ஆ முடிவெடுக்கலாம்.

**Thiru:** Super. இன்னைக்கு நாம legacy Java 8 challenges-ல ஆரம்பிச்சு, sticky sessions பத்தி பேசி, Fargate வழியா வந்து, Lambda SnapStart வரைக்கும் deep-ஆ பார்த்துட்டோம்.

**Mahi:** ஆமா, ஒரு முழுமையான architecture journey-ஐ cover பண்ணிருக்கோம்.

**Thiru:** முடிக்கிறதுக்கு முன்னாடி, உங்களுக்காக ஒரு சிந்தனை. இப்போ Lambda-வை வச்சு API calls-ஐ instant-ஆ ஆயிரக்கணக்கான request-க்கு scale பண்ணிடலாம்னு பார்த்தோம்.

**Mahi:** ம்ம், serverless compute-ல அது ரொம்ப Easy.

**Thiru:** ஆனா, அந்த அளவு வேகம் எடுக்கும்போது, பின்னாடி இருக்கிற database, அது ஒரு legacy relational DB-ஆ இருந்தா, அந்த load-ஐ எப்படி தாங்கும்?

**Mahi:** அது ஒரு பெரிய கேள்விதான். ஒரே நேரத்துல ஆயிரம் connections வந்தா DB crash ஆக வாய்ப்பிருக்கு.

**Thiru:** ஆமா, serverless-ல compute-ஐ scale பண்றது Easy, ஆனா data layer-ஐ scale பண்றது? அதை பத்தி யோசிச்சு பாருங்க. மீண்டும் அடுத்த ஆழமான அலசலில் சந்திப்போம்!