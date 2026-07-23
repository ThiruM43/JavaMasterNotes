# AWS Cloud Infrastructure & Java Architecture - Transcript

## Introduction

**Mahi:** ஞாபகம் இருக்கா உங்களுக்கு, அந்த 2014ல உங்க production environment-ல [Production environment - அதாவது நம்ம app லைவா மக்களுக்காக ஓடிட்டு இருக்குற இடம்] ஒரு சின்ன தப்பு நடந்திருக்கும். அதாவது, ஒரு application properties file-ல [Application properties file - app-க்கு தேவையான Settings எல்லாம் எழுதி வச்சிருக்கற file] இருந்த தப்பான database password-ஆல [Database password - database-க்குள்ள நுழையறதுக்கான Secret சாவி] மொத்த application-உம் Down ஆன அந்த நாள்.

**Thiru:** ஆமா, Night பூரா உக்காந்து log [Log - நம்ம app-ல என்னென்ன நடக்குதுன்னு ரெக்கார்ட் ஆகுற இடம்] Check பண்ணி கடைசியா அந்த properties file-அ கண்டுபிடிச்சு server restart [Server restart - server-ஐ ஆஃப் பண்ணி ஆன் பண்றது] பண்ணிருப்பீங்க. ஒரு 12 வருஷம் java backend developer-ஆ [Java Backend Developer - java வச்சு server சைடுக்கு code எழுதுறவங்க] இருக்குறவங்களுக்கு கண்டிப்பா இந்த மாதிரி ஒரு nightmare experience இருக்கும்.

**Mahi:** Exactly. ஆனா பாத்தீங்கன்னா, இதே infrastructure-அ நாம cloud-க்கு [Cloud - இன்டர்நெட்ல இருக்கிற servers] கொண்டு போகும்போது, இந்த மாதிரி credentials-அ hardcode பண்றது [Hardcode credentials - password, Secret Keys எல்லாத்தையும் டைரக்டா code-லயே எழுதி வைக்கிறது], அப்புறம் physical server RAM upgrade பண்ண [Physical server RAM upgrade - நம்ம கண்ணுக்கு தெரியுற server மெஷின்ல RAM அதிகப்படுத்துறது] downtime [Downtime - application ஒர்க் ஆகாம ஆஃப் ஆகி இருக்குற நேரம்] எடுக்குறது, இதெல்லாம் Actually முற்றிலுமா மாறிடுது.

**Thiru:** Correct. இன்னைக்கு நாம ஸ்டீபன் மாரேகோவோட AWS Cloud [AWS Cloud - அமேசானோட cloud service], EC2 [EC2 - cloud-ல நாம வாங்குற வாடகை கம்ப்யூட்டர்] அப்புறம் IAM resources-அ [IAM resources - யாருக்கு எந்த access கொடுக்கணும்னு முடிவு பண்ற service] வச்சு ஒரு விரிவான அலசல் பண்ண போறோம்.

**Mahi:** நிச்சயமா. நீங்க தினமும் யூஸ் பண்ற உங்களுக்கு ரொம்பவே அத்துப்படியான Spring Boot [Spring Boot - ஜாவால ஈஸியா app உருவாக்க யூஸ் பண்ற ஒரு Framework], Tomcat [Tomcat - java வெப் apps ஓடுற ஒரு server], JVM [JVM - java கோட ரன் பண்ற ஒரு machine] மாதிரியான java concepts-அ வச்சே AWS ஓட core infrastructure-அ உங்களோட மொழியிலேயே இன்னைக்கு Decode பண்ண போறோம்.

**Thiru:** ஒரு ட்ரெடிஷனல் on-premise infrastructure-ல [On-premise infrastructure - நம்ம கம்பெனிக்குள்ளயே Physically servers வச்சு Maintain பண்றது] நீங்க வந்து JVM tuning [JVM tuning - JVM வேகமா ஓட செட் பண்றது], garbage collection [Garbage collection - தேவையில்லாத மெமரியை Automatically கிளீன் பண்றது], அப்புறம் JBoss thread pools-னு [JBoss thread pools - ஒரே நேரத்துல பல வேலைகளை செய்ய த்ரெட்ஸ் ஒதுக்குறது] bare metal hardware [Bare metal hardware - எந்த virtual Layer-உம் இல்லாத நேரடியான physical server] கூட மல்லு கட்டிருப்பீங்க. ஆனா AWS பொறுத்தவரைக்கும் இந்த hardware level abstraction-அ [Hardware level abstraction - hardware எப்படி வேலை செய்யுதுன்னு நாம கவலைப்படாம யூஸ் பண்றது] அவங்க முழுசா கையாள்றாங்க.

**Mahi:** ஆமா, அது ரொம்ப பெரிய Relief. நீங்க சோர்சஸ்ல ஷேர் பண்ணிருக்கற IAM, EC2, EPS [EPS - இங்க EBS அதாவது elastic Block storage பத்தி தான் தப்பா சொல்லிருக்காங்கனு நினைக்கிறேன்] இந்த மூணுமே ஒரு enterprise java application-அ [Enterprise Java Application - பெரிய கம்பெனிகள் யூஸ் பண்ற பெரிய java சாப்ட்வேர்] cloud-ல deploy பண்றதுக்கான [Deploy - app-அ Server-ல போட்டு ரன் பண்றது] security [Security - பாதுகாப்பு], compute [Compute - Process பண்ற power] மற்றும் storage [Storage - Data-வை சேவ் பண்ற இடம்] தூண்கள்.

**Thiru:** கண்டிப்பா. இத நாம வெறும் Theory-ஆ மட்டும் பார்க்காம நிஜத்துல ஒரு java architecture-ல [Java Architecture - java app எப்படி Design பண்ணிருக்காங்கனு காட்ற Structure] இது எப்படி பொருந்தும்னு பிரிச்சு மேய்வோம்.

**Mahi:** Super. அப்போ மொதல்ல security-ல இருந்தே ஆரம்பிக்கலாம். இப்போ நாம ஒரு monolithic spring boot application [Monolithic Spring Boot application - எல்லா பீச்சர்ஸும் ஒரே code பேஸ்ல இருக்குற ஒரு பெரிய app] எழுதுறோம்னா, எந்த end point-அ [End point - app-அ connect பண்ற ஒரு URL] யார் access பண்ணனும்னு spring security [Spring Security - spring app-க்கு security குடுக்குற ஒரு Tool] யூஸ் பண்ணி செட் பண்ணுவோம் இல்லையா?

**Thiru:** ஆமா, அந்த pre-authorize annotation-லாம் [Pre-authorize annotation - யாருக்கு Permission இருக்குனு Check பண்ற code Tag] யூஸ் பண்ணுவோம்.

**Mahi:** Correct. pre-authorize, hasRole('ADMIN') [hasRole('ADMIN') - admin role இருக்கானு Check பண்றது] அப்படின்னு role-based access control [Role-based access control - அவங்க ரோலுக்கு ஏத்த மாதிரி access கொடுக்கிறது] அதாவது RBAC (RBAC) செட் பண்ணுவோம். அப்போ ஒரு Account லெவல்ல AWS-அ சுத்தி ஒரு perimeter security [Perimeter security - நம்ம System-க்கு வெளியில போடுற பாதுகாப்பு வளையம்] போடணும்னா, spring Security-க்கு நிகரான ஒரு விஷயம் அங்க என்னவா இருக்கும்?

**Thiru:** அங்க தான் IAM அதாவது identity and access management [Identity and Access Management - யார் யாருக்கு என்னென்ன Permission தரணும்னு control பண்ற service] உள்ள வருது. நீங்க spring security-ல பண்ற அதே RBAC concept தான், ஆனா மொத்த AWS infrastructure-க்குமான Key கீப்பர் இதுதான்.

**Mahi:** ஓஹோ, அப்ப இது ஒரு global service [Global service - எந்த குறிப்பிட்ட Region-ுக்கும் கட்டுப்படாம மொத்த AWS-க்கும் பொதுவா வேலை செய்யுற service] மாதிரி செயல்படுது.

**Thiru:** Exactly. IAM-ல users [Users - ஆட்களோ இல்ல வேற Systems-ஓ] அப்படிங்கறது உங்க கம்பெனில இருக்கிற நிஜமான developers அல்லது systems. அப்புறம் groups [Groups - பல users-அ ஒன்னா சேர்த்து ஒரே Permission குடுக்குற அமைப்பு] அப்படிங்கறது அந்த users-அ ஒன்னா சேர்க்கிற ஒரு Logical அமைப்பு. உதாரணத்துக்கு backend dev group [Backend dev group - backend developers-க்குனு இருக்குற group] அல்லது DBA group [DBA group - database admins-க்குனு இருக்குற group].

## Core Concept

**Mahi:** ஓகே. users and groups புரிஞ்சது. ஆனா இவங்களுக்கு Permissions எப்படி Assign பண்றது? Spring-ல நாம java code வழியா பண்ணுவோம்.

**Thiru:** இங்க வந்து AWS policies [AWS Policies - யாருக்கு என்னென்ன உரிமை இருக்குனு எழுதி வச்சிருக்கற டாக்குமெண்ட்] அப்படிங்கிற ஒரு விஷயத்தை யூஸ் பண்றாங்க. இந்த policies எல்லாமே Actually JSON format-ல [JSON format - கம்ப்யூட்டருக்கு புரியுற மாதிரி Key-வேல்யூ பேரா Data-வை எழுதுற முறை] தான் இருக்கும். நீங்க JSON-ல தான் ரூல்ஸ் எழுதணும்.

**Mahi:** ஆமா, அந்த JSON Policies-அ நான் பார்த்திருக்கேன். அதுல effect [Effect - அனுமதி குடுக்கலாமா வேணாமானு சொல்றது (Allow/Deny)], action [Action - என்ன வேலை செய்ய போறாங்கனு சொல்றது], resource [Resource - எந்த server இல்ல Database-ல வேலை செய்ய போறாங்கனு சொல்றது] அப்படின்னு மூணு Keys இருக்கும். ஆனா எனக்கு ஒரு சந்தேகம். இவ்வளவு பெரிய cloud என்விரான்மென்ட்ல கோடிக்கணக்கான API calls [API calls - ஒரு சாப்ட்வேர் இன்னொரு சாப்ட்வேர் கிட்ட request குடுக்குறது] நடக்கும்போது, இந்த JSON-ஐ வச்சே AWS எப்படி access-ஐ evaluate [Evaluate - சரிபார்க்கிறது] பண்ணுது?

**Thiru:** அது ஒரு நல்ல கேள்வி. இந்த இடத்துல ஏதாவது loophole [Loophole - தப்பு பண்ண வழி இருக்குற இடம்] வர வாய்ப்பு இருக்கான்னு நீங்க யோசிக்கலாம். ஆனா அந்த evaluation Process-ல தான் AWS ஓட ஒரு மிக முக்கியமான security Mechanism இருக்கு. அதுக்கு பேரு implicit deny [Implicit deny - வெளிப்படையா Permission கொடுக்கலனா, Automatically Block பண்றது].

**Mahi:** implicit deny அப்படின்னா default-ஆ [Default-a - ஆரம்பத்துல இருந்தே] எல்லாமே Block ஆயிருக்குமா?

**Thiru:** ஆமா. ஒரு IAM policy-ல நீங்க வெளிப்படையா இந்த user-க்கு EC2-வை access பண்ண allow [Allow - அனுமதி] கொடு அப்படின்னு effect செட் பண்ணலன்னா, AWS தானாகவே அந்த request-அ deny [Deny - மறுக்கிறது] பண்ணிடும். நீங்க எதுவும் சொல்லலன்னா default பதில் நோ தான்.

**Mahi:** வாவ், செம Strict. அப்போ action அப்படிங்கிறது எதை குறிக்கும்?

**Thiru:** action அப்படிங்கிறது அவங்க என்ன API கால் பண்ணலாம்னு குறிக்கும். உதாரணத்துக்கு EC2 Start Instances [EC2 Start Instances - EC2 server-ஐ start பண்ற Command]. அப்புறம் resource அப்படிங்கிறது எந்த குறிப்பிட்ட server மேல இதை பண்ணலாம்னு சொல்லும்.

**Mahi:** புரிஞ்சது. இந்த JSON policies மூலமா least privilege principle-அ [Least Privilege Principle - ஒரு வேலை செய்ய எவ்வளவு குறைஞ்ச access தேவையோ அதை மட்டும் கொடுக்கிறது] AWS மிக கடுமையா enforce [Enforce - கண்டிப்பா Follow பண்ண வைக்கிறது] பண்ணுது. இப்போ என்னோட அந்த 2014 நைட்மேருக்கு வருவோம்.

**Thiru:** சொல்லுங்க.

**Mahi:** என் spring boot app-ல database யூசர்நேம், password-ஐ Property file-ல வைப்பேன். இப்போ AWS-ல ஒரு EC2 Instance-ல ஓடுற tomcat server, அங்க இருக்குற ஒரு S3 bucket-ஐயோ [S3 bucket - Files-அ store பண்ற cloud storage] அல்லது RDS database-ஐயோ [RDS Database - relational database service, அதாவது Table Table-ஆ data சேமிக்கிற இடம்] access பண்ணனும்னா, அந்த credentials-அ [Credentials - லாகின் ஐடி, password] எங்க வைக்கிறது?

**Thiru:** மறுபடியும் Property file-ல hardcode பண்ணா அது பெரிய security Risk ஆச்சேன்னு யோசிக்கிறீங்க, கரெக்டா?

**Mahi:** ஆமா, கண்டிப்பா Risk தான்.

**Thiru:** அந்த Risk-ஐ தவிர்க்கிறதுக்கு தான் AWS IAM roles [IAM Roles - user-க்கு பதிலா ரிசோர்ஸ்க்கு கொடுக்கிற Permission ஐடி] அப்படிங்கிற ஒரு Concept-ஐ வடிவமைச்சிருக்காங்க. ஒரு user-க்கு Permission கொடுக்கிற மாதிரி, உங்க EC2 instance-க்கே, அதாவது அந்த virtual machine-க்கே [Virtual Machine - Physically இல்லாம சாப்ட்வேர் மூலமா ஓடுற கம்ப்யூட்டர்], நீங்க ஒரு role-ஐ Assign பண்ணிடலாம்.

## Real-world Example

**Mahi:** ஒரு நிமிஷம், machine-க்கே role கொடுக்கலாமா? அது எப்படி ஒர்க் ஆகும்?

**Thiru:** இது எப்படின்னா, EC2 Instance-க்குள்ள AWS ஓட instance metadata service [Instance Metadata Service - நம்ம EC2 server-ஐ பத்தின Details கொடுக்கிற ஒரு service] அப்படின்னு ஒண்ணு ஓடிட்டு இருக்கும். அது background-ல AWS கிட்ட பேசி, Temporary-ஆன credentials-அ வாங்கிக்கிடும்.

**Mahi:** அப்போ அந்த credentials permanent [Permanent - நிரந்தரமான] இல்லையா?

**Thiru:** இல்ல, இல்ல. இந்த credentials கொஞ்ச நேரத்துக்கு ஒரு தடவை தானாகவே rotate [Rotate - மாறிக்கிட்டே இருக்குறது] ஆயிடும். அதனால நீங்க உங்க java code-ல எந்த ஒரு Secret கீயையோ, Password-ஐயோ hardcode பண்ணவே தேவையில்லை.

**Mahi:** இது செம Feature. அப்போ spring security-ல ஒரு குறிப்பிட்ட API end point-அ Secure பண்ற மாதிரி, IAM roles மூலமா ஒரு முழு server-ஐயுமே Secure பண்ணிடலாம்.

**Thiru:** Exactly.

**Mahi:** இப்போ ஒரு சொல்யூஷன்ஸ் Architect associate அதாவது SAA exam [SAA exam - AWS-ல நாம Architect-னு சர்டிபிகேட் வாங்குறதுக்கான ஒரு பரீட்சை] Scenario-வா யோசிப்போம். ஒரு கம்பெனில 100 developers இருக்காங்க. யார் யாரை எந்தெந்த resources-ஐ access பண்றாங்க, யாரோட access Keys எல்லாம் ரொம்ப நாளா யூஸ் பண்ணாம idle-ஆ [Idle-a - சும்மாவே இருக்குறது] இருக்குன்னு எப்படி ட்ராக் பண்றது? ஏன்னா என்டர்பிரைஸ்ல ஆளுங்க வருவாங்க, போவாங்க இல்லையா?

**Thiru:** கண்டிப்பா, SAA எக்ஸாம்ல இது அடிக்கடி வர்ற ஒரு கேள்வி. இதுக்கு ரெண்டு audit tools [Audit tools - என்னென்ன நடந்திருக்குனு Check பண்ற tools] AWS-ல இருக்கு. ஒன்னு பார்த்தீங்கன்னா, IAM credentials report [IAM Credentials Report - எல்லா user-ஓட password, access Key Status-ஐ காட்ற report].

**Mahi:** ஓகே, இது எப்படி வேலை செய்யும்?

**Thiru:** இது Account லெவல்ல செயல்படும். உங்க Account-ல இருக்கிற எல்லா users-ஓட Passwords மற்றும் access Keys-அ எப்போ கடைசியா rotate ஆச்சு அப்படிங்கிற மொத்த லிஸ்ட்டையும் ஒரு CSV file-ஆ [CSV file - கமா-வால் பிரிக்கப்பட்ட data இருக்குற File, எக்செல் மாதிரி] கொடுத்துரும்.

**Mahi:** Super, இன்னொரு Tool என்ன சொன்னீங்க?

**Thiru:** இன்னொன்னு வந்து IAM access advisor [IAM Access Advisor - ஒரு user எந்த service-ஐ கடைசியா எப்ப யூஸ் பண்ணாருனு சொல்ற Tool]. இது user லெவல்ல செயல்படும். ஒரு குறிப்பிட்ட user எந்தெந்த AWS services-ஐ கடைசியா எப்போ access பண்ணாங்கன்னு காட்டும்.

**Mahi:** அப்போ ஒரு developer கடந்த 90 நாளா S3-யை யூஸ் பண்ணவே இல்லைன்னா, இந்த access Advisor-ஐ வச்சு கண்டுபிடிச்சிரலாமா?

**Thiru:** ஆமா, அதை கண்டுபிடிச்சு அந்த Permission-ஐ நீங்க policy-ல இருந்து தூக்கிடலாம். security perspective-ல [Security perspective - பாதுகாப்பு கோணத்துல] இது ரொம்ப முக்கியம்.

## Under the Hood

**Mahi:** IAM Account level செக்யூரிட்டியை கவனிச்சுக்குதுன்னு தெளிவா புரியுது. அடுத்தபடியா, நம்ம JVM-ஐ எங்க ரன் பண்றதுன்னு பார்ப்போம். வழக்கமா bare metal சர்வர்ஸ்ல RAM-ஐயும், CPU Cores-ஐயும் கணக்கு போட்டு application-ஐ deploy பண்ணுவோம்.

**Thiru:** Correct. AWS-ல EC2, அதாவது elastic compute cloud [Elastic Compute Cloud - நம்ம தேவைக்கு ஏத்த மாதிரி கூட்டிக்கவோ குறைச்சுக்கவோ கூடிய cloud கம்ப்யூட்டர்] வழியா virtual machines வாங்குறோம். ஆனா இங்க hardware abstraction இருக்கறதால, ஒரு java developer-ஆ என் workload-க்கு எந்த EC2 instance டைப் சரியா இருக்கும்னு எப்படி முடிவு பண்றது?

**Mahi:** நீங்க physical server வாங்கும்போதே, இந்த ப்ராஜெக்ட்டுக்கு அதிக RAM தேவைப்படுமா, இல்ல CPU தேவைப்படுமா அப்படின்னு யோசிப்பீங்க இல்லையா? அதே Logic தான் இங்கயும். AWS இதை instance families [Instance families - வேலைக்கு ஏத்த மாதிரி server வகைகளை பிரிச்சு வச்சிருக்கிறது] அப்படின்னு பிரிக்கிறாங்க. இதை ஈசியா ஞாபகம் வச்சுக்க சில mnemonics [Mnemonics - ஈஸியா ஞாபகம் வச்சுக்க யூஸ் பண்ற ஷார்ட்கட்ஸ்] இருக்கு.

**Thiru:** Mnemonics-ஆ? சொல்லுங்க கேட்போம்.

**Mahi:** C for Compute. அதாவது compute Optimized. இது C family. உங்க java app-ல spring batch யூஸ் பண்ணி லட்சக்கணக்கான records-ஐ Process பண்றீங்க, அல்லது media transcoding [Media transcoding - ஒரு வீடியோ/ஆடியோ Format-ஐ இன்னொரு Format-க்கு மாத்துறது] பண்றீங்கன்னா, CPU cores அதிகமா தேவைப்படும். அங்க C instances-ஐ சூஸ் பண்ணனும்.

**Thiru:** ஓகே, C for Compute. அப்புறம்?

**Mahi:** அடுத்தது R for RAM. Memory Optimized. அதாவது R family.

**Thiru:** ஒரு நிமிஷம், Memory Optimized அப்படின்னா... இப்போ நான் Hazelcast அல்லது Redis மாதிரி ஒரு டிஸ்ட்ரிபியூட்டட் in-memory cache-ஐ [In-memory cache - data-வை Hard Disk-ல சேவ் பண்ணாம வேகமா எடுக்க ரேம்லயே சேவ் பண்றது] என் architecture-ல யூஸ் பண்றேன்னு வைங்க. அங்க data எல்லாமே ரேம்ல தான் உக்காந்து இருக்கும். அப்போ அந்த மாதிரி கேஷிங் Servers-க்கு R family தான் சரியான Choice-ஆ இருக்குமா?

**Mahi:** Exactly. in-memory Databases, பெரிய big data analytics engine, இது எல்லாத்துக்கும் RAM தான் bottleneck [Bottleneck - வேகம் குறைய காரணமா இருக்குற இடம்]. அதனால R family தான் Best. அடுத்தது I for IO [IO - Input/Output, அதாவது read/write பண்றது]. அதாவது storage Optimized, I family.

**Thiru:** storage ஆப்டிமைஸ்டுனா... Hard Disk ஸ்பீட் அதிகமா இருக்குமா?

**Mahi:** ஆமா, இதுல Local Disk performance மிக மிக வேகமா இருக்கும். அதனால NoSQL databases [NoSQL databases - Table Format-ல இல்லாம Structure இல்லாத data-வை சேவ் பண்றது], Cassandra மாதிரி அதிக read write நடக்குற இடங்கள்ல I instances-ஐ யூஸ் பண்ணுவாங்க.

**Thiru:** புரிஞ்சது. அப்போ நம்ம சாதாரண வெப் server-க்கு என்ன யூஸ் பண்றது?

**Mahi:** அதுக்கு கடைசியா M அல்லது T family இருக்கு. இது general purpose [General purpose - எல்லா வகையான சாதாரண வேலைகளுக்கும் யூஸ் பண்றது]. உங்க சாதாரண tomcat வெப் server-க்கு compute, Memory எல்லாமே Balanced-ஆ தேவைப்படும். அதுக்கு இந்த general purpose instances-ஐ யூஸ் பண்ணலாம். SAA எக்ஸாம்ல, ஒரு workload-ஐ கொடுத்துட்டு, இதுக்கு எந்த instance டைப் சரின்னு Scenario Based கேள்விகள் கண்டிப்பா வரும்.

**Thiru:** ஓகே. நம்ம JVM ரன் ஆக EC2 instance-ஐ செலக்ட் பண்ணியாச்சு. CPU, RAM எல்லாம் கிடைச்சிருச்சு. ஆனா நம்ம tomcat server சும்மா ஓடாது. அது ஜிபி கணக்குல garbage collection logs [Garbage collection logs - Memory கிளீன் ஆகுறப்போ உருவாகுற log Files] எழுதும். application logs இருக்கும்.

## Edge Cases & Scenarios

**Mahi:** அது மட்டும் இல்லாம users Upload பண்ற ஃபைல்ஸ் இருக்கும். EC2 அப்படிங்கிறது வெறும் CPU, RAM மட்டும் தான்னா, இந்த data-வெல்லாம் எங்க store பண்றது? Hard Disk-க்கு இங்க என்ன architecture இருக்கு?

**Thiru:** இங்க தான் Cloud-ஓட cloud storage abstraction [Cloud storage abstraction - physical Hard Disk எப்படி வேலை செய்யுதுனு நம்ம கவலைப்படாம storage யூஸ் பண்றது] வருது. EC2-க்கு குறிப்பா ரெண்டு வகையான Block storage ஆப்ஷன்ஸ் இருக்கு. ஒன்னு EBS (EBS). அதாவது elastic block store [Elastic Block Store - EC2 server-க்கு Attach பண்ற ஒரு network Hard Disk]. இன்னொன்னு EC2 instance store [EC2 Instance Store - Server-க்குள்ளயே டைரக்டா இருக்குற ஒரு Temporary storage].

**Mahi:** ஓகே, EBS அப்படின்னா என்ன?

**Thiru:** முதல்ல EBS-ஐ எடுத்துப்போம். இது ஒரு network drive [Network drive - network மூலமா connect ஆகுற storage]. அதாவது, ஒரு பெரிய data சென்டர்ல எங்கேயோ ஒரு storage ஏரியா Network-ல இருக்கிற ஒரு physical Disk-ஐ, network மூலமா உங்க EC2 Instance-க்கு Attach பண்றாங்க. Simple-ஆ சொல்லணும்னா, ஒரு network USB ஸ்டிக் மாதிரி இதை கற்பனை பண்ணிக்கோங்க.

**Mahi:** network மூலமா Attach பண்றாங்களா? அப்போ நான் log file-ல ஒரு வரியை எழுதினா கூட, அது network வழியா Travel பண்ணி தான் அந்த Disk-ல போய் store ஆகுமா? இதுல latency [Latency - data போய் சேர ஆகுற தாமதம்] இருக்காதா?

**Thiru:** Actually ஓரளவுக்கு latency இருக்கும். ஆனா AWS அந்த Network-ஐ மிக வேகமா Optimize பண்ணிருக்காங்க. இதுல ஒரு மிகப்பெரிய லாபம் என்னன்னா, ஒருவேளை உங்க EC2 instance crash ஆகி terminate ஆனாலும், Network-ல இருக்கிற அந்த EBS drive-ல உங்க data பத்திரமா இருக்கும்.

**Mahi:** ஓ, data லாஸ் இருக்காது.

**Thiru:** ஆமா, நீங்க வேற ஒரு புது EC2 instance-ஐ உருவாக்கி, இந்த EBS-ஐ அதுல Attach பண்ணி வேலையை தொடரலாம். ஆனா இங்க தான் இன்னொரு storage டைப் வருது. அதுதான் EC2 instance store. இது network drive கிடையாது.

**Mahi:** அப்போ இது Local Drive-ஆ?

**Thiru:** ஆமா, உங்க EC2 virtual machine எந்த physical server Rack-ல ஓடுதோ, அந்த Rack-லயே நேரடியாக இணைக்கப்பட்ட physical Hard drive தான் இந்த instance store.

**Mahi:** டைரக்ட் Attached physical Drive-ஆ? அப்போ network latency-ஏ இருக்காது, IOPS [IOPS - ஒரு செகண்டுக்கு எத்தனை தடவை data-வை read/write பண்ண முடியும்ங்கிற கணக்கு] அதாவது இன்புட் அவுட்புட் operations ரொம்ப அதிகமா இருக்குமே?

**Thiru:** கண்டிப்பா, ரொம்ப Fast-ஆ இருக்கும். ஆனா சோர்சஸ்ல இது ephemeral storage [Ephemeral storage - கொஞ்ச நேரம் மட்டும் இருக்கக்கூடிய தற்காலிகமான storage], அதாவது தற்காலிகமானது அப்படின்னு சொல்லிருக்காங்களே? physical Disk-ல எழுதுற data எப்படி அழியும்?

**Mahi:** அங்க தான் AWS ஓட hypervisor mechanism-அ [Hypervisor mechanism - ஒரு physical மெஷின்ல பல virtual machines ஓட வைக்கிற சாப்ட்வேர்] நீங்க புரிஞ்சுக்கணும். உங்க EC2 instance-ஐ நீங்க Stop பண்ணிட்டு மறுபடியும் start பண்ணும்போது, AWS உங்களோட virtual machine-ஐ அதே physical Rack-ல தான் start பண்ணனும்னு எந்த அவசியமும் இல்லை.

**Thiru:** ஓ, வேற server-க்கு மாத்திடுவாங்களா?

## Performance & Trade-offs

**Mahi:** ஆமா, resource Optimization-க்காக data சென்டர்ல இருக்கிற வேறொரு physical Rack-க்கு உங்க VM-ஐ அவங்க மாற்றலாம். உங்க VM புது Rack-க்கு மாறிடும், ஆனா பழைய Rack-ல இருந்த அந்த instance store physical Hard drive அங்கேயே தங்கிடும். அதனால தான் EC2-வை Stop start பண்ணா, instance ஸ்டோர்ல இருக்கிற data முழுசும் அழிஞ்சிடும்.

**Thiru:** ஆனா, server restart ஆனா உள்ள இருக்கிற session data எல்லாம் காலி. சரியான analogy. அப்புறம் EBS அப்படிங்கிறது ட்ரெடிஷனல் relational DB [Relational DB - Table-ஆ, Relationship-ஓட data store பண்றது], Disk மாதிரி. கொஞ்சம் network ஜம்ப் இருக்கும், ஆனா data Safe-ஆ, permanent-ஆ இருக்கும். அப்போ, instance store-ஐ நாம முக்கியமான data-வை சேமிக்க யூஸ் பண்ணவே கூடாது.

**Mahi:** கண்டிப்பா கூடாது.

**Thiru:** மாறாக, cache buffers [Cache buffers - data-வை வேகமா கொடுக்க Temporary-ஆ store பண்ற இடம்], scratch data [Scratch data - Temporary-ஆ Process பண்ண யூஸ் பண்ற data], அல்லது Processing-க்கு மட்டும் யூஸ் பண்ற Temporary ஃபைல்ஸ்க்கு தான் யூஸ் பண்ணனும் இல்லையா?

**Mahi:** மிக சரியான ஒப்பீடு. அதனால தான் enterprise Databases-ஐ எப்பவுமே EBS-ல தான் ரன் பண்ணுவாங்க. EBS-லயே workloads-க்கு தகுந்த மாதிரி வகைகள் இருக்கு. general purpose-க்கு gp2, gp3-ன்னு SSD [SSD - ரொம்ப வேகமா வேலை செய்யுற சாலிட் ஸ்டேட் drive storage] யூஸ் பண்ணுவாங்க.

**Thiru:** mission critical Apps-க்கு?

**Mahi:** நீங்க ஒரு mission critical-ஆன Oracle database-ஐ ரன் பண்றீங்க, அதுக்கு ஒரு செகண்டுக்கு இத்தனை முறை data-வை read, write பண்ண முடியும் அப்படிங்கிற வேகம் மிக முக்கியம் அப்படின்னா, io1 அல்லது io2 Block Express Provisioned IOPS Volumes-ஐ யூஸ் பண்ணுவாங்க.

**Thiru:** Super. அப்போ EBS தான் சேஃப்னு முடிவு பண்ணியாச்சு. ஆனா, SAA எக்ஸாம்ல இத வச்சு ஒரு ட்விஸ்ட் வைப்பாங்களே? EBS ஒரு குறிப்பிட்ட availability zone [Availability Zone - ஒரு ரீஜனுக்குள்ள இருக்கிற தனித்தனி data சென்டர்கள்] அதாவது AZ-ல மட்டும் தான் log ஆகிருக்கும்.

**Mahi:** ஆமா, அது ட்ரூ தான்.

**Thiru:** ஒருவேளை US-East-1A அப்படிங்கிற availability ஜோன்ல என்னோட EBS Volume இருக்கு. அந்த data சென்டர்ல ஒரு பெரிய power outage [Power outage - கரண்ட் கட் ஆகுறது] வருது. இப்போ அந்த data-வை நான் US-East-1B அப்படிங்கிற வேறொரு AZ-க்கு எப்படி மாற்றுவது? network Drive-ஐ அப்படியே கழட்டி அங்க மாட்ட முடியாதே?

**Mahi:** கண்டிப்பா முடியாது. ஏன்னா, EBS Volume எந்த AZ-ல இருக்கோ, அந்த data சென்டர் Network-ல மட்டும் தான் Physically connect ஆகியிருக்கும். இதை வேற AZ-க்கு கொண்டு போகணும்னா, முதல்ல அந்த EBS Volume-ஐ ஒரு snapshot [Snapshot - ஒரு குறிப்பிட்ட நேரத்துல data எப்படி இருந்துச்சோ அத அப்படியே ஒரு backup Copy எடுக்குறது] எடுக்கணும்.

**Thiru:** snapshot-னா backup [Backup - data-வை பத்திரமா இன்னொரு Copy எடுத்து வைக்கிறது] மாதிரி தானே?

**Mahi:** ஆமா, snapshot அப்படிங்கிறது அந்த Volume-ஓட Point இன் டைம் backup. இந்த backup AWS ஓட S3ல போய் store ஆகும். S3 ஒரு Region level service. அதனால, அந்த snapshot-ஐ வச்சு US-East-1B அப்படிங்கிற புது AZ-ல நீங்க ஒரு புது EBS Volume-ஐ Restore பண்ணிக்கலாம்.

**Thiru:** ஓ, இந்த மாதிரி தான் மூவ் பண்ணனுமா?

## Summary

**Mahi:** ஆமா, இது SAA எக்ஸாம்ல கட்டாயம் வரக்கூடிய ஒரு முக்கியமான Disaster Recovery Scenario.

**Thiru:** Brilliant. இப்போ நம்மகிட்ட IAM security இருக்கு, EC2 Instance-ல JVM ஓடுது, EBS-ல data Safe-ஆ இருக்கு. அடுத்த infrastructure scale and cost [Scale and cost - app-அ பெருசாக்குறதும் அதுக்கான செலவும்] பத்தி பார்ப்போம். நாம இப்போ பேசின availability ஜோன்ஸ், ரீஜன்ஸ் இதெல்லாம் ஒரு enterprise production டிப்ளாய்மென்ட்ல எப்படி வேலை செய்யுது?

**Mahi:** AWS உலகெங்கிலும் global Infrastructure-ஐ வச்சிருக்காங்க. Region அப்படிங்கிறது ஒரு பெரிய புவியியல் அமைப்பு. உதாரணத்துக்கு மும்பை Region. ஒவ்வொரு Region-க்குள்ளயும் குறைந்தபட்சம் மூணு availability ஜோன்ஸ் இருக்கும்.

**Thiru:** அந்த availability ஜோன்ஸ்லாம் ஒரே Building-ல இருக்குமா?

**Mahi:** இல்ல இல்ல, AZ அப்படிங்கிறது சும்மா ஒரு Building கிடையாது. ஒவ்வொரு AZ-உம் ஒன்று அல்லது அதற்கு மேற்பட்ட தனித்தனி data சென்டர்ஸ். ஒரு ஏசட்டுக்கும் இன்னொரு ஏசட்டுக்கும் பல கிலோமீட்டர் இடைவெளி இருக்கும்.

**Thiru:** வாவ், அப்போ network, power எல்லாம் தனித்தனி தானா?

**Mahi:** ஆமா, இவற்றுக்கே தனித்தனி power Supply, தனித்தனி network இருக்கும். ஒரு AZ-ல வெள்ளமோ, தீ விபத்தோ நடந்தா, அது இன்னொரு AZ-ஐ பாதிக்காத வகையில முற்றிலும் Isolated-ஆ அமைக்கப்பட்டிருக்கும்.

**Thiru:** அதனால தான் ஹை availability கிடைக்குது.

**Mahi:** Correct. அதனால, நீங்க உங்க java application-ஐ EC2 instances மூலமா பல AZ-களில் பிரிச்சு deploy பண்ணும்போது, ஒரு முழு data சென்டரே Down ஆனாலும், உங்க application ஹை Availability-ல ஓடிட்டு இருக்கும்.

**Thiru:** ஆனா, ஒரு கவலை என்னன்னா, எல்லா இடத்துலயும் server-ஐ Spin பண்ணா, Cloud-ல cost எக்கச்சக்கமா ஏறிடுமே. நம்ம physical data சென்டர்ல ஒரு தடவை ஹார்டுவேர் வாங்கிட்டா முடிஞ்சது. ஆனா Cloud-ல Bill Meter ஓடிக்கிட்டே இருக்குமே? இதை AWS-ல எப்படி Optimize பண்றது?

**Mahi:** இதுக்காகவே AWS-ல மூணு முக்கியமான Purchasing ஆப்ஷன்ஸ் இருக்கு. முதல்ல on-demand [On-demand - எப்ப தேவையோ அப்போ மட்டும் யூஸ் பண்ணிட்டு காசு கொடுக்குறது]. நீங்க எப்போ server யூஸ் பண்றீங்களோ, அந்த செகண்டுக்கு மட்டும் காசு கொடுத்தா போதும். புதுசா ஒரு application Test பண்றீங்க, லோடு எப்படி இருக்கும்னு தெரியலன்னா, on-demand Best.

**Thiru:** ஓகே, அப்போ Stable-ஆன லோடுக்கு என்ன பண்றது?

**Mahi:** ரெண்டாவது, reserved instances [Reserved instances - இவ்வளவு நாள் யூஸ் பண்ணுவேன்னு முன்னாடியே கமிட் பண்ணி discount வாங்குறது] அல்லது சேவிங்ஸ் பிளான்ஸ். உங்க enterprise java app பல வருஷமா ஒரே மாதிரியான stable load-ல ஓடிட்டு இருக்குன்னு வைங்க. அடுத்த ஒரு வருஷம் அல்லது மூணு வருஷத்துக்கு நான் கண்டிப்பா இவ்வளவு கம்ப்யூட்ட யூஸ் பண்ணுவேன்னு AWS-க்கு ஒரு commitment கொடுத்தா, உங்களுக்கு 72% வரைக்கும் மிகப்பெரிய discount கிடைக்கும்.

**Thiru:** ஓ, இது நியாயமா படுது. reserved வாங்கிக்கலாம், திடீர்னு spike வந்தா on-demand யூஸ் பண்ணிக்கலாம். ஆனா spot instances [Spot instances - AWS கிட்ட சும்மா இருக்கிற Servers-அ ரொம்ப கம்மி விலைக்கு வாங்குறது] அப்படின்னு ஒன்னு இருக்கே? அது ரொம்ப ரொம்ப cheap-னு கேள்விப்பட்டேன், 90% discount எல்லாம் தராங்களாமே? நிஜமா?

## Interview Deep-Dive Q&A

**Mahi:** தராங்க, ஆனா இங்க ஒரு பெரிய Catch இருக்கு. spot Instances-அ அப்படிங்கிறது AWS-கிட்ட சும்மா Unused-ஆ தூங்கிட்டு இருக்குற ஹார்டுவேர். அதை அவங்க மிக குறைந்த விலைக்கு கொடுப்பாங்க.

**Thiru:** ஓகே, அப்புறம் என்ன Catch?

**Mahi:** Catch என்னன்னா, AWS-க்கு திடீர்னு அந்த Capacity தேவைப்பட்டா, வெறும் ரெண்டு நிமிஷம் Warning கொடுத்துட்டு உங்க EC2 instance-ஐ அப்படியே உங்கள்ட்ட இருந்து புடுங்கிப்பாங்க.

**Thiru:** ஒரு நிமிஷம், ரெண்டு நிமிஷத்துல server-ஐ பிடுங்கிடுவாங்களா? அப்போ spot Instances-அ வச்சு ஒரு java developer என்ன பண்றது? user ஒரு பெரிய Payment Transaction பண்ணிட்டு இருக்கும்போது server காணாம போனா application crash ஆயிடுமே?

**Mahi:** ஆமா, அதனாலதான் spot instances-ஐ எந்த ஒரு stateful application-க்கோ [Stateful application - user-ஓட data-வை அந்த server-லயே ஞாபகம் வச்சுக்கிற app] அல்லது மெயின் வெப் சர்வருக்கோ நீங்க கண்டிப்பா யூஸ் பண்ணக்கூடாது. உங்களோட architecture-ஐ நீங்க stateless-ஆ [Stateless - எந்த user டேட்டாவையும் Server-ல சேவ் பண்ணாம வெளியில வச்சுக்கிற app] Design பண்ணனும்.

**Thiru:** stateless-னா? session data-வை வெளியில வைக்கணுமா?

**Mahi:** Exactly. user session data எதையும் EC2 Instance-ல வைக்காம, Redis மாதிரியான External கேஷ்லயோ அல்லது DynamoDB-லயோ வச்சிடணும். ஒருவேளை AWS உங்க spot instance-ஐ terminate பண்ணாலும், load balancer [Load balancer - வர்ற traffic-ஐ எல்லா servers-க்கும் சமமா பிரிச்சு கொடுக்குறது] தானாகவே Traffic-ஐ வேறொரு EC2-க்கு அனுப்பிடும். user-க்கு எந்த பாதிப்பும் தெரியாது.

**Thiru:** அப்போ spot instances-ஐ எதுக்கு தான் யூஸ் பண்றது?

**Mahi:** batch processing [Batch processing - நிறைய data-வை மொத்தமா சேர்த்து வச்சு Process பண்றது], background jobs, image rendering மாதிரியான ஃபெயிலியரை தாங்கக்கூடிய, அதாவது fault tolerant [Fault tolerant - இடையில ஏதாவது தப்பானாலும் நின்னுடாம தொடர்ந்து வேலை செய்யுறது] வேலைகளுக்கு மட்டும் தான் spot instances யூஸ் பண்ணனும். SAA எக்ஸாம்ல மிக குறைந்த செலவில் fault tolerant workload-ஐ ரன் பண்ணனும்னு ஒரு கேள்வி வந்தா, கண்ணை மூடிக்கிட்டு spot instances-ஐ Tick பண்ணிடுங்க.

**Thiru:** வாவ், உங்களோட Insights-ல இருந்து பல விஷயங்கள் ரொம்ப தெளிவா புரிஞ்சது. ஒரு 12 வருஷ java அனுபவத்தை வச்சுக்கிட்டு Cloud-ஐ பார்க்கும்போது, IAM அப்படிங்கிறது நம்ம spring security RBAC கோடோட global Version, அப்புறம் EC2 அப்படிங்கிறது நாம டியூன் பண்ற bare metal tomcat Server-ஓட Abstracted infrastructure.

**Mahi:** ஆமா, அது மட்டுமில்லாம Storage-ஐயும் connect பண்ணலாம்.

**Thiru:** Correct, EBS மற்றும் instance store அப்படிங்கிறது Persistent Disk மற்றும் ephemeral Memory-க்கான trade offs அப்படின்னு ஒரு தெளிவான மேப் நமக்கு கிடைச்சிருக்கு.

**Mahi:** நிச்சயமா. Cloud architecture அப்படிங்கிறது ஏதோ புதுசு இல்ல, நாம ஏற்கனவே பண்ற டிஸ்ட்ரிபியூட்டட் systems டிசைனோட ஒரு மிக பிரம்மாண்டமான Implementation தான். நீங்க Existing Concepts-ஓட இப்படி Relate பண்ணி படிக்கும்போது, AWS infrastructure உங்க மனசுல ஆழமா பதிஞ்சிடும்.

**Thiru:** சூப்பரான Discussion. இறுதியா, இந்த விரிவான அலசலை கேட்டுட்டு இருக்கிற உங்களுக்கு ஒரு சிந்தனையை விட்டுட்டு போறேன். நாம EBS பற்றி பேசும்போது, ஒரு EBS Volume ஒரு availability ஜோன்ல மட்டும் தான் log ஆகியிருக்கும்னு பார்த்தோம்.

**Mahi:** ஆமா, அது ஒரு முக்கியமான Point.

**Thiru:** ஆனா, உங்களோட சோர்சஸ்ல EFS (EFS), அதாவது EFS [EFS - நிறைய servers ஒரே நேரத்துல ஷேர் பண்ணி யூஸ் பண்ற ஒரு network file system] பத்தி ஒரு சின்ன குறிப்பு இருக்கு. இந்த EFS-ஆல 100க்கும் மேற்பட்ட EC2 instances-ஐ, அதுவும் பல AZ-களில், ஒரே நேரத்துல Mount பண்ண முடியும்.

**Mahi:** அது ஒரு Powerful Feature.

**Thiru:** ஒருவேளை நீங்க ஒரு டிஸ்ட்ரிபியூட்டட் java application-ஐ Design பண்றீங்க, அதுல மூணு வெவ்வேறு AZ-களில் இருக்கிற tomcat instances எல்லாமே ஒரே shared directory-ல [Shared directory - எல்லாரும் ஒன்னா யூஸ் பண்ற ஒரு போல்டர்] read write பண்ணனும்னா, EBS-ஆல அது முடியாது, ஆனா EFS-ஆல முடியும். அப்போ, நான் ஏன் எப்பவுமே EFS-ஐயே யூஸ் பண்ணக்கூடாது? எதுக்கு EBS-க்கு போகணும் அப்படிங்கிற ஒரு கேள்வி வருது இல்லையா? அந்த network latency, file system logs, மற்றும் cost Constraints-ல என்னென்ன trade offs இருக்கு அப்படின்னு சொந்தமா கொஞ்சம் தேடி பாருங்க. உங்களோட architecture முடிவுகளை அது அடுத்த கட்டத்துக்கு கொண்டு போகும். Happy learning and All the best for your SAA exam.