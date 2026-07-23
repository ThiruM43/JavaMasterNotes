# Data Layer — Databases, Caching & Storage - Transcript

## Introduction

**Mahi:** ஸ்பீக்கர் 1: இந்த விரிவான அலசலுக்கு உங்களை வரவேற்கிறோம், நீங்க ஒரு Java developer, இப்போ AWS Solutions Architect Associate (SAA) exam-க்கு ready-ஆகிட்டு இருக்கீங்கனு வச்சுப்போம். இன்னைக்கு ரொம்ப முக்கியமான சில concepts-ஐ பத்தி பேச போறோம். குறிப்பா, data layer [Data Layer - data-வை பாதுகாப்பா சேமிச்சு வைக்கிற அடுக்கு], database, caching மற்றும் storage பத்தி.

**Thiru:** ஸ்பீக்கர் 2: ஆமா, நீங்க ஒரு Spring Boot application-ல [Spring Boot application - Java-ல easy-ஆ web app உருவாக்குற ஒரு framework], ஒரு பெரிய image file-அ, அதாவது நம்ம JPA language-ல சொல்லணும்னா @Lob annotation [ @Lob annotation - database-ல பெரிய size files-ஐயோ படத்தையோ save பண்ண Java-ல use பண்ற ஒரு code tag ] use பண்ணி, database-ல store பண்றீங்க. ஆரம்பத்துல இது நல்லாதான் வேலை செய்யும். ஆனா திடீர்னு, ஒரு ஆயிரம் users அந்த image-ஐ ஒரே நேரத்துல பார்த்தா என்ன ஆகும்னு யோசிச்சு பாருங்க?

**Mahi:** ஸ்பீக்கர் 1: கண்டிப்பா server திணறிடும். உங்க JVM memory [JVM memory - Java program ஓடுறதுக்கு தேவைப்படுற RAM] full-ஆகி, Out of Memory error [Out of Memory error - RAM பத்தாம போயிருச்சுன்னு system காட்டுற error] வந்து, server அப்படியே crash ஆயிடும் [Crash - server வேலை செய்யாம நின்னுடுறது].

**Thiru:** ஸ்பீக்கர் 2: exactly. அதனாலதான் AWS-ல அந்த மாதிரி பெரிய BLOB files-ஐ database-ல வைக்காம, S3-க்கு [S3 - Simple Storage Service, files-ஐ save பண்ற cloud storage] மாத்தணும்.

## Core Concept

**Mahi:** ஸ்பீக்கர் 1: S3-ய ஒரு external file system-னு சொல்லலாமா?

**Thiru:** ஸ்பீக்கர் 2: ஒரு சின்ன correction. S3-ய file system-னு சொல்றது technical-ஆ தப்பு. அது ஒரு object storage [Object Storage - files-ஐ folder-ஆ வைக்காம, ஒவ்வொன்னையும் தனித்தனி object-ஆ ID-யோட save பண்ற முறை]. நம்ம EC2-ல பாத்த EBS வந்து block storage [Block Storage - hard disk-ல data-வை சின்ன சின்ன block-ஆ பிரிச்சு save பண்றது]. ஆனா S3 அப்படிங்கறது ஒரு பெரிய key-value store [Key-Value store - ஒரு பேரை வச்சு அதுக்குள்ள data-வை save பண்ற முறை] மாதிரி. file-ஓட பேரு வந்து key, உள்ள இருக்குற data வந்து value. இது buckets [Buckets - S3-ல files-ஐ போட்டு வைக்கிற ஒரு மெய்நிகர் பை] அப்படிங்கற கோப்பைகளுக்குள்ள சேமிக்கப்படும்.

**Mahi:** ஸ்பீக்கர் 1: அப்படியா, இந்த bucket பேர்களுக்கு நிறைய rules இருக்குன்னு நான் படிச்சிருக்கேன். நம்ம இஷ்டத்துக்கு பேர் வைக்க முடியாதாமே?

**Thiru:** ஸ்பீக்கர் 2: ஆமா, அதுக்கு முக்கியமான காரணம் DNS [DNS - Domain Name System, website பேரை computer-க்கு புரியுற IP address-ஆ மாத்துற system]. நீங்க உருவாக்குற bucket பேரு உலக அளவுல unique-ஆ இருக்கணும். ஏன்னா, அது ஒரு web முகவரியா மாறப்போகுது. அதனாலதான் அந்த பேர்ல upper case [Upper case - பெரிய எழுத்துக்கள்] இருக்கக்கூடாது, underscore இருக்கக்கூடாது. இது security-க்காகவும், networking-க்காகவும் கொண்டு வரப்பட்ட rules.

## Real-world Example

**Mahi:** ஸ்பீக்கர் 1: இப்போ புரியுது. சரி, இந்த S3-ல எவ்வளவு பெரிய file-ஐ வேணாலும் store பண்ணிக்கலாமா?

**Thiru:** ஸ்பீக்கர் 2: store பண்ணலாம், ஆனா நீங்க upload பண்ற file 5 GB-க்கு மேல இருந்தா, அத அப்படியே single file-ஆ அனுப்ப முடியாது. அதுக்கு multipart upload [Multipart upload - பெரிய file-ஐ சின்ன சின்ன துண்டா பிரிச்சு ஒரே நேரத்துல upload பண்றது] use பண்ணனும். எந்த part fail ஆச்சோ, அத மட்டும் திரும்ப அனுப்புனா போதும்.

**Mahi:** ஸ்பீக்கர் 1: super. ஆனா இப்ப S3-ல ஒரு பெரிய image இருக்கு. அத என்னோட Spring Boot app-க்கு கொண்டு வந்து, size குறைச்சு, mobile-க்கு அனுப்புறதுக்கு பதிலா, S3-ல எடுக்கும்போதே size குறைக்க முடியுமா?

**Thiru:** ஸ்பீக்கர் 2: ரொம்ப அருமையான கேள்வி. இதுக்காகவே AWS-ல S3 Object Lambda [S3 Object Lambda - S3-ல இருந்து file-ஐ எடுக்கும்போதே நடுவுல ஒரு code-ஐ run பண்ணி file-ஐ மாத்தி கொடுக்குற feature] அப்படின்னு ஒன்னு இருக்கு. file-ஐ கேட்கும்போது நடுவுல lambda ஓடி, அத on-the-fly-ஆ [On-the-fly - request நடக்கும்போதே உடனுக்குடனே மாத்துறது] மாத்தி கொடுக்கும். image size குறைக்கிறது மட்டும் இல்லாம, PII data [PII Data - Personally Identifiable Information, அதாவது ஒருத்தரோட personal-ஆன தகவல்கள்] மாதிரி sensitive data-வை மறைக்கிறதுக்கும் இத use பண்ணலாம்.

## Under the Hood

**Mahi:** ஸ்பீக்கர் 1: இது கேக்கவே ரொம்ப interesting-ஆ இருக்கு. ஆனா ஒரு architect-ஆ நம்ம cost optimization [Cost optimization - செலவை எப்படி குறைக்கிறதுன்னு plan பண்றது] பத்தியும் யோசிக்கணுமே. எல்லா file-ஐயும் S3-ல போட்டா bill எகிறிடுமே.

**Thiru:** ஸ்பீக்கர் 2: அடிக்கடி use பண்ற data-வை S3 Standard [S3 Standard - அடிக்கடி use பண்ற files-ஐ வைக்கிற normal S3 storage] class-ல வைப்போம். ஆனா அடிக்கடி எடுக்க மாட்டோம், ஆனா கேட்ட உடனே வேணும்னா, S3 Standard-IA [S3 Standard-Infrequent Access - எப்பவாவது ஒரு தடவை தேவைப்படுற ஆனா கேட்ட உடனே கிடைக்க வேண்டிய data-வை save பண்ற இடம்] use பண்ணலாம். பழைய log files, backup-க்கு Glacier [Glacier - ரொம்ப வருஷத்துக்கு backup வைக்கிற ரொம்ப cheap-ஆன storage] classes இருக்கு.

**Mahi:** ஸ்பீக்கர் 1: Glacier-ல data-வை எடுக்க தாமதம் ஆகுமே?

**Thiru:** ஸ்பீக்கர் 2: ஆமா, Glacier Flexible Retrieval [Glacier Flexible Retrieval - எடுக்குறதுக்கு கொஞ்ச நேரம் ஆகுற ஆனா செலவு கம்மியான backup] use பண்ணா ஒரு நிமிஷத்துல இருந்து 12 மணி நேரம் வரைக்கும் ஆகலாம். ஏன்னா data magnetic tape storage-ல [Magnetic tape storage - cassette tape மாதிரி பழைய காலத்து ஆனா நிறைய data save பண்ற physical storage] இருக்கும். ரொம்ப ரொம்ப cheap வேணும்னா Glacier Deep Archive [Glacier Deep Archive - இருக்கறதுலயே ரொம்ப ரொம்ப cheap-ஆன, ஆனா file-ஐ எடுக்க ரெண்டு நாள் வரைக்கும் ஆகுற storage] போகலாம், அதுக்கு 48 மணி நேரம் ஆகும். இப்போ புதுசா S3 Express One Zone [S3 Express One Zone - ஒரே ஒரு data center-ல மட்டும் save ஆகுற ரொம்ப வேகமான storage] வந்திருக்கு, இது சாதாரண S3-யை விட 10 மடங்கு வேகம்.

## Edge Cases & Scenarios

**Mahi:** ஸ்பீக்கர் 1: எந்த data-வை எப்போ use பண்ணுவாங்கனு எனக்கு முன்னாடியே தெரியலைன்னா என்ன பண்றது?

**Thiru:** ஸ்பீக்கர் 2: அதுக்குத்தான் S3 Intelligent-Tiering [S3 Intelligent-Tiering - file-ஐ எப்போ use பண்றாங்கனு அதுவே check பண்ணி, காசு கம்மியாகுற மாதிரி வேற வேற storage-க்கு அதுவே மாத்துற feature] இருக்கு. அதுவே monitor பண்ணி தானா மாத்திக்கும். இது தவிர lifecycle rules [Lifecycle rules - இத்தனை நாளுக்கு அப்புறம் file-ஐ இந்த இடத்துக்கு மாத்துனு automatic-ஆ set பண்ற rules] use பண்ணி பழைய files-ஐ automatic-ஆ expiration action [Expiration action - குறிப்பிட்ட நாளுக்கு அப்புறம் file-ஐ automatic-ஆ delete பண்ற setting] மூலம் delete பண்ணலாம்.

**Mahi:** ஸ்பீக்கர் 1: சரி, இப்போ S3 பாத்தாச்சு. ஆனா ஒரு application-ஓட இதயமே relational database தான். MySQL, Postgres மாதிரி database-க்கு cloud-ல என்ன தீர்வு?

**Thiru:** ஸ்பீக்கர் 2: அங்கதான் RDS அதாவது Relational Database Service [Relational Database Service - relational database-களை run பண்ணி manage பண்ற AWS service] வருது. இது ஒரு managed service [Managed service - server maintenance எல்லாமே company-யே பாத்துக்குற service]. point-in-time restore [Point-in-time restore - ஒரு குறிப்பிட்ட நேரத்துல database எப்படி இருந்துச்சோ அப்படியே time machine மாதிரி பின்னாடி கொண்டு போறது] option-லாம் இதுல இருக்கு.

## Performance & Trade-offs

**Mahi:** ஸ்பீக்கர் 1: main database crash ஆனா என்ன பண்றது? high availability-க்கு என்ன வழி?

**Thiru:** ஸ்பீக்கர் 2: அதுக்கு multi-AZ deployment [Multi-AZ deployment - ஒரு data center down ஆனாலும் இன்னொரு center-ல இருந்து app வேலை செய்யுற மாதிரி set பண்றது] use பண்ணனும். இதுல synchronous replication [Synchronous replication - main DB-லயும் backup DB-லயும் ஒரே நேரத்துல data-வை write பண்ற முறை] நடக்கும். main-ல write ஆகுற அதே second-ல standby-லயும் [Standby copy - main server down ஆனா use பண்றதுக்கு தயாரா இருக்குற backup server] write ஆகும்.

**Mahi:** ஸ்பீக்கர் 1: read traffic ரொம்ப அதிகமா இருந்தா? master database திணறுமே?

**Thiru:** ஸ்பீக்கர் 2: அதுக்கு read replicas [Read replicas - main database-ல இருந்து data-வை மட்டும் read பண்றதுக்காக உருவாக்கப்பட்ட duplicate copies] create பண்ணனும். இதுல asynchronous replication [Asynchronous replication - main DB-ல write ஆன உடனே success சொல்லிட்டு, அப்புறமா backup DB-க்கு data-வை அனுப்புற முறை] நடக்கும்.

## Summary

**Mahi:** ஸ்பீக்கர் 1: Okay, ஆனா பாரம்பரிய database-ல ஒரு limit-க்கு மேல scale பண்ண முடியாது. அதுக்கு AWS-ல Amazon Aurora [Amazon Aurora - AWS சொந்தமா உருவாக்குன ரொம்ப speed-ஆன, cloud-க்கு ஏத்த மாதிரி design பண்ணப்பட்ட relational database] இருக்கே.

**Thiru:** ஸ்பீக்கர் 2: சரியா சொன்னீங்க. Aurora-ல compute layer-ஐயும் storage layer-ஐயும் முழுசா பிரிச்சிட்டாங்க. network I/O [Network I/O - network வழியா data-வை read அல்லது write பண்ற வேலை] குறைவு, அதனால சாதாரண database-ஐ விட 5 மடங்கு வேகம்.

**Mahi:** ஸ்பீக்கர் 1: சரி, database load-ஐ குறைக்க local JVM cache use பண்ணலாமா?

**Thiru:** ஸ்பீக்கர் 2: cloud-ல auto scaling நடக்கும்போது பல server ஓடும். local cache வச்சா data inconsistency [Data inconsistency - ஒரு இடத்துல ஒரு data-வும், இன்னொரு இடத்துல பழைய data-வும் இருக்குற முரண்பாடான நிலை] வந்துடும். அதனால centralized cache வேணும்.

## Interview Deep-Dive Q&A

**Mahi:** ஸ்பீக்கர் 1: அதுக்குதான் Amazon ElastiCache [Amazon ElastiCache - memory-லயே data-வை save பண்ற வேகமான cloud caching service] use பண்ணனுமா?

**Thiru:** ஸ்பீக்கர் 2: ஆமா, Redis [Redis - ரொம்ப fast-ஆ வேலை செய்யுற in-memory database] அல்லது Memcached use பண்ணலாம். இது lazy loading [Lazy loading - முதல்ல cache-ல தேடிட்டு, அங்க இல்லனா மட்டும் database-க்கு போய் data-வை எடுக்குற முறை] pattern-ல sub-millisecond latency-ல [Sub-millisecond latency - ஒரு second-ஓட ஆயிரத்துல ஒரு பங்குக்கும் குறைவான நேரத்துல response கிடைக்கிறது] data-வை கொடுக்கும்.

**Mahi:** ஸ்பீக்கர் 1: gaming leaderboards [Gaming leaderboards - game-ல யார் first இருக்காங்கன்னு காட்ற score board] மாதிரி real time ranking-க்கு Redis-ல என்ன feature இருக்கு?

**Thiru:** ஸ்பீக்கர் 2: Redis-ல Sorted Sets [Sorted Sets - data-வை சேர்க்கும்போதே automatic-ஆ வரிசைப்படுத்தி வச்சுக்கிற Redis data structure] இருக்கு. இதை use பண்ணி microseconds-ல leaderboard update பண்ணிடலாம். ஆனா cache invalidation [Cache invalidation - database-ல data மாறும்போது, cache-ல இருக்குற பழைய data-வை delete பண்ற logic] logic-ஐ நாமதான் correct-ஆ எழுதணும்.

**Mahi:** ஸ்பீக்கர் 1: super. final-ஆ அந்த AI feature பத்தி சொல்லுங்க.

**Thiru:** ஸ்பீக்கர் 2: ஆமா, Aurora Machine Learning [Aurora Machine Learning - database-க்குள்ளயே AI models-ஐ வச்சு data-வை predict பண்ற feature] வந்துருக்கு. database-ஏ ஒரு அறிவாளியா மாறி user behavior-ஐ predict பண்ற காலம் வந்துருச்சு.

**Mahi:** ஸ்பீக்கர் 1: ரொம்ப அருமையான session. files-க்கு S3, structured data-வுக்கு [Structured data - table-ல row, column-ஆ நீட்டா அடுக்கி வச்சிருக்கற data] RDS அல்லது Aurora, performance-க்கு ElastiCache. நல்லா புரிஞ்சது. அடுத்த விரிவான அலசல்ல சந்திப்போம். நன்றி!