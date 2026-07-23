# Episode Title: Data Migration & Disaster Recovery in AWS

## 1. Introduction

**Mahi:** கற்பனை செய்து பாருங்கள், உங்களுடைய e-commerce application-ல ஒரு மிகப்பெரிய flash sale [Flash sale - திடீர்னு ஒரு பெரிய offer போட்டு எல்லாரையும் வாங்க வைக்கிறது] நடந்துட்டு இருக்கு. ஆயிரக்கணக்கான users ஒரே நேரத்துல login பண்றாங்க. கடந்த 10 வருஷமா எந்த பிரச்சனையும் இல்லாம ஒரு ஒற்றை server-ல [Single server - ஒரே ஒரு computer-ல] ஓடிக் கொண்டிருந்த உங்களுடைய legacy Java 8 application [Legacy Java 8 application - பல வருஷமா update பண்ணாம வச்சிருக்கற பழைய Java app] திடீர்னு memory தாங்காம crash ஆகுது [Crash - overload ஆகி வேலை செய்யாம நின்னுடுறது].

**Thiru:** ம்ம்... அந்த out of memory error [Out of memory error - RAM பத்தலன்னு computer காட்டுற error], அது ஒரு nightmare [Nightmare - ரொம்ப மோசமான கனவு மாதிரி ஒரு அனுபவம்].

**Mahi:** ஆமா, Correct. System அப்படியே முடங்கிடும். ஒரு 12 வருஷம் அனுபவம் உள்ள Java backend developer-ஆ [Java Backend Developer - user-க்கு தெரியாத பின்னாடி நடக்குற வேலையை பாக்குற developer] பல இரவுகளை இது போன்ற bugs-ஐ [Bugs - code-ல இருக்கிற தப்புகள்] fix பண்றதுலயே நீங்க கழித்திருக்கலாம். உங்களுடைய அனுபவம் முழுவதும் வந்து Java 8 மற்றும் monolithic applications-ல [Monolithic applications - எல்லா feature-ஐயும் ஒரே code-ல எழுதி வச்சிருக்கற பெரிய app] தான் அதிகமா இருக்கு அப்படிங்கிறதையும் நாங்க உணர்ந்திருக்கோம்.

**Thiru:** கண்டிப்பா. Monolith அப்படிங்கறது ஒரு comfort zone [Comfort zone - பழகிப்போன ரொம்ப வசதியான இடம்] மாதிரி ஆயிடுச்சு பல பேருக்கு.

**Mahi:** Exactly. ஆனா அதே application-ஐ எந்த code மாற்றமும் இல்லாம automatically traffic-ஐ சமாளிக்கும் ஒரு cloud architecture-க்கு [Cloud architecture - cloud-ல app எப்படி இயங்கணும்னு design பண்றது] எப்படி மாற்றுவது? அதுதான் இந்த deep dive-ல நாம அலசப் போற விஷயம்.

**Thiru:** ரொம்ப சுவாரஸ்யமான டாபிக் இது.

**Mahi:** உங்களுடைய legacy code-ஐ AWS-க்கு migrate செய்து [Migrate - பழைய இடத்துல இருந்து புது இடத்துக்கு மாத்துறது], ஒரு three-tier architecture-ஆ [Three-tier architecture - மூணு அடுக்கா பிரிச்சு application-ஐ design பண்றது] மாற்றி, முக்கியமா Solutions Architect Associate (SAA) exam point of view-ல அதை எப்படி design பண்றது அப்படிங்கறத தான் இன்னைக்கு ஆழமா பார்க்கப் போறோம்.

## 2. The Core Concept (என்ன, ஏன்?)

**Thiru:** இப்போ இந்த monolith to cloud transition [Monolith to cloud transition - பழைய app-ஐ cloud-க்கு மாத்துற பயணம்] வந்து நிறைய நிறுவனங்கள் சந்திக்கிற ஒரு பெரிய சவால். நீங்க சொன்ன அந்த single server model-ல ஒரு பெரிய சிக்கல் இருக்கு. Actually உங்க UI [User Interface - user பாக்குற design], business logic [Business logic - app எப்படி வேலை செய்யணும்னு எழுதுற code], அப்புறம் database-னு [Database - data-வை சேமிக்கிற இடம்] எல்லாமே அந்த ஒரே JVM-ல [JVM - Java Virtual Machine, Java code-ஐ run பண்ற software], அதாவது ஒரே machine-ல தான் run ஆகும். இதையே தான் நாம monolith-னு சொல்றோம்.

**Mahi:** ஓகே, அப்போ அத அப்படியே தூக்கி AWS-ல ஒரு பெரிய EC2 instance-ல [EC2 instance - AWS-ல வாடகைக்கு எடுக்குற virtual computer] போட்டா வேலை முடிஞ்சது இல்லையா?

**Thiru:** அதுதான் தப்பு. அப்படி போட்டா அது cloud கிடையாது, அது வெறும் hosting [Hosting - நம்ம app-ஐ சும்மா அவங்க computer-ல வைக்கிறது] தான். நீங்க cloud-ஓட உண்மையான பலனை அடையணும்னா, நம்ம source material பரிந்துரைக்கும் அந்த web app 3-tier architecture-க்கு மாறணும்.

## 3. Real-world Example / Analogy

**Mahi:** ம்ம்... ஒரு நிமிஷம், இந்த 3-tier concept-ஐ நான் இப்படி பார்க்கிறேன். இதுவரைக்கும் நம்ம application வந்து ஒரு பெரிய பங்களா மாதிரி இருந்துச்சு. சமையலறை, படுக்கையறை, ஹால்னு எல்லாமே ஒரே கூரைக்கு கீழே. ஒரு அறையில தீ பிடிச்சா மொத்த வீடும் காலி.

**Thiru:** Correct-ஆன analogy. ஆனா three-tier அப்படிங்கறது, ஒரு அடுக்குமாடி குடியிருப்பு மாதிரி. வாட்ச்மேன் இருக்கிற இடம் ஒரு layer, வீடுகள் இருக்கிறது ஒரு layer, லாக்கர் ரூம் இருக்கிற இடம் இன்னொரு layer. இதை AWS-ல எப்படி பிரிப்பாங்க?

**Mahi:** இப்போ, அந்த அடுக்குமாடி குடியிருப்பின் ஒவ்வொரு layer-ஐயும் நாம AWS-ல subnets-னு [Subnets - ஒரு பெரிய நெட்வொர்க்கை சின்ன சின்ன பகுதிகளா பிரிக்கிறது] பிரிக்கிறோம். முதலாவது வந்து public subnet [Public subnet - internet-ல இருந்து நேரடியா access பண்ணக்கூடிய இடம்]. இதுதான் உங்க வாட்ச்மேன் கேட் மாதிரி. இங்கதான் ELB, அதாவது Elastic Load Balancer [Elastic Load Balancer - வர்ற traffic-ஐ எல்லா server-க்கும் பிரிச்சு கொடுக்கிற system] இருக்கும். Internet-ல இருந்து வர்ற traffic-ஐ உள்வாங்கி, பாதுகாப்பான முறையில உள்ளே அனுப்பும்.

**Thiru:** ஓகே, அப்போ business logic எங்க இருக்கும்?

**Mahi:** அது அடுத்த layer, அதாவது private subnet [Private subnet - internet-ல இருந்து நேரடியா access பண்ண முடியாத secure இடம்]. இங்கதான் உங்க application-ஓட இதயம், like உங்க Java Spring Boot அல்லது அந்த legacy business logic run ஆகும். இத நாம Auto Scaling Group (ASG) [Auto Scaling Group - traffic ஏத்த மாதிரி servers-ஐ கூட்டவோ குறைக்கவோ செய்யுற system] மூலமா பல EC2 instances-ஆ இயங்க வைப்போம்.

**Thiru:** அப்போ database, அதுக்கு தனி layer-ஆ?

**Mahi:** கண்டிப்பா. மூன்றாவதா data subnet. இங்க internet connection-ஏ இருக்காது. இதுலதான் Amazon RDS, அப்புறம் ElastiCache மாதிரி database services எல்லாம் பாதுகாப்பா இயங்கும்.

**Thiru:** இது கேக்குறதுக்கு ரொம்ப நல்லா இருக்கு. ஆனா எனக்கு ஒரு கேள்வி இருக்கு. Traffic அதிகமாகும்போது, ஏன் இந்த three-tier subnets-னு இவ்வளவு சிக்கலான design-க்கு போகணும்? ரொம்ப சிம்பிளா அந்த ஒற்றை server-ஓட RAM அப்புறம் CPU-வை அதிகப்படுத்திட்டு போலாமே? நாமெல்லாம் vertical scaling [Vertical scaling - இருக்குற computer-லயே அதிக RAM, CPU மாத்துறது] பண்ணிதானே பழகியிருக்கோம்?

**Mahi:** அதோட, server-ஐ upgrade செய்யணும்னா நீங்க system-ஐ down செய்யணும். உங்களுக்கு downtime [Downtime - system வேலை செய்யாம off-ல இருக்குற நேரம்] வரும்.

**Thiru:** ஆமா, night-ல maintenance window [Maintenance window - யாருக்கும் தெரியாம ராத்திரியில system-ஐ update பண்ற நேரம்] போடுவோம்.

**Mahi:** Exactly. ஆனா இந்த three-tier architecture-ல, நாம horizontal scaling-ஐ [Horizontal scaling - ஒரே மாதிரி நிறைய servers-ஐ புதுசா சேர்க்கிறது] use பண்றோம். Traffic அதிகமானா அந்த Auto Scaling Group தானாகவே புதிய EC2 instances-ஐ உருவாக்கும். குறைவானா அதை அழிச்சிடும். இதைவிட முக்கியம் என்னன்னா, இந்த instances-ஐ ஒரே data center-ல வைக்க மாட்டோம்.

**Thiru:** ஓ, பிரிச்சு வைப்பீங்களா?

**Mahi:** ஆமா, பல Availability Zones-ல [Availability Zones - ஒரே ரீஜனுக்குள்ள இருக்குற தனித்தனி data centers], அதாவது Multi-AZ-ல பரவலாக்கி வைப்போம். இப்போ ஒரு முழு data center-ஏ current இல்லாம போனாலும், இன்னொரு AZ-ல உங்க code எந்த தடங்கலும் இல்லாம run ஆயிட்டு இருக்கும்.

**Thiru:** வாவ், இதுதான் அந்த High Availability [High Availability - எப்பவும் down ஆகாம ஓடிக்கிட்டே இருக்குறது]. நீங்க SAA exam எழுத போறீங்க அப்படின்னா, இந்த concept ரொம்ப ரொம்ப முக்கியம். Exam கேள்விகள்ல அந்த 'High Availability' அல்லது 'Fault tolerance' [Fault tolerance - system-ல ஏதாவது தப்பானாலும் நின்னுடாம வேலை செய்யுறது] அப்படிங்கிற வார்த்தைகளை பார்த்தாலே, அங்க Multi-AZ deployment தான் சரியான தீர்வா இருக்க முடியும்.

## 4. Edge Cases & Tricky Scenarios

**Mahi:** நூற்றுக்கு நூறு உண்மை. சரி, இப்போ நாம பல servers-ஐ auto scaling மூலமா உருவாக்குறோம்னு வச்சுக்குவோம். ஒரு Java developer-ஆ எனக்கு இங்க ஒரு பெரிய இடிக்காத்து இருக்கு.

**Thiru:** என்ன சிக்கல்னு நினைக்கிறீங்க?

**Mahi:** Session management [Session management - ஒரு user login பண்ணதுக்கு அப்புறம் அவரோட data-வை தொடர்ந்து ஞாபகம் வச்சுக்கிறது]. அதான் பெரிய தலைவலி. பழைய Java applications-ல, ஒரு user login பண்ணினா, அவரோட session data-வை, உதாரணத்துக்கு shopping cart-ல என்னென்ன பொருட்கள் இருக்கு அப்படிங்கறதை, நாம அந்த குறிப்பிட்ட server-ஓட local memory-ல, அதாவது HTTP session-ல [HTTP Session - user-ஓட details-ஐ server-லயே temporarily save பண்ற இடம்] தான் save பண்ணுவோம்.

**Thiru:** ஆமா, monolith-ல அதான் வழக்கம்.

**Mahi:** இப்போ ASG மூலமா அஞ்சு server run ஆகுதுன்னு வைங்க. User முதல் server-ல login பண்றாரு, cart-ல பொருட்களை போடுறாரு. திடீர்னு traffic குறைஞ்சதால ASG அந்த முதல் server-ஐ scale in [Scale in - தேவையில்லாத server-ஐ அழிச்சிடுறது] பண்ணி அழிச்சிடுது. இப்போ அந்த user-ஓட session என்ன ஆகும்? அடுத்த click-க்கு அவர் வேறொரு server-க்கு போகும்போது அவரோட cart காலியா இருக்குமே?

**Thiru:** மிக அருமையான point. ஒரு monolith-ஐ cloud-க்கு மாத்தும்போது developers பண்ற மிகப்பெரிய தப்பே இதுதான். இதை சரி பண்றதுக்கு 'decoupling' [Decoupling - ஒன்னோட ஒன்னு ஒட்டிக்கிட்டு இருக்குற system-ஐ தனித்தனியா பிரிக்கிறது] அப்படிங்கிற ஒரு உத்தியை நாம கையாளணும்.

**Mahi:** Decoupling-னா, தனித்து பிரிக்கிறது, Correct-ஆ?

**Thiru:** ஆமா. உங்க EC2 instances-ல எந்த state-ஐயும், அதாவது session information-ஐயும் வச்சிருக்கக் கூடாது. உங்க application-ஐ completely stateless-ஆ [Stateless - user data-வை server-ல save பண்ணாம வெளியில வைக்கிறது] மாத்தணும்.

**Mahi:** Stateless ஆக்கணுமா? அப்போ session data-வை எங்க கொண்டு போய் சேமிக்கிறது? Database-லயா?

## 5. Performance & Trade-offs

**Thiru:** Database-ல சேமிக்கலாம், ஆனா latency [Latency - data போய் சேர ஆகுற நேரம்] அதிகமாகும். ஒவ்வொரு click-க்கும் database-ஐ தேடிட்டு போனா, performance ரொம்ப அடிவாங்கும். இதுக்குத்தான் Amazon ElastiCache பயன்படுது. Like Redis அல்லது Memcached.

**Mahi:** ஓ, in-memory cache-ஆ [In-memory cache - RAM-லயே data-வை save பண்ணி ரொம்ப fast-ஆ எடுக்குறது]?

**Thiru:** Exactly. இது ஒரு in-memory cache. உங்க EC2 instances session data-வை தன்னோட local memory-ல வைக்கிறதுக்கு பதிலா, இந்த ElastiCache-ல எழுதிடும். இப்போ எந்த server அழிக்கப்பட்டாலும், session data பத்திரமா அங்கேயே இருக்கும்.

**Mahi:** Super. அப்போ user வேற server-க்கு மாறும்போது, அந்த புது server நேரா ElastiCache-ல இருந்து millisecond-ல session data-வை எடுத்துக்கும். எந்த data loss-ம் இருக்காது.

**Thiru:** Correct. இது மூலமா auto scaling ரொம்ப smooth-ஆ நடக்கும். இதையே SAA exam கேள்வியா பார்த்தோம்னா, 'ஒரு application-ஐ stateless ஆக்கணும், store and retrieve session data with sub-millisecond latency, இல்லனா decoupling session state' அப்படின்னு வந்தா, நம்ம கண்ணை மூடிக்கிட்டு Amazon ElastiCache-ஐ தேர்ந்தெடுக்கணும் இல்லையா?

**Mahi:** சரியா சொன்னீங்க. இதே logic-தான் database-க்கும். நீங்க நேரா ஒரு EC2-ல போய் MySQL அல்லது Oracle-ஐ install பண்ணி பயன்படுத்தலாம். ஆனா அதுக்கு backup எடுக்குறது, OS patch பண்றது [OS patch - operating system-ஐ update பண்றது], Multi-AZ replication [Multi-AZ replication - data-வை பல இடங்கள்ல copy பண்ணி வைக்கிறது] set பண்றதுன்னு எல்லா தலைவலியும் உங்களைத்தான் சேரும்.

**Thiru:** ஆமா, அதெல்லாம் பெரிய admin வேலை.

**Mahi:** அதுக்கு பதிலா Amazon RDS, அதாவது Relational Database Service அப்படிங்கிற ஒரு managed service-ஐ [Managed service - admin வேலையெல்லாம் AWS-ஏ பாத்துக்குற service] பயன்படுத்தினா, இந்த வேலைகளை எல்லாம் AWS-ஏ பாத்துக்கும். நீங்க உங்க Java code-ல சும்மா அந்த JDBC URL-ஐ மட்டும் மாத்தினா போதும்.

## 6. Alternatives (எப்போ எதை use பண்ணனும்?)

**Thiru:** ஓகே, logically பார்த்தா இப்போ நம்மளோட பழைய monolith ஒரு hi-tech three-tier cloud application-ஆ மாறிடுச்சு. Load balancer இருக்கு, auto scaling இருக்கு, ElastiCache அப்புறம் RDS இருக்கு. ஆனா ஒரு நிமிஷம் யோசிச்சு பாருங்க, இவ்வளவு services-ஐ நாம உருவாக்கிட்டோம். மாசக் கடைசில bill வரும்போது கம்பெனி CFO-க்கு heart attack வராதா?

**Mahi:** நல்ல கேள்வி. நிறைய பேர் cloud-க்கு வந்துட்டு bill பார்த்து பயப்படுறது உண்டு.

**Thiru:** அதான், இந்த architecture-ஐ எப்படி சரியா, பாதுகாப்பா, அப்புறம் முக்கியமா குறைந்த செலவுல maintain பண்றது?

**Mahi:** இந்த இடத்துல தான் AWS-ஓட Governance மற்றும் Optimization tools உள்ளே வருது. நம்ம source material-ல மூணு முக்கியமான tools பத்தி ரொம்ப தெளிவா குறிப்பிட்டிருக்காங்க. ஒன்னு AWS Well-Architected Tool, ரெண்டாவது AWS Trusted Advisor, அப்புறம் மூணாவது Instance Scheduler.

**Thiru:** எனக்கு இந்த இடத்துல ஒரு confusion இருக்கு. இந்த Trusted Advisor-க்கும் Well-Architected Tool-க்கும் என்ன வித்தியாசம்? ரெண்டுமே நம்மளோட AWS account-ஐ review பண்ற tools தானே?

**Mahi:** ஆமா, ஆனா approach வேற. அதாவது, Trusted Advisor தானாகவே என் account-ஐ scan பண்ணி, 'இந்த port open-ல இருக்கு இதை மூடுங்க, இந்த server சும்மாதான் ஓடுது இதை நிப்பாட்டுங்க' அப்படனு real-time-ல advice கொடுத்துடும். அப்படி இருக்கும்போது, நான் எதுக்காக Well-Architected Tool-ல உக்காந்து manually கேள்விகளுக்கு பதில் சொல்லணும்?

**Thiru:** இது நிறைய developers-க்கு வர்ற குழப்பம் தான். இதை நான் ஒரு சின்ன உதாரணத்தோட சொல்றேன். Trusted Advisor அப்படிங்கறது வந்து ஒரு spell checker மாதிரி.

**Mahi:** Spell checker, MS Word-ல வர்ற மாதிரியா?

**Thiru:** ஆமா. நீங்க எழுதுன document-ல எங்க spelling தப்பா இருக்கு, எங்க grammar mistake இருக்கு அப்படிங்கறதை அதுவே automatically கண்டுபிடிச்சு சொல்லிடும். Cost, performance, security, fault tolerance, அப்புறம் service limits-னு ஒரு அஞ்சு பிரிவுகள்ல இது உங்க account-ஐ scan பண்ணும்.

**Mahi:** ஓகே, புரியுது.

**Thiru:** ஆனா, Well-Architected Tool அப்படிங்கறது வந்து ஒரு editor மாதிரி, ஒரு மனுஷன் படிக்கிற மாதிரி. ஓஹோ, editor-ஆ? ஆமா. உங்க document-ஓட கதைக்களம் சரியா இருக்கா, நீங்க சொல்ல வர்ற கருத்து சரியா போய் சேருதான்னு ஆராயும். இந்த tool தானா எதையும் scan பண்ணாது. அது உங்களை நோக்கி சில ஆழமான கேள்விகளை கேட்கும்.

**Mahi:** Like என்ன மாதிரி கேள்விகள்?

**Thiru:** உதாரணத்துக்கு, ஒரு system down ஆனா, உங்க team எப்படி react பண்ணுவாங்க? உங்ககிட்ட ஒரு proper-ஆன incident response plan இருக்கா? அப்படின்னு கேட்கும். இது ஒரு system எப்படி design செய்யப்பட்டிருக்கு அப்படிங்கறதை ஒரு ஆறு தூண்களோட அடிப்படையில, அதாவது six pillars-னு [Six pillars - AWS design பண்றதுக்கான ஆறு முக்கிய விதிகள்] சொல்வாங்க, அதோட அடிப்படையில review பண்ற ஒரு framework.

**Mahi:** Actually அந்த ஆறு pillars என்னென்ன? Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, அப்புறம் Sustainability. Correct-ஆ?

**Thiru:** Exactly. இந்த ஆறு pillars தான் ஒரு நல்ல architecture-க்கு அஸ்திவாரம்.

**Mahi:** Super analogy. அப்போ Trusted Advisor அப்படிங்கறது வந்து ஒரு tactical tool, ஒரு technical audit மாதிரி. Well-Architected Tool அப்படிங்கறது strategic, ஒரு process review மாதிரி. SAA exam எழுதுறவங்க இந்த வித்தியாசத்தை ரொம்ப ஆழமா புரிஞ்சுக்கணும்.

**Thiru:** கண்டிப்பா. அதுவே 'Review workloads against architectural best practices' அப்படின்னு கேட்டா விடை Well-Architected Tool. சரி. இப்போ மூணாவதா ஒரு tool சொன்னீங்களே, Instance Scheduler. அது என்ன பண்ணும்?

**Mahi:** ஆமா, Instance Scheduler on AWS. இது வந்து ஒரு readymade CloudFormation template [CloudFormation template - infrastructure-ஐ automatically உருவாக்குற code]. சும்மா யோசிச்சு பாருங்க, உங்க கம்பெனில QA அப்புறம் development servers நிறைய இருக்கலாம். அதெல்லாம் developers பகல்ல மட்டும்தானே use பண்ணுவாங்க?

**Thiru:** ஆமா, evening ஆனா log off பண்ணிட்டு போயிடுவாங்க.

**Mahi:** ஆனா server ஓடிட்டுதானே இருக்கும்? நைட் 8 மணில இருந்து காலையில 8 மணி வரையும், அப்புறம் weekends-லயும் அந்த servers சும்மாதான் ஓடிட்டு இருக்கும். அதுக்கும் நீங்க bill கட்டிட்டு இருப்பீங்க.

**Thiru:** ஓ, அது ஒரு பெரிய wastage ஆச்சே.

**Mahi:** அதை manually start, stop பண்றதுக்கு பதிலா, அல்லது நீங்களே கஷ்டப்பட்டு ஒரு cron job எழுதுறதுக்கு பதிலா, இந்த Instance Scheduler-ஐ பயன்படுத்தலாம். இதுவே குறிப்பிட்ட நேரத்துல servers-ஐ start மற்றும் stop செஞ்சிடும். இது உங்க compute செலவுல ஒரு பெரிய அளவை மிச்சப்படுத்தும்.

**Thiru:** ஆஹா, infrastructure செலவுகளை கணிசமா குறைச்சிட்டோம். System-ம் stable-ஆ இருக்கு. இப்போ, இப்படி செலவை குறைக்கிறது மூலமா கிடைக்கிற பணத்தையும் நேரத்தையும் வச்சுக்கிட்டு, business-ஐ அடுத்த கட்டத்துக்கு நகர்த்துறோம் இல்லையா? இப்போ, திடீர்னு உங்க CEO வந்து, நம்ம application-ல AI, அதாவது Artificial Intelligence அப்புறம் Machine Learning-ஐ (ML) கொண்டு வாங்கன்னு சொல்றாருன்னு வைங்க.

**Mahi:** அது இப்போ எல்லா கம்பெனிலயும் நடக்குறது தான். ஆனா ஒரு 12 வருஷ Java backend developer-ஆ இது கொஞ்சம் கலகமான விஷயம்தான். ஏன்னா நமக்கு Python அவ்வளவா தெரியாது, neural networks பத்தி idea கிடையாது. ஆனா நம்ம source material-ல AWS-ஓட managed ML services மூலமா இது ரொம்ப எளிதா செய்யலாம்னு சொல்லப்பட்டிருக்கே.

**Thiru:** உண்மைதான். நீங்க ஒரு data scientist-ஆகவோ, அல்லது ML models-ஐ scratch-ல இருந்து எழுதவும் வேண்டிய அவசியமே இல்லை. AWS வந்து பல ML services-ஐ API மூலமா பயன்படுத்தும் வகையில ready-ஆ கொடுத்திருக்காங்க.

**Mahi:** ஓகே, அப்போ SAA exam-லயும் சரி, real world-லயும் சரி, எந்த business problem-க்கு எந்த AWS service அப்படிங்கறத மட்டும் நாம match பண்ண தெரிஞ்சிருந்தா போதுமா?

**Thiru:** Exactly, அதுதான் அவங்க எதிர்பார்க்குறாங்க.

## 7. Summary (1-minute recap)

**Mahi:** Super. இதை சில நிஜ business சூழ்நிலைகளை வச்சு நாம ஒரு rapid fire மாதிரி பாப்போம். என்னுடைய முதல் scenario. இப்போ நம்மகிட்ட மாணவர்களை பத்தின பல வருஷ data இருக்கு. அவங்களோட IT அனுபவம் என்ன, அவங்க ஒரு நாளைக்கு எவ்வளவு நேரம் படிக்கிறாங்க, எந்தெந்த tests-ல என்ன mark வாங்கியிருக்காங்க அப்படிங்கிற database இருக்கு.

**Thiru:** ம்ம்... historical data.

**Mahi:** ஆமா. இதை வச்சு ஒரு புது மாணவர் SAA exam-ல pass ஆவாரா இல்லையா அப்படிங்கறத கணிக்கும், அதாவது predict பண்ணும் ஒரு custom model-ஐ நான் உருவாக்கணும். இதுக்கு எந்த service best?

**Thiru:** இங்க நீங்க உங்களுடைய சொந்த data-வை வச்சு ஒரு custom model-ஐ build பண்ணி, train பண்ணி, tune பண்ணனும்னு சொல்றீங்க. இதுக்கு Amazon SageMaker தான் சரியான விடை. இது developers-க்கும் data scientists-க்கும் models-ஐ உருவாக்க தேவையான முழுமையான environment-ஐ கொடுக்கும் ஒரு fully managed service.

**Mahi:** ஓகே, custom model அப்படின்னா SageMaker. இது clear. இப்போ என்னுடைய அடுத்த scenario கொஞ்சம் வித்தியாசமானது. என்னுடைய கம்பெனில, MS OneDrive, SharePoint, அப்புறம் பல internal wiki pages-ல ஆயிரக்கணக்கான documents சிதறி கிடக்கு.

**Thiru:** எல்லா enterprise-லயும் நடக்குறது தான். தேடினா எதுவும் கிடைக்காது.

**Mahi:** ஆமா, HR Policy எங்க இருக்கு அப்படின்னோ அல்லது IT support desk-ஐ எப்படி தொடர்பு கொள்வது அப்படின்னோ சாதாரணமா மனுஷங்க கிட்ட கேக்குற மாதிரி, அதாவது natural language-ல type பண்ணினா, system அந்த documents எல்லாம் அலசி சரியான பதிலை சொல்லணும். ஒரு enterprise knowledge search engine எனக்கு வேணும். இதுக்கு நாம SageMaker-ஐ வச்சு model train பண்ணனுமா?

**Thiru:** கிடையவே கிடையாது. இதுக்கு நீங்க எந்த model-ஐயும் train பண்ண தேவையே இல்லை. இதுக்கு Amazon Kendra அப்படிங்கிற service-ஐ பயன்படுத்தணும்.

**Mahi:** Kendra-வா? அது என்ன பண்ணும்?

**Thiru:** Kendra அப்படிங்கறது machine learning-ஐ பின்புலமாக கொண்ட ஒரு அறிவார்ந்த தேடுபொறி. அதாவது ஒரு intelligent search. இது வெறும் keywords-ஐ மட்டும் வச்சு தேடாம, நீங்க கேக்குற கேள்வியோட அர்த்தத்தை, அதாவது semantic search-னு சொல்வாங்க, அதை புரிஞ்சுகிட்டு உங்களுடைய internal documents-ல இருந்து துல்லியமான பதிலை எடுத்துக் கொடுக்கும்.

**Mahi:** வாவ், அப்படியானா Java code-ல ஒரு API call மூலமாவே ஒரு AI search engine-ஐ நம்மால உருவாக்கிட முடியும். ரொம்ப powerful.

**Thiru:** ஆமா, எந்த ML knowledge-ம் இல்லாம.

**Mahi:** சரி, கடைசி scenario. இது ஒரு e-commerce application சார்ந்த கேள்வி. ஒரு user நம்ம site-ல தோட்டம் அமைப்பதற்கான அந்த gardening tools-னு சொல்வோம்ல, அந்த பொருட்களை வாங்குறாரு. அவருக்கு அடுத்ததா உரம் அல்லது செடிகளை நாம பரிந்துரைக்கணும். அதாவது real-time personalized recommendations கொடுக்கணும். ஆனா எனக்கு ML model எழுத நேரமில்லை. சில நாட்கள்லயே இது live போகணும். இதுக்கு என்ன பண்றது?

**Thiru:** நீங்க amazon.com-ல ஏதாவது வாங்கும்போது, 'Customers who bought this also bought' அப்படின்னு காட்டுவாங்க இல்லையா?

**Mahi:** ஆமா, நிறைய வாட்டி நான் அத பாத்து வாங்கிருக்கேன்.

**Thiru:** அதே technology-ஐ தான் AWS வந்து developers-க்கு Amazon Personalize அப்படிங்கிற பேர்ல கொடுக்குறாங்க. நீங்க users-ஓட click data மற்றும் purchase data-வை மட்டும் இதுக்கு கொடுத்தா போதும். எந்த பொருளை யாருக்கு பரிந்துரைப்பது அப்படிங்கறதை அதுவே பின்புலத்தில் matrix factorization போன்ற algorithms-ஐ பயன்படுத்தி பாத்துக்கும்.

**Mahi:** இது ரொம்ப ரொம்ப practical-ஆ இருக்கு. இப்போ கேட்டுட்டு இருக்குறவங்க அந்த SAA exam decision point-ஐ நல்லா கவனிச்சுக்கோங்க. Custom model build பண்ணனும் அல்லது train பண்ணனும் அப்படின்னா உங்க விடை SageMaker. Enterprise AI search அல்லது natural language search வேணும்னா Kendra. Real-time product recommendation வேணும்னா Personalize.

**Thiru:** Perfect summary.

**Mahi:** சரி, இப்போ நம்மகிட்ட பலமான ஒரு backend இருக்கு, AI வசதிகளும் வந்திடுச்சு. ஆனா இதையெல்லாம் வச்சுக்கிட்டு கடைசியில users-க்கு ஒரு website அல்லது mobile app கொடுக்கணும் இல்லையா? ஒரு Java developer-ஆ, front end team ஒரு புது React application-ஐயோ அல்லது ஒரு iOS app-ஐயோ கொண்டு வரும்போது, அதுக்கான authentication [Authentication - user correct-ஆன password தான் தராங்களான்னு check பண்றது], API integration [API Integration - frontend-ஐயும் backend-ஐயும் இணைக்கிறது] எல்லாத்தையும் நாமே manually set பண்றது வந்து ஒரு பெரிய வேலை. இதை AWS எப்படி எளிதாக்குது?

**Thiru:** இந்த இடத்துல தான் AWS Amplify அப்படிங்கிற service வருது. Front end developers, அதாவது React, Vue, iOS, Android developers, மிக எளிதா AWS backend-ஓட இணைக்கிறதுக்கு இது பயன்படுது.

**Mahi:** ஓ, அவங்களே பண்ணிப்பாங்களா?

**Thiru:** ஆமா, ஒரு சில commands மூலமாவே authentication-க்கு Cognito, storage-க்கு S3, மற்றும் API-களுக்கு AppSync அல்லது API Gateway-வை அவங்களாலயே set பண்ணிட முடியும். Backend அமைப்புகளைப் பத்தி அவங்க ரொம்ப கவலைப்பட தேவையில்லை.

**Mahi:** அப்படியானா Amazon AppFlow அப்படிங்கறது எதற்கு? Source data-வுல அதைப் பற்றியும் ஒரு முக்கியமான குறிப்பு இருக்கே. இது ரெண்டும் ஒன்னா?

## 8. Interview Deep-Dive Questions

**Q:** Salesforce, Zendesk போன்ற SaaS applications-ல இருந்து AWS S3-க்கு data-வை கொண்டு வரணும். Code எழுதாம இதை எப்படி செய்வீங்க?
*Answer:* இதுக்கு [Amazon AppFlow](#6-alternatives-எப்போ-எதை-use-பண்ணனும்) தான் சிறந்த தீர்வு. சாதாரணமா ஒரு Java application அல்லது Python script எழுதி API-ஐ call பண்ணி, JSON-ஐ parse செய்து S3-க்கு upload பண்றதுக்கு பதிலா, AppFlow மூலமா UI-ல source அப்புறம் destination-ஐ configure செஞ்சாலே போதும். எந்த code-ம் எழுத தேவையில்லை.

<br>💡 **Follow-up:** **AWS Amplify**-க்கும் **Amazon AppFlow**-க்கும் என்ன வித்தியாசம்?
*Answer:* Scalable full-stack web and mobile app deployment with backend integration அப்படின்னா விடை AWS Amplify. Secure data transfer between SaaS and AWS without writing integration code அப்படிங்கிற requirement வந்தா விடை Amazon AppFlow.

## Quick Revision Summary

**Mahi:** இப்போ இந்த முழு பயணத்தையும் ஒரு முறை திரும்பி பாருங்க. ஒற்றை server-ல முடங்கி கிடந்த ஒரு legacy Java 8 application-ஐ, இப்போ எப்பேர்ப்பட்ட traffic-ஐயும் தாங்கக்கூடிய ஒரு cloud-native application-ஆ நாம மாத்திட்டோம். இந்த analysis முழுவதும் நாம பார்த்தது வெறும் tools மற்றும் services-ஐ பத்தி மட்டும் அல்ல. ஒரு சரியான cloud architecture-ஐ எப்படி approach பண்றது, எப்படி யோசிக்கிறது அப்படிங்கறதை பத்தி தான். Multi-AZ, ASG, RDS மற்றும் ElastiCache மூலமா எப்படி high availability மற்றும் decoupling-ஐ கொண்டு வர்றது. Trusted Advisor மற்றும் Well-Architected Tool மூலமா எப்படி system-ஐ review பண்றது. அப்புறம் SAA exam-க்கான ML services, decision points அனைத்தையும் மிக ஆழமா பார்த்துட்டோம்.

**Thiru:** கண்டிப்பா, இது ஒரு complete package.

**Mahi:** Source material-ல என்னை மிகவும் கவர்ந்த ஒரு அருமையான வரி ஒன்னு இருக்கு. 'All the developers want is for their code to run'.

**Thiru:** ரொம்ப உண்மையான வார்த்தைகள்.

**Mahi:** ஆமா, ஒரு developer-க்கு தேவையெல்லாம், அவர் எழுதுன code எந்த பிரச்சனையும் இல்லாம அமைதியா run ஆகணும் அப்படிங்கறது மட்டுமே. இன்னைக்கு நாம design செய்த இந்த auto scaling, self-healing [Self-healing - system தனக்குத்தானே பிரச்சனையை சரி பண்ணிக்கிறது] AWS architecture மூலமா, உங்களுடைய legacy Java code-க்கு, தான் ஒரு cloud-ல பல servers-ல பிரிஞ்சு இயங்குறோம் அப்படிங்கறதே தெரியாது. அந்த code பாட்டுக்கு அமைதியா run ஆயிக்கொண்டே இருக்கும்.

**Thiru:** அதான் cloud-ஓட beauty. Infrastructure உங்களை விட்டு மறைஞ்சிடும்.

**Mahi:** Exactly. இந்த deep dive-ஐ முடிக்கும் முன் ஒரு சிந்தனையை உங்ககிட்ட விட்டுச் செல்கிறேன். உங்களுடைய தற்போதைய legacy workflow-ல இது போல infrastructure கவலைகள் எல்லாம் மறந்துட்டு, உங்களுடைய முழு கவனத்தையும் வெறும் business logic-ல மட்டுமே செலுத்துறதுக்கு எந்தெந்த பகுதிகளை AWS managed services மூலமா 100% automate செய்ய முடியும்னு யோசிச்சு பாருங்க. உங்களுடைய அடுத்த architecture design அங்கிருந்து தான் தொடங்கப் போகுது. மீண்டும் ஒரு சுவாரஸ்யமான deep dive-ல் சந்திப்போம்.