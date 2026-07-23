# Episode Title: Monitoring, Auditing & Secrets Management in AWS

## 1. Introduction

**Mahi:** வணக்கம், இந்த ஆழமான அலசலுக்கு உங்களை வரவேற்கிறோம். இப்போ உங்களுடைய sources-அ அடிப்படையா வச்சு, உங்களுக்காகவே ஒரு special-ஆன segment இது. நீங்க பாத்தீங்கன்னா production applications-ல Datadog, அப்புறம் Spring Boot Actuator, இதெல்லாம் use பண்ணி monitoring, health checks, metrics எல்லாம் track பண்ற ஒரு expert.

**Thiru:** Exactly. அதாவது உங்க application-ல நடக்குற ஒவ்வொரு விஷயமும் உங்க விரல் நுனியில இருக்கு. ஆனா இப்போ, இந்த practical knowledge-அ அப்படியே AWS cloud environment-க்கு எப்படி map பண்றது அப்படிங்கறது தான் இந்த அலசலோட முக்கிய நோக்கம்.

**Mahi:** ஆமா, இப்போ நீங்க உங்க தற்போதிய microservices [Microservices - ஒரு பெரிய app-அ சின்ன சின்ன தனித்தனி பகுதிகளா பிரிச்சு வேலை செய்ய வைக்கிற architecture] setup-ல face பண்ற அந்த monitoring [Monitoring - system எப்படி வேலை செய்யுதுன்னு தொடர்ந்து கவனிக்கிறது], audit [Audit - system-ல யார் என்ன பண்ணாங்கன்னு record பண்றது], logging [Logging - system-ல நடக்குற events-அ எழுதி வைக்கிறது], அப்புறம் configuration drift [Configuration drift - நாம set பண்ண settings நாளடைவுல தப்பா மாறிப்போறது], secrets management [Secrets management - password, access key மாதிரி sensitive data-வை பாதுகாப்பா வைக்கிறது] சவால்களை வந்து...

**Thiru:** Correct. அதை AWS-உடைய native tools, அதாவது CloudWatch, CloudTrail, AWS Config, KMS, SSM, இதெல்லாம் எப்படி Easy-ஆ தீர்க்குது அப்படின்னு நாம decode பண்ண போறோம்.

**Mahi:** அதுமட்டுமில்லாம நீங்க SAA, அதாவது Solutions Architect Associate exam-க்கு Ready-ஆயிட்டு இருக்கீங்க இல்லையா? So, அதுக்கு தேவையான முக்கியமான security scenarios-யும் நம்ம வழியில cover பண்ணுவோம்.

**Thiru:** கண்டிப்பா. So, Straight-ஆ topic-குள்ள போயிடலாம். இப்போ monitoring and alerting-ல இருந்தே ஆரம்பிப்போம். நீங்க Spring Boot Actuator-ல இருந்து custom metrics [Custom metrics - நம்ம தேவைக்கேற்ப நாமளே உருவாக்குற அளவீடுகள்] எடுத்து, Datadog dashboards-ல [Dashboards - எல்லா தகவல்களையும் ஒரே இடத்துல பார்க்குற screen] track பண்ணுவீங்க. அதாவது RAM usage ஆகட்டும், இல்ல active connections ஆகட்டும். இதை CloudWatch-க்கு எப்படி கொண்டு போறது? CloudWatch-க்கும் நம்ம custom metrics அனுப்ப முடியுமா?

**Mahi:** தாராளமா அனுப்பலாம். Spring Boot-ல இருந்து Datadog-க்கு metrics அனுப்புற அதே logic தான் இங்கயும். ஆனா Datadog-ல tags வச்சு filter பண்ணுவீங்க இல்லையா? இங்க CloudWatch-ல அதுக்கு பதிலா நாம dimensions அப்படின்னு சொல்லுவோம்.

**Thiru:** ஓ, dimensions-ஆ?

## 2. The Core Concept (என்ன, ஏன்?)

**Mahi:** ஆமா. CloudWatch-ல ஒவ்வொரு custom metric-உம் ஒரு namespace-க்குள்ள பாதுகாப்பா வைக்கப்பட்டிருக்கும்.

**Thiru:** Namespace அப்படின்னா... ஒரு தனி folder மாதிரி வச்சுக்கலாமா?

**Mahi:** Exactly, ஒரு folder மாதிரி தான். அந்த namespace-க்குள்ள இருக்குற metric-க்கு attribute-ஆ நீங்க வந்து up to 30 dimensions வரைக்கும் வச்சுக்கலாம்.

**Thiru:** Wow, 30 dimensions வரைக்குமா? அது வந்து ஒரு metric-க்கு ரொம்பவே அதிகமான detail ஆச்சே!

**Mahi:** அதான் இதோட power. எந்த instance ID, எந்த environment, எந்த region அப்படின்னு ரொம்ப granular-ஆ [Granular - ரொம்ப நுண்ணிய அளவிலான] data-வை நீங்க slice பண்ணி பாக்க முடியும். இது sub-minute tracking-க்கு [Sub-minute tracking - ஒரு நிமிஷத்துக்கும் குறைவான நேரத்துல data-வை check பண்றது] ரொம்பவே helpful-ஆ இருக்கும். நீங்க high-resolution custom metrics-அ 10 seconds இல்ல 30 seconds இடைவெளில கூட track பண்ணலாம்.

**Thiru:** Super. இப்போ metrics வந்திடுச்சு, அடுத்து வந்து alerting. Datadog-ல பாத்தீங்கன்னா, நாங்க monitors வச்சு alert set பண்ணுவோம். CloudWatch Alarms எப்படி வேலை செய்யுதுன்னு சொல்ல முடியுமா?

**Mahi:** CloudWatch Alarms வந்து மூணு states-ல operate ஆகுது. இது ரொம்ப simple. Data சரியா வந்து நீங்க set பண்ண threshold-க்குள்ள [Threshold - ஒரு அளவு, இதை தாண்டுனா alert வரணும்னு set பண்ற எல்லை] இருந்தா, அது வந்து OK state.

**Thiru:** Right.

## 3. Real-world Example / Analogy

**Mahi:** ஒருவேளை data வரலன்னா INSUFFICIENT_DATA state. அப்புறம் நீங்க set பண்ண threshold-ஐ தாண்டுனா அது ALARM state. ஒரு குறிப்பிட்ட metric-ஐ எடுத்துக்கிட்டு, அதோட sampling max/min values-ஐ இது தொடர்ந்து evaluate [Evaluate - மதிப்பிடுறது] பண்ணிட்டே இருக்கும்.

**Thiru:** இது கேக்குறதுக்கு நல்லா இருக்கு, ஆனா இப்போ Datadog-ல சில சமயம் தேவையில்லாத alerts வந்துட்டே இருக்கும். அதாவது ஒரு 5 second spike [Spike - திடீர்னு ஒரு அளவு அதிகமாகி உடனே குறையறது] ஆகும், உடனே normal ஆயிடும். இந்த alarm noise-ஐ CloudWatch-ல எப்படி தடுப்பது?

**Mahi:** இது ஒரு நல்ல கேள்வி. இதுக்குத்தான் CloudWatch-ல Composite Alarms அப்படின்னு ஒரு feature இருக்கு.

**Thiru:** Composite Alarms அப்படின்னா பல alarms-ஐ ஒன்னா சேர்க்கிறதா?

**Mahi:** Exactly. சாதாரண alarms ஒரே ஒரு metric-ஐ மட்டும்தான் கவனிக்கும். ஆனா Composite Alarms வந்து, பல alarms-ஓட states-ஐ AND இல்ல OR conditions மூலமா இணைக்கும்.

**Thiru:** ஓஹோ, அப்போ CPU usage-உம் அதிகமா இருக்கணும், அதே சமயம் database load-உம் அதிகமா இருந்தா மட்டும் alert வர்ற மாதிரி set பண்ணலாமா?

**Mahi:** Correct. இதனால அந்த complex alarms-ஐ உருவாக்கி, alarm noise-ஐ நீங்க ரொம்பவே குறைச்சுக்கலாம். உண்மையிலேயே system stress-ல இருக்கும்போது மட்டும் உங்களுக்கு notification வரும்.

**Thiru:** That's nice. இப்போ alarm trigger ஆயிடுச்சு, notification மட்டும் வருமா இல்ல system தானாகவே react பண்ணுமா? ஏன்னா இப்போ உங்க decoupled microservice architecture-ல [Decoupled microservice architecture - ஒரு service down ஆனாலும் மத்த service பாதிக்காத மாதிரி design பண்றது] வந்து...

**Mahi:** ஆனா அங்க synchronous REST calls-ஐ விட, asynchronous queue-based communication தான் ரொம்ப முக்கியம்.

**Thiru:** Correct. நாங்க SQS இல்ல SNS பயன்படுத்தறப்போ, இந்த automated actions எப்படி set ஆகும்? இவ்வளவு services-ஐ ஒட்டுமொத்தமா எப்படி monitor பண்றது?

**Mahi:** இப்போ ஒரு CloudWatch Alarm வந்து ALARM state-க்கு போகும்போது சும்மா message மட்டும் அனுப்பாது, ஒரு EC2 instance-ஐ நீங்க stop, terminate, reboot, இல்லனா recover பண்ணலாம். இல்ல Auto Scaling action-ஐ [Auto Scaling action - தேவைக்கேற்ப புது server-ஐ உருவாக்குறது அல்லது அழிக்கிறது] trigger பண்ணலாம்.

**Thiru:** ஓ, நேரா action-ல இறங்கிடும்.

**Mahi:** ஆமா, முக்கியமா நீங்க சொன்ன அந்த SNS-க்கு, அதாவது Simple Notification Service-க்கு [Simple Notification Service - message அல்லது email அனுப்புற AWS service] notification அனுப்பலாம். அங்கிருந்து உங்க SQS queue-க்கு [SQS Queue - Simple Queue Service, messages-ஐ வரிசையா வச்சு அனுப்புற service] message போகும். ஆனா இவ்வளவு services-ஐ எப்படி monitor பண்றதுன்னு கேட்டீங்க இல்லையா?

**Thiru:** ஆமா, ஏன்னா நிறைய services இருக்கும்போது எங்க பிரச்சனை ஆரம்பிச்சதுன்னு கண்டுபிடிக்கிறது கஷ்டமாச்சே.

**Mahi:** அங்கதான் CloudWatch Application Insights உள்ள வருது. இதுக்குள்ள Amazon SageMaker ML-ஓட [Amazon SageMaker ML - Amazon-ஓட machine learning, அதாவது செயற்கை நுண்ணறிவு service] மூளை இயங்குது. நீங்க Java இல்ல .NET-ல run ஆகுற EC2, SQS, SNS, Lambda, S3, DynamoDB எல்லாத்தையும் இதுகூட இணைச்சிடலாம்.

**Thiru:** அப்போ அதுவே தானா எல்லாத்தையும் analyze பண்ணிடுமா?

## 4. Edge Cases & Tricky Scenarios

**Mahi:** Correct. Automated dashboards மூலமா உங்க application health-ஐ அதுவே காட்டிடும். ஏதாவது anomaly [Anomaly - வழக்கத்துக்கு மாறா நடக்குற ஒரு அசாதாரணமான விஷயம்] நடந்தால், root cause-ஐ Easy-ஆ correlate பண்ணி கொடுத்துடும். Container Insights, அப்புறம் Lambda Insights வச்சு container and serverless functions-ஐயும் நீங்க track பண்ணலாம்.

**Thiru:** Wow, ML வச்சு troubleshoot பண்றது next level. சரி, இப்போ metrics track பண்ணியாச்சு. ஆனா உங்க system-ல யார் என்ன action பண்ணாங்க, configuration எப்படி மாறிடுச்சு, இது security-க்கு ரொம்ப முக்கியம் இல்லையா?

**Mahi:** ரொம்ப ரொம்ப முக்கியம். இதுக்குத்தான் நாம audit logging பக்கம் போகணும். இப்போ application-ல யார் எந்த API call பண்ணாங்கன்னு நாங்க audit log பண்ணுவோம். அதே மாதிரி, மொத்த AWS account-க்கும் audit logging பண்றதுக்கு ஒரு tool இருக்குமே?

**Thiru:** அதுதான் CloudTrail. உங்க மொத்த AWS account-க்கும் இது ஒரு surveillance camera மாதிரி. இது default-ஆவே enable ஆகி இருக்கும்.

**Mahi:** அப்போ நான் தனியா போய் on பண்ண தேவையில்லையா?

**Thiru:** தேவையே இல்ல. Console, SDK, இல்ல CLI மூலமா நடக்குற எல்லா API calls-உம் இதுல record ஆகும். SAA exam-ல இது ஒரு முக்கியமான scenario.

**Mahi:** ஓ, exam-ல எப்படி கேப்பாங்க?

**Thiru:** இப்போ AWS-ல ஒரு resource திடீர்னு delete ஆயிடுச்சுன்னு வச்சுப்போம். யார் அதை பண்ணாங்கன்னு கண்டுபிடிக்க architect முதல்ல எதை check பண்ணனும் அப்படின்னு கேப்பாங்க.

## 5. Performance & Trade-offs

**Mahi:** Answer CloudTrail தானா?

**Thiru:** Exactly. இதுல management events வந்து default-ஆ record ஆகும். ஆனா அதிக volume கொண்ட data events, அதாவது S3 object read/write பண்றதெல்லாம் நாமதான் enable பண்ணனும்.

**Mahi:** Super tip. சரி, யாரு மாத்துனாங்கன்னு CloudTrail வச்சு கண்டுபிடிச்சாச்சு. ஆனா என்ன மாத்தியிருக்காங்க? அதாவது அந்த configuration drift detection-க்கு என்ன தீர்வு?

**Thiru:** அதுக்குத்தான் AWS Config இருக்கு. உங்க ALB configuration காலப்போக்குல எப்படி மாறியிருக்கு, இல்ல S3 buckets-ல public access தப்பா enable ஆயிருக்கா அப்படின்னு check பண்ண இது ரொம்ப useful.

**Mahi:** இப்போ security groups-ல SSH access யாருக்காவது unrestricted-ஆ திறந்திருந்தா கூட இது கண்டுபிடிச்சிருமா?

**Thiru:** கண்டிப்பா. இது configuration changes-ஐ தொடர்ந்து record செய்யும். நீங்க rule set பண்ணிட்டீங்கன்னா, யாராவது தப்பா port open பண்ணா, உடனே SNS மூலமாக உங்களுக்கு alerts அனுப்பிடும். இது ஒரு time machine மாதிரி உங்க resource-ஓட history-ஐ காட்டும்.

## 6. Alternatives (எப்போ எதை use பண்ணனும்?)

**Mahi:** அருமை. Infrastructure-ஐ Super-ஆ secure பண்ணியாச்சு. அடுத்து application security. இது என்னோட favorite area. இப்போ environment variables-ல password-ஐ store பண்றது ஒரு பழமையான முறை. அது ரொம்ப risk வேற.

**Thiru:** ஆமா, plain text-ல secrets இருக்கவே கூடாது.

**Mahi:** நாங்க Spring Cloud Config server பயன்படுத்தி configurations அப்புறம் secrets-ஐ manage பண்றோம். AWS-ல இதுக்கு என்ன native solution இருக்கு?

**Thiru:** AWS-ல இதுக்கு best option வந்து SSM Parameter Store. இது ஒரு secure storage, இதுல version tracking வசதியும் இருக்கு.

**Mahi:** ஆனா, இதோட encryption எப்படி வேலை செய்யுது? அதுக்கு தனியா tool இருக்கா?

**Thiru:** Encryption-னு வந்தாலே அது AWS KMS, அதாவது Key Management Service [Key Management Service - encryption keys-ஐ பாதுகாப்பா வைக்குற AWS service] தான். AWS நமக்காக encryption keys-ஐ ரொம்ப secured-ஆ manage பண்ணிக்கிறது.

**Mahi:** ஓ, நாம keys-ஐ manage பண்ண வேண்டாமா?

**Thiru:** வேண்டாம். IAM மூலம் authorization, அப்புறம் CloudTrail மூலம் auditing நடக்குறது. உங்க IAM permission இருந்தா மட்டும்தான், SSM அந்த data-வை KMS வச்சு decrypt பண்ணி கொடுக்கும்.

## 7. Summary (1-minute recap)

**Mahi:** செம. இப்போ SAA exam-ல இந்த KMS பத்தி ஏதாச்சும் specific scenario வருமா?

**Thiru:** கண்டிப்பா. SAA exam-ல அடிக்கடி வர்ற ஒரு topic வந்து KMS multi-region keys. நிறைய பேர் இத global keys அப்படின்னு நினைச்சு தப்பு பண்றாங்க.

**Mahi:** ஓ, அது global கிடையாதா? அப்ப அது எப்படி வேலை செய்யுது?

**Thiru:** இவை வந்து identical keys. அதாவது same key ID, அப்புறம் same key material இருக்கும். ஒரு region-ல encrypt செய்து, மற்றொரு region-ல நீங்க decrypt செய்யலாம். இதுக்கு cross-region API calls தேவையில்லை.

**Mahi:** Wow, அப்போ performance நல்லா இருக்குமே.

**Thiru:** ஆமா. ஆனால், இவை global கிடையாது. ஒவ்வொன்றும் independently managed. இதை தெளிவா புரிஞ்சுகிட்டா exam-ல Easy-ஆ score பண்ணலாம்.

**Mahi:** Super. அப்போ SSM Parameter Store வந்து secure storage, version tracking, அப்புறம் KMS-ஓட இணைந்து seamless encryption-ஐ வழங்குது. இது Spring Cloud Config server-க்கு ஒரு மிகச்சிறந்த AWS மாற்று அப்படின்னு சொல்லலாம்.

**Thiru:** நூற்றுக்கு நூறு சதவீதம் உண்மை. உங்க application-ல எந்த மாற்றமும் இல்லாம இதை Easy-ஆ use பண்ணலாம்.

**Mahi:** Great! அப்போ நாம பாத்ததை ஒரு quick summary பண்ணிடலாம். Datadog மற்றும் Spring Boot Actuator-ல நீங்க பயன்படுத்தும் அறிவை வச்சுகிட்டு, AWS CloudWatch metrics அப்புறம் alarms எப்படி வேலை செய்யுதுன்னு பாத்தோம்.

**Thiru:** ஆமா, அப்புறம் CloudTrail வச்சு audit logging எப்படி பண்றது, AWS Config வச்சு drift detection எப்படி கண்டுபிடிக்கிறதுன்னும் discuss பண்ணோம்.

**Mahi:** Finally KMS மற்றும் SSM வச்சு secrets management எப்படி பண்றதுன்னும் ஆழமா அலசுனோம். இப்போ நான் ஒரு விஷயம் சொல்றேன். உங்களுடைய metrics, audit logs, மற்றும் secrets எல்லாமே தனித்தனி தீவுகளாக இல்லாம, AWS Organizations மூலமாக பல member accounts-ல ஒருங்கிணைக்கப்பட்டு செயல்பட்டா எப்படி இருக்கும்?

**Thiru:** அதாவது ஒரு centralized control [Centralized control - எல்லாத்தையும் ஒரே இடத்துல இருந்து control பண்றது] மாதிரி சொல்றீங்களா?

**Mahi:** Exactly. IAM மற்றும் SCPs, அதாவது Service Control Policies [Service Control Policies - யாரு எந்த service-ஐ use பண்ணலாம்னு organization level-ல போடுற rules] கட்டுப்பாட்டின் கீழ் செயல்பட்டால், உங்களுடைய decoupled microservices-இன் ஒட்டுமொத்த பாதுகாப்பு மற்றும் வேகம் எந்த அளவுக்கு பிரம்மாண்டமாக மாறும் என்று கொஞ்சம் யோசித்து பாருங்கள்.

**Thiru:** இந்த ஒத்திசைவு தான், அதாவது இந்த synergy தான், ஒரு சாதாரண developer-ஐ ஒரு cloud architect-ஆ மாற்றுகிறது.

**Mahi:** அருமையான point. அடுத்த முறை நீங்க உங்க system-ல ஒரு புது API எழுதும்போதோ, அல்லது புதுசா ஒரு alert set பண்ணும்போதோ, கண்டிப்பா இந்த cloud-native mindset-ஐ apply பண்ணி பாருங்க. இந்த ஆழமான அலசல் உங்களுக்கு ரொம்பவே interesting-ஆ இருந்திருக்கும்னு நம்புறோம். மீண்டும் சந்திப்போம், happy cloud computing!

## 8. Interview Deep-Dive Questions

**Q:** Datadog-ல இருந்து CloudWatch-க்கு metrics அனுப்புவதில் உள்ள முக்கிய வேறுபாடு என்ன?
*Answer:* Datadog-ல tags பயன்படுத்துவோம், ஆனால் CloudWatch-ல dimensions பயன்படுத்துவோம் (up to 30 dimensions per metric). இது மிகவும் granular-ஆ data-வை [slice and dice](https://aws.amazon.com/cloudwatch/) செய்ய உதவுகிறது.

**Q:** CloudWatch Alarm noise-ஐ குறைப்பது எப்படி?
*Answer:* Composite Alarms பயன்படுத்தி பல alarms-ஐ AND/OR logic-ல இணைக்கலாம். இதன் மூலம் உண்மையான system stress-ல மட்டுமே notification வரும்.
<br>💡 **Follow-up:** ஒரு alarm trigger ஆனவுடன், manual intervention இல்லாமல் EC2 instance-ஐ தானாக recover செய்ய முடியுமா? (ஆம், alarm actions மூலம்).

**Q:** AWS-ல் resources-ஐ யார் மாற்றினார்கள் என்று கண்டுபிடிக்க எந்த service உதவும்?
*Answer:* CloudTrail. இது எல்லா API calls-யும் record செய்யும்.
<br>💡 **Follow-up:** CloudTrail-ல் data events (e.g., S3 read/write) default-ஆக record ஆகுமா? (இல்லை, management events மட்டுமே default-ஆக record ஆகும், data events-ஐ நாமே enable செய்ய வேண்டும்).

## Quick Revision Summary
- **CloudWatch:** Metrics & Alarms, Dimensions (instead of tags), Composite Alarms, Application Insights.
- **CloudTrail:** API Activity logging (Surveillance camera).
- **AWS Config:** Configuration drift detection and history.
- **SSM Parameter Store & KMS:** Secure secret storage with seamless encryption.