# Network Infrastructure & Security in AWS - Transcript

## Introduction

**Mahi:** இப்போ உங்களோட laptop-ல local host-ல ஒரு backend application Super-ஆ எழுதி முடிச்சிட்டீங்கன்னு வைப்போம். எந்த bugs-உம் இல்ல, database queries-லாம் பக்காவா optimize பண்ணிருக்கீங்க. API design-லாம் ரொம்ப அருமையா இருக்கு.

**Thiru:** ஆமா, ஒரு perfect setup.

**Mahi:** Correct. ஆனா அந்த perfect code-ஐ நீங்க cloud-ல deploy பண்ண மறுநிமிஷமே உலகத்துல இருந்து ஒரு 10,000 users ஒரே நேரத்துல access பண்ண try பண்ணும்போது ஒட்டுமொத்த system-உம் அப்படியே crash ஆயிடுது. இது ஏன் நடக்குது?

**Thiru:** இது actually-ஆ நிறைய backend developers face பண்ற ஒரு common problem தான்.

**Mahi:** ஆமா, ஏன்னா உங்க code எவ்வளவுதான் strong-ஆ இருந்தாலும், அதை தாங்கிப் பிடிக்கிற அந்த network கட்டமைப்பு சரியில்லன்னா, அந்த code-ஆல நிஜமாவே மூச்சு கூட விட முடியாது.

**Thiru:** ரொம்ப Correct-ஆ சொன்னீங்க. ஒரு backend developer-ஆ உங்களுக்கு code எப்படி வேலை செய்யுதுன்னு அத்துப்படி. ஆனா database query-ஐ optimize பண்றதுல காட்டுற அந்த ஒரு கவனத்தை, அந்த data எந்த வழியில travel ஆகுது, அதுக்கு network-ல என்னென்ன தடைகள் இருக்குன்னு புரிஞ்சுக்கறதுல பலரும் காட்டுறதில்ல.

**Mahi:** அதுக்கு காரணம் வந்து, இந்த networking அப்படினாலே ஏதோ IP address, routers, switch-னு ரொம்ப குழப்பமான ஒரு area-ங்கற ஒரு mindset தான்.

**Thiru:** கண்டிப்பா. ஒரு black box மாதிரி பாக்குறாங்க.

**Mahi:** Exactly. அதனாலதான் இந்த deep dive-ல நம்ம mission என்னன்னா, அந்த mindset-ஐ மாத்துறது தான். உங்களோட அந்த perfect backend code-ஐ பாதுகாப்பா வைக்கிறதுல ஆரம்பிச்சு, உலகத்துல எந்த மூலையில இருக்குற user-க்கும் அதை எப்படி fast-ஆ கொண்டு போய் சேர்க்கிறதுன்னு அத்தனை AWS networking concepts-ஐயும் நாம பாக்கப் போறோம்.

**Thiru:** அதுவும் உங்களுக்கு தெரிஞ்ச backend analogies வச்சு இதை ரொம்ப Simple-ஆ decode பண்ணிடலாம்.

**Mahi:** ஆமா. networking-ஐ இனி ஒரு black box-ஆ பாக்கத் தேவையில்ல. So first base-ல இருந்து ஆரம்பிப்போம். உங்க code பாதுகாப்பா run ஆகுறதுக்கான அந்த அடிப்படை அடித்தளம். Amazon VPC, அதாவது Virtual Private Cloud [Virtual Private Cloud - AWS-ல நமக்காக ஒதுக்கப்படுற ஒரு தனிப்பட்ட பாதுகாப்பான network].

**Thiru:** VPC. இதுதான் வந்து முழு network architecture-க்கும் ஒரு backbone மாதிரி.

**Mahi:** ஏதோ ஒரு real-world analogy-யோட பொருத்தி பாப்போம். இப்போ நீங்க புதுசா ஒரு பெரிய office building கட்டுறீங்கன்னு வைப்போம். AWS-ன்ற அந்த பிரம்மாண்டமான public உலகத்துல, உங்க company-க்காக உங்க code இயங்குறதுக்காக ஒரு தனிப்பட்ட இடத்தை சுத்தி வேலி போடுறீங்க. அதுதான் உங்களோட VPC, ஒரு virtual building.

**Thiru:** Correct. ஆனா ஒரு பெரிய office building-னா எல்லாத்தையும் ஒரே hall-ல கொட்டி வைக்க மாட்டோம் இல்லையா? வெவ்வேறு departments-க்கு தனித்தனி floors இல்லனா தனித்தனி rooms இருக்கும். அந்த rooms-ஐ தான் AWS-ல நம்ம subnets [Subnets - VPC-க்குள்ள இருக்குற சின்ன சின்ன தனித்தனி network பகுதிகள்] அப்படின்னு சொல்றோம்.

**Mahi:** Exactly. அந்த subnets-களை எப்படி பிரிக்கிறோம்ன்றது தான் network design-ஓட முதல் படியே.

**Thiru:** ஓஹோ. பாத்தீங்கன்னா ஒரு VPC-யை உருவாக்கும்போது ஒட்டுமொத்த network-க்கும் எத்தனை IP address தேவை அப்படிங்கறதை CIDR block மூலமா நாம முடிவு பண்ணுவோம்.

**Mahi:** இந்த CIDR-னா என்னது?

## Core Concept

**Thiru:** CIDR-னா Classless Inter-Domain Routing [Classless Inter-Domain Routing - network-ல IP address-களை பிரிச்சு கொடுக்கிற ஒரு முறை] அப்படின்னு சொல்வாங்க. ரொம்ப Simple-ஆ சொல்லணும்னா, உங்களோட building-ல எத்தனை devices-க்கு நீங்க address கொடுக்க முடியும்னு கணக்கு போடுற ஒரு network formula. இப்போ 10.0.0.0/16 அப்படின்னு ஒரு பெரிய CIDR block-ஐ வச்சு ஒரு VPC-யை உருவாக்கிட்டு, அதுக்குள்ள சின்ன சின்ன blocks-ஆ வச்சு subnet-ஐ பிரிப்போம்.

**Mahi:** புரிஞ்சது. இந்த subnet rooms-ல actually-ஆ ரெண்டு முக்கியமான வகை இருக்கு. Public Subnet [Public Subnet - internet-ல இருந்து நேரடியாக access பண்ணக்கூடிய network பகுதி] அப்புறம் Private Subnet [Private Subnet - internet-ல இருந்து நேரடியாக access பண்ண முடியாத பாதுகாப்பான network பகுதி].

**Thiru:** ஆமா, இது ரொம்ப முக்கியம். இத நம்ம building analogy-லயே பார்க்கலாம். இப்போ public subnet அப்படிங்கறது உங்களோட company-யோட reception area மாதிரி. internet-ல இருந்து யாரு வேணாலும் நேரடியா இந்த room-க்குள்ள வரலாம். உங்க web servers இல்லனா load balancers எல்லாமே இங்க தான் இருக்கும்.

**Mahi:** Correct. ஆனா மறுபக்கம் பாத்தீங்கன்னா, private subnet அப்படிங்கறது உங்க company-யோட ரொம்ப முக்கியமான ஒரு highly secure-ஆன server room மாதிரி. வெளிய இருந்து யாருக்கும் நேரடி access கிடையவே கிடையாது. இது வந்து ஒரு internal-only room. உங்க backend database, internal APIs எல்லாமே இந்த private subnet-ல தான் ரொம்ப பாதுகாப்பா இருக்கும்.

**Thiru:** இங்கதான் network design-ல ஒரு interesting-ஆன விஷயம் இருக்கு. இந்த rooms-க்கு IP address கொடுக்கும்போது ஒரு முக்கியமான technical detail-ஐ நம்ம கவனிக்கணும்.

**Mahi:** என்ன அது?

**Thiru:** ஒவ்வொரு subnet-ல இருந்தும் முதல் நாலு IP address, அப்புறம் கடைசி ஒரு IP address, ஆக மொத்தம் அஞ்சு IP address வந்து AWS தங்களுக்குள்ளயே reserve பண்ணி வச்சுப்பாங்க. அதை நாம எந்த ஒரு EC2 instance-க்கும் பயன்படுத்த முடியாது.

**Mahi:** ஒரு நிமிஷம், இது எதுக்காக? என்னோட guess என்னன்னா AWS அவங்களோட infrastructure தேவைக்காக ஏதோ ஒரு buffer மாதிரி வச்சுக்கறாங்கன்னு நினைக்கிறேன். முதல் நாலு IP-யை அவங்க router, DNS-க்காக எடுத்துக்கறாங்க, Okay. ஆனா அந்த கடைசி அஞ்சாவது IP அது broadcast address-க்காக [Broadcast Address - network-ல இருக்குற எல்லா devices-க்கும் ஒரே நேரத்துல message அனுப்ப use பண்ற address] ஒதுக்கப்படும்னு நான் படிச்சிருக்கேன். 

**Thiru:** ஆனா AWS VPC-க்குள்ள broadcast networking concept-ஏ கிடையாதுன்னு சொல்லும்போது, எதுக்காக இல்லாத ஒரு feature-க்கு ஒரு IP-யை இவங்க வீணாக்கணும்?

**Mahi:** அங்கதான் விஷயமே இருக்கு. அது வெறும் buffer கிடையாது, இதுக்கு பின்னாடி ஒரு ரொம்ப முக்கியமான engineering reason இருக்கு.

**Thiru:** ஓஹோ!

**Mahi:** VPC-க்குள்ள நிஜமாவே broadcast network கிடையாதுங்கறது நூறு சதவீதம் உண்மைதான். ஆனா பல பெரிய enterprise companies அவங்களோட ரொம்ப பழைய legacy networking softwares-ஐ வந்து cloud-க்கு migrate பண்ணும்போது...

**Thiru:** ஹா...

**Mahi:** அந்த பழைய softwares எல்லாமே network-ல கண்டிப்பா ஒரு broadcast IP இருக்கும்னு எதிர்பார்த்து தான் design பண்ணிருப்பாங்க. ஒருவேளை AWS அந்த broadcast IP-யை reserve பண்ணாம வேற ஏதாவது ஒரு normal server-க்கு கொடுத்துட்டாங்கன்னா, அந்த legacy softwares எல்லாமே broadcast IP-யை தேடி கிடைக்காம Total-ஆ crash ஆயிடும்.

**Thiru:** வாவ்!

**Mahi:** So, அந்த backward compatibility-க்காக [Backward compatibility - பழைய softwares-உம் புது system-த்துல எந்த பிரச்சனையும் இல்லாம வேலை செய்யுறதுக்கான ஏற்பாடு] தான் இயங்காத ஒரு feature-க்கு கூட ஒரு IP-யை AWS hardcode பண்ணி பாதுகாத்து வச்சிருக்காங்க.

**Thiru:** இந்த backward compatibility logic நிஜமாவே ஒரு பெரிய ஆஹா moment தான். ரொம்ப interesting-ஆ இருக்கு. சரி, இப்ப நம்ம network security-க்கு வருவோம். என்னோட backend database அந்த private subnet-ன்ற secure room-க்குள்ள இருக்கு. நேரடியா எந்த internet connection-உம் கிடையாது.

## Real-world Example

**Mahi:** Correct.

**Thiru:** ஆனா Sudden-ஆ அந்த database server run ஆகுறதுக்கு ஒரு முக்கியமான Linux security patch-ஐ உடனே download பண்ணி ஆகணும். இப்ப சொல்லுங்க, internet-ஏ இல்லாம அந்த OS update எப்படி அந்த secure room-க்குள்ள வரும்?

**Mahi:** அந்த முட்டுக்கட்டையை உடைக்க தான் நாம NAT Gateway-வை (NAT Gateway) use பண்றோம்.

**Thiru:** NAT Gateway?

**Mahi:** ஆமா. NAT அப்படின்னா Network Address Translation [Network Address Translation - private IP-யை public IP-ஆ மாத்தி internet-க்கு அனுப்புற முறை]. நீங்க என்ன பண்ணனும்னா, public subnet-ல ஒரு NAT gateway-வை உருவாக்கிடணும். இப்போ private subnet-ல இருக்குற database server-க்கு internet தேவைப்படும்போது அது நேரடியா வெளில போகாது. அதுக்கு பதிலா, அது public subnet-ல இருக்குற NAT gateway கிட்ட போய் எனக்கு இந்த patch தேவைன்னு ஒரு request கொடுக்கும்.

**Thiru:** எப்படின்னா, நம்ம secure room-க்குள்ள இருக்கற ஒருத்தர், reception-ல இருக்கற security guard கிட்ட ஒரு list-ஐ கொடுத்து கடையில போய் இத வாங்கிட்டு வான்னு சொல்ற மாதிரி. அந்த security guard தான் NAT gateway. சரியா?

**Mahi:** Perfect analogy. ஆனா இது எப்படி technically-ஆ route ஆகுது, அந்த connection எப்படி establish ஆகுது?

**Thiru:** அங்கதான் route table [Route Table - network traffic எந்த வழியா போகணும்னு வழிகாட்டுற ஒரு table] சொல்ல வரும். route table அப்படிங்கறது உங்க network-ல இருக்கிற வழிகாட்டி பலகை மாதிரி. private subnet-ஓட route table-ல internet-க்கு அதாவது 0.0.0.0/0 அப்படிங்கற address-க்கு போனும்னா NAT gateway-க்கு போனு ஒரு rule எழுதி வைப்போம்.

**Mahi:** Okay, புரிஞ்சது.

**Thiru:** So NAT gateway என்ன பண்ணும்னா, public internet வழியா போய் அந்த update-ஐ download பண்ணி ரொம்ப பாதுகாப்பா உள்ள கொண்டு வந்து database கிட்ட கொடுக்கும். இதனால என்ன ஒரு பெரிய advantage-னா, வெளிய இருந்த hackers-னால நேரடியா database-ஐ தொடவே முடியாது. ஆனா உள்ள இருக்கிற database தேவைப்பட்டா மட்டும் பாதுகாப்பா வெளில போய் வந்துக்கலாம்.

**Mahi:** ரொம்ப அருமையான mechanism. இப்போ என் code பாதுகாப்பா ஒரு building-க்குள் இருக்கு, internal routing எல்லாம் பக்காவா set பண்ணியாச்சு. ஆனா users எப்படி என் website-ஐ தேடி வருவாங்க? இந்த building-ஓட address அவங்களுக்கு தெரியணுமே.

**Thiru:** Correct. ஒரு address book வேணும். இங்கதான் Route 53 (Route 53) [Route 53 - AWS ஓட Domain Name System (DNS) service, website பேரை IP address-ஆ மாத்துறது] உள்ள வருது. ஒரு மிகச் சிறந்த traffic director-ஆ நான் இதை பார்க்கிறேன். ஒரு user அவங்க browser-ல உங்க website பேரை type பண்ண உடனே அவங்க முதல்ல meet பண்றது இந்த Route 53-ய தான். ஒரு புத்திசாலியான receptionist மாதிரி.

**Mahi:** ஆமா, Route 53 அப்படிங்கறது ஒரு சாதாரண DNS service கிடையாவே கிடையாது. பொதுவா DNS-னா Domain Name System, internet-ஓட phone book மாதிரி, பேர்களை IP முகவரியா மாத்துறது. ஆனா இதுல Route 53 வந்து ஒரு authoritative DNS [Authoritative DNS - ஒரு domain-க்கு முழு அதிகாரம் கொண்ட DNS, அதாவது இது சொல்றதுதான் final].

**Thiru:** Authoritative DNS-னா?

**Mahi:** அதாவது உங்களோட domain-க்கான இறுதி முடிவை எடுக்கிற அதிகாரம் அதுக்குத்தான் இருக்கு. நீங்களே records-ஐ update பண்ணலாம். அதோட இன்னொரு பெரிய விஷயம் என்னன்னா, AWS-லயே 100% availability [Availability - system down ஆகாம ஓடுற தன்மை] SLA கொடுக்கப்பட்ட ஒரே service இது மட்டும்தான்.

**Thiru:** ஒரு நிமிஷம், 100% availability-னா, எந்த situation-லயும் இது down ஆகாதுன்ற ஒரு guarantee-யா?

**Mahi:** ரொம்ப சரியா சொன்னீங்க. AWS ஓட ஒரு முழு data center-ஏ முடங்கிப் போனாலும் சரி, Route 53 மட்டும் எந்த தடங்கலும் இல்லாம இயங்கிக்கிட்டே இருக்கும். By the way, இதுக்கு ஏன் Route 53 னு பேர் வந்துச்சுன்னு உங்களுக்குத் தெரியுமா?

## Under the Hood

**Thiru:** ம்ம்... 53-னு ஒரு number இருக்கு, கண்டிப்பா ஏதோ ஒரு port number-ஆ [Port Number - computer-ல ஒரு குறிப்பிட்ட service-ஐ connect பண்ண use பண்ற number] இருக்கும்னு நினைக்கிறேன்.

**Mahi:** Correct. internet-ஓட ஆரம்ப காலத்துல இருந்தே DNS queries எல்லாமே network-ல port 53 வழியா தான் நடக்கும். அதை குறிக்கிற விதமா தான் இதுக்கு Route 53 அப்படின்னு பேர் வச்சாங்க.

**Thiru:** அந்த historical connection ரொம்ப சுவாரஸ்யமா இருக்கு. ஆனா இப்போ எனக்கு ஒரு technical சந்தேகம் வருது.

**Mahi:** கேளுங்க.

**Thiru:** இப்போ traditional DNS-ல பாத்தீங்கன்னா, ஒரு domain-ஐ இன்னொரு domain-ஓட link பண்ண CNAME (Canonical Name) use பண்ணுவாங்க. Example-க்கு, blog.example.com அப்படிங்கறத என்னோட load balancer-ஓட URL-க்கு CNAME மூலமா நான் point பண்ணலாம்.

**Mahi:** ஆமா, பண்ணலாம்.

**Thiru:** ஆனா AWS-ல alias record (Alias Record) அப்படின்னு ஒன்ன புதுசா வச்சிருக்காங்களே. நான் Simple-ஆ CNAME use பண்ணிட்டு போயிடலாமே, எதுக்கு இந்த alias record?

**Mahi:** அங்கதான் DNS ஓட அடிப்படை விதிகளுக்கும் cloud-ஓட மாறும் தன்மைக்கும் ஒரு பெரிய மோதல் வருது. DNS நெறிமுறைகள், அதாவது RFC rules படி, உங்களோட root domain-க்கு (Root Domain), அதாவது www இல்லாம வெறும் example.com-னு இருக்கும் இல்லையா, zone apex (Zone Apex)-னு சொல்வாங்க, அதுக்கு CNAME-ஐ பயன்படுத்தவே கூடாதுங்கறது ஒரு ரொம்ப கடுமையான விதி.

**Thiru:** ஓஹோ!

**Mahi:** ஆனா cloud உலகத்துல பாத்தீங்கன்னா, application load balancers-க்கு [Application Load Balancer - website traffic-ஐ servers-க்கு பிரிச்சு கொடுக்குறது] நிலையான IP address-ஏ கிடையாது. traffic-ஐ பொறுத்து அது background-ல மாறிக்கிட்டே இருக்கும்.

**Thiru:** ஆமாமா, அது scale ஆகும்போது IP மாறும்.

**Mahi:** அப்போ IP address மாறிக்கிட்டே இருக்குற ஒரு load balancer-ஐ, இந்த CNAME விதியை மீறாம எப்படி என் root domain-ஓட connect பண்றதுன்ற பிரச்சனை வருது.

**Thiru:** Exactly. அந்த முரண்பாட்டை தீர்க்க தான் AWS இந்த alias record அப்படிங்கிற முறையை கொண்டு வந்தாங்க. இது ஒரு smart-ஆன internal link மாதிரி செயல்படும். alias record மூலமா உங்களோட root domain-ஐ நேரடியாக ஒரு load balancer-க்கோ இல்லனா CloudFront-க்கோ (CloudFront) map பண்ண முடியும்.

**Mahi:** Okay.

**Thiru:** background-ல load balancer-ஓட IP address மாறினா கூட, Route 53-க்கு அது AWS ஓட internal API மூலமா automatically-ஆ தெரிஞ்சிடும். இதனால அந்த DNS resolution எந்த ஒரு தடையுமே இல்லாம smooth-ஆ நடக்கும்.

**Mahi:** வாவ்! இது நிஜமாவே ஒரு ரொம்ப smart-ஆன traffic driver தான். ஆனா ஒரு user traffic உள்ள வரும்போது, அதை எந்த server-க்கு அனுப்பணும்னு Route 53 எப்படி முடிவு பண்ணுது? அது வெறும் address-ஐ மட்டும் சொல்ற ஒரு directory மாதிரி இல்லையா?

**Thiru:** கண்டிப்பா இல்ல. அது வெறும் முகவரியை மட்டும் சொல்றது கிடையாது. எந்த முகவரியை சொல்லணும் அப்படிங்கறதை தீர்மானிக்கறதுக்கு Route 53-ல பல routing policies [Routing Policies - traffic-ஐ எப்படி, எந்த server-க்கு அனுப்பணும்னு முடிவு பண்ற rules] இருக்கு.

## Edge Cases & Scenarios

**Mahi:** என்னென்ன policies?

**Thiru:** Simple routing இருக்கு, weighted routing (Weighted Routing) அதாவது traffic-ஐ சதவீத அடிப்படையில பிரிக்கிறது. அப்புறம் failover routing (Failover Routing), ஒரு server பழுதானா உடனே traffic-ஐ வேறொன்றுக்கு மாத்துறது. அப்புறம் ரொம்ப முக்கியமான latency-based routing-னு (Latency-based Routing) பல policies இருக்கு.

**Mahi:** இதுல இந்த latency-based routing-ஐ கொஞ்சம் உற்று கவனிச்சா, அது எப்படி வேலை செய்யுதுன்னு தெரிஞ்சுக்க ரொம்ப ஆர்வமா இருக்கு. ஏன்னா உலகத்துல ஒரு மூலையில இருக்குற user-க்கு, எந்த server ரொம்ப பக்கத்துல இருக்குன்னு Route 53-க்கு எப்படி தெரியும்? ஒவ்வொரு முறையும் அது user-ஓட location-ஐ கணிச்சு, அங்கிருந்து ஒவ்வொரு server-ஓட தூரத்தையும் calculate பண்ணி பதில் சொல்லுமா?

**Thiru:** இல்ல இல்ல, ஒவ்வொரு முறையும் அந்த calculation-ஐ அது live-ஆ செய்யாது. அப்படி செஞ்சா அதுவே ஒரு பெரிய latency-யை [Latency - data போய் சேர ஆகுற தாமதம்] உருவாக்கிடும்.

**Mahi:** பின்ன எப்படி பண்ணுது?

**Thiru:** AWS என்ன பண்றாங்கன்னா, உலகமெங்கிலும் இருக்கிற networks-ல இருந்து, அதாவது anycast IPs (Anycast IPs) மற்றும் BGP (BGP) நெறிமுறைகள் மூலமா தொடர்ச்சியா latency அளவீடுகளை collect பண்ணி ஒரு பெரிய database-ஐ தங்களுக்குள்ளேயே maintain பண்றாங்க.

**Mahi:** ஓஹோ, முன்னாடியே data-வை ready-ஆ வச்சிருக்காங்க.

**Thiru:** ஆமா, ஒரு user query வரும்போது, அவரோட IP address எந்த geographical location-ல இருந்து வருதுன்னு பார்த்து, அந்தப் பகுதிக்கு எந்த AWS region மிகக் குறைவான milliseconds-ல respond பண்ணும் அப்படிங்கறத அவங்க database-ஐ வச்சு உடனே தீர்மானிச்சு அதற்கான IP-யை கொடுக்கும்.

**Mahi:** அருமை. அப்போ Route 53 எனக்கு பக்கத்துல இருக்குற server-க்கு route பண்ணிடுச்சு. ஆனா இங்க ஒரு பெரிய பிரச்சனை வருது. இப்போ நான் மும்பையில இருக்கேன், என் application server வந்து அமெரிக்கால இருக்கு. என் website-ல இருக்கிற ஒரு 100 MB video-வை நான் பாக்கணும். இதுக்கு நான் ஒவ்வொரு முறையும் அமெரிக்கா வரைக்கும் போய் அந்த data-வை எடுத்துட்டு வந்தா latency ரொம்ப ரொம்ப அதிகமா ஆகுமே.

**Thiru:** ஆஹா, அது ரொம்ப slow-ஆ இருக்கும்.

**Mahi:** இப்போ ஒரு backend developer-ஆ நம்ம என்ன பண்ணுவோம்? அடிக்கடி தேவைப்படுற data-வை ஒவ்வொரு முறையும் database-க்கு போய் தேடாம, Redis (Redis) இல்லனா Memcached-ல (Memcached) cache பண்ணி வச்சுப்போம் இல்லையா? அதே concept-ஐ இங்க networking-ல global level-ல apply பண்ண முடியுமா?

**Thiru:** கண்டிப்பா முடியும். அந்த global caching logic தான் Amazon CloudFront (Amazon CloudFront). இது வந்து ஒரு CDN (CDN) அதாவது Content Delivery Network [Content Delivery Network - website files-ஐ user-க்கு பக்கத்துல இருக்கிற server-ல save பண்ணி வேகமா கொடுக்கிற network].

**Mahi:** Okay, இது எப்படி work ஆகுது?

**Thiru:** இப்போ நீங்க கேட்ட அதே video-வை முதல் முறை ஒருத்தர் download பண்ணும்போது அது அமெரிக்கா server-ல இருந்து, அதாவது origin-ல (Origin) இருந்து வரும். ஆனா CloudFront என்ன பண்ணும்னா, அந்த video-வோட ஒரு copy-யை மும்பையில இருக்குற ஒரு edge location-ல (Edge Location) save பண்ணி வச்சுக்கும்.

**Mahi:** அப்படின்னா?

**Thiru:** அப்படின்னா அடுத்த முறை நீங்களோ இல்ல இந்தியால இருக்குற வேறொரு user-ஓ அதே video-வை கேட்டா, traffic மறுபடியும் அமெரிக்கா வரைக்கும் போகாது. அந்த மும்பை edge location-ல இருந்தே வெறும் சில milliseconds-ல video delivery ஆயிடும்.

**Mahi:** இது ரொம்ப powerful-ஆன விஷயம். ஆனா cache அப்படின்னு சொல்லிட்டாலே backend developers-க்கு வர்ற மிகப்பெரிய தலைவலி ஒன்னு இருக்கு.

## Performance & Trade-offs

**Thiru:** என்னது, cache invalidation-ஆ?

**Mahi:** Exactly, cache invalidation [Cache Invalidation - server-ல file மாறும்போது, cache-ல இருக்குற பழைய file-ஐ அழிச்சிட்டு புதுசா update பண்றது]. நான் backend-ல ஒரு புது profile picture-ஐயோ இல்ல ஒரு CSS (CSS) file-ஐயோ update பண்ணிடுவேன். ஆனா front end-ல இன்னும் அந்த பழைய design-ஏ தெரியுதுன்னு customers complaint பண்ணுவாங்க. CloudFront-ல இந்த caching mechanism எப்படி work ஆகுது? இதை எப்படி handle பண்றாங்க?

**Thiru:** CloudFront-லயும் இதே பிரச்சனை இருக்கத்தான் செய்யுது. நீங்க backend-ல ஒரு file-ஐ update பண்ணாலும் CloudFront-க்கு அது உடனே தெரியாது. ஒவ்வொரு file-க்கும் ஒரு TTL (TTL), அதாவது Time to Live [Time to Live - ஒரு file-ஐ எவ்வளவு நேரம் cache-ல வச்சிருக்கணும்னு சொல்ற time limit] set பண்ணிருப்போம். அந்த time முடியுற வரைக்கும் CloudFront பழைய file-ஐத்தான் காட்டிட்டு இருக்கும்.

**Mahi:** அப்போ இதை உடனே சரி பண்ணனும்னா என்ன பண்றது?

**Thiru:** நீங்க ஒரு invalidation request-ஐ (Invalidation Request) trigger பண்ணனும். இதன் மூலமா edge locations-ல இருக்குற அந்த பழைய cache-ஐ மொத்தமா அழிச்சிட்டு புது file-ஐ தேடி எடுக்கறதுக்கு CloudFront-ஐ நாம force பண்ணலாம்.

**Mahi:** ஆனா ஒரு நிமிஷம், இந்த invalidation requests-க்கு AWS தனியா காசு வாங்குவாங்களே? ஒவ்வொரு தடவையும் file update பண்ணும்போது இதுக்கு pay பண்ணனுமா?

**Thiru:** அங்கதான் நீங்க smart-ஆ யோசிக்கணும். ஒவ்வொரு முறை file-ஐ மாத்தும்போதும் invalidation பண்ணி காசை waste பண்றதை தவிர்க்க, backend developers cache busting (Cache Busting) அப்படிங்கிற ஒரு technique-ஐ use பண்ணுவாங்க.

**Mahi:** cache busting... அதாவது file name மாத்துறதா?

**Thiru:** ஆமா, file பேருக்கு பின்னாடி ஒரு version number-ஐயோ இல்ல ஒரு hash-ஐயோ (Hash) சேர்த்துருவாங்க. உதாரணமா, style_v2.css அப்படின்னு மாத்திடுவாங்க. இதனால CloudFront அதை ஒரு புது file-ஆவே நினைச்சு தானாகவே origin-ல இருந்து அந்த புது file-ஐ எடுத்துட்டு வந்து cache பண்ணிக்கும். காசும் மிச்சமாகும், உங்களுக்கு அந்த invalidation தலைவலியும் இருக்காது.

**Mahi:** இது ரொம்ப Super trick தான். Java application-ல பண்ற அதே logic தான் இங்கயும். சரி, இப்போ CloudFront-ஐ எல்லா வகையான network traffic-க்கும் நம்ம use பண்ணிடலாமா? Example-க்கு, என்னோட application ஒரு multiplayer gaming app இல்லனா ஒரு IoT (IoT) device-ல இருந்து வர்ற தொடர்ச்சியான data stream-னு வைப்போம். இதுல HTTP (HTTP) traffic இருக்காது. Full-ஆ UDP (UDP) இல்லனா TCP (TCP) packets தான் போகும். இதுக்கும் CloudFront set ஆகுமா?

**Thiru:** இல்ல, அங்கதான் பலரும் ஒரு தப்பு பண்றாங்க. CloudFront அப்படிங்கறது அடிப்படையில HTTP மற்றும் HTTPS traffic-க்கும், cache பண்ணக்கூடிய data-வுக்கும் மட்டுமே ரொம்ப உகந்தது.

**Mahi:** அப்போ அந்த gaming, IoT traffic என்ன பண்றது?

**Thiru:** அந்த மாதிரி non-HTTP traffic-க்கு, AWS Global Accelerator (AWS Global Accelerator) அப்படிங்கிற இன்னொரு service-ஐ வடிவமைச்சிருக்காங்க.

**Mahi:** Global Accelerator... பேரே ரொம்ப powerful-ஆ இருக்கு. இதுக்கும் CloudFront-க்கும் பின்னணியில என்ன architecture வித்தியாசம் இருக்கு?

**Thiru:** சாதாரணமாக, public internet-ல ஒரு packet travel ஆகுதுன்னா, அது பல ISPs, பல routers வழியா, அதாவது BGP hops-னு (BGP Hops) சொல்வாங்க, தத்தி தத்தி போகும். வழியில traffic jam ஆகலாம் இல்ல packet loss ஆகலாம்.

**Mahi:** ஆமா, அது ரொம்ப unpredictable.

**Thiru:** ஆனா, Global Accelerator என்ன பண்ணும்னா, user-ஓட packet-ஐ அவருக்கு மிக அருகில் இருக்கிற edge location-லேயே receive பண்ணி, public internet-ஐ விட்டு உடனே வெளியே கொண்டு வந்து, AWS-ஓட சொந்த dark fiber private network cable-க்குள்ள நுழைச்சிடும்.

## Summary

**Mahi:** வாவ், அதாவது traffic நெரிசல் அதிகமா இருக்குற public road-ல இருந்து packet-ஐ எடுத்து, AWS-ஓட பிரத்யேக private express highway-ல போட்டு விடுறாங்க, அப்படித்தானே?

**Thiru:** Exactly. இதனால latency ரொம்ப ரொம்ப கணிசமா குறையும், packet loss-உம் இருக்காது. அதுமட்டுமில்லாம, Global Accelerator உங்களுக்கு மாறாத ரெண்டு static anycast IP address-ஐ கொடுக்கும்.

**Mahi:** static IP-யா?

**Thiru:** ஆமா. backend-ல உங்களோட server IP-க்கள் மாறினா கூட, users இந்த நிலையான IP-யை மட்டும்தான் contact பண்ணுவாங்க. security firewall rules (Firewall rules) set பண்றதுக்கு இது ரொம்ப ரொம்ப helpful-ஆ இருக்கும்.

**Mahi:** Super. network design இப்போ எனக்கு முழுமையா புரியுது. நம்ம code VPC-ல பாதுகாப்பா இருக்கு. Route 53 மூலமா traffic smart-ஆ route ஆகுது. data edge-ல cache ஆகுது, gaming traffic express highway-ல போகுது. எல்லாம் Super-ஆ போயிட்டு இருக்குற ஒரு நாள், Sudden-ஆ மும்பையில ஒரு பெரிய வெள்ளம் இல்ல நிலநடுக்கம் வந்து AWS region மொத்தமாக offline போயிடுச்சுன்னு வச்சுப்போம்.

**Thiru:** அது ஒரு பெரிய disaster.

**Mahi:** கண்டிப்பா, ஒரு backend developer-ஓட மிகப்பெரிய nightmare-ஏ இதுதான். இந்த disaster-ல இருந்து company-யோட data-வையும் business-ஐயும் எப்படி காப்பாத்துறது?

**Thiru:** இதுதான் networking-ஓட உச்சகட்டம்னு சொல்லலாம். Disaster Recovery மற்றும் Business Continuity [Disaster Recovery & Business Continuity - பெரிய பேரழிவு நடந்தாலும் business பாதிக்காம தொடர்ந்து நடக்குறதுக்கான ஏற்பாடு]. AWS Solutions Architect exams-ல கூட ரொம்ப முக்கியமா எதிர்பார்க்கப்படுற ஒரு பகுதி இது.

**Mahi:** ஓஹோ.

**Thiru:** ஒரு பேரிடர் நடக்கும்போது, system offline போறது இயற்கை தான். ஆனா எவ்வளோ சீக்கிரம் அத நாம மறுபடியும் உயிர்ப்பிக்கிறோம், எவ்வளோ data-வை இழக்காம காப்பாத்துறோம் அப்படிங்கறது தான் நமது architecture-ஓட உண்மையான வெற்றி.

**Mahi:** இந்த disaster recovery-யை design பண்றதுக்கு ரெண்டு முக்கியமான metrics இருக்குன்னு நான் படிச்சிருக்கேன். RPO மற்றும் RTO.

**Thiru:** ஆமா. இதுல RPO (RPO), அதாவது Recovery Point Objective (Recovery Point Objective) அப்படிங்கறதை ஒரு data loss metric-ஆ நான் பாக்குறேன். அதாவது ஒரு company எவ்வளவு மணி நேர data-வை இழக்க தயாராக இருக்கு அப்படிங்கறதுக்கான ஒரு அளவுக்கோல். இது actually-ஆ எப்படி வேலை செய்யுது?

**Mahi:** இத ஒரு real-world உதாரணத்தோட நான் விளக்குறேன். உங்ககிட்ட ஒரு e-commerce application இருக்கு. நீங்க உங்களோட database-ஐ தினமும் ராத்திரி 12 மணிக்கு மட்டும்தான் backup எடுக்குறீங்கன்னு வச்சுப்போம்.

**Thiru:** சரி.

**Mahi:** அடுத்த நாள் மதியம் 12 மணிக்கு server ஏதோ ஒரு பேரிடரால crash ஆயிடுச்சு. இப்ப உங்ககிட்ட நேத்திய backup மட்டும்தான் இருக்கும். இடையில நடந்த அந்த 12 மணி நேர orders, customer details எல்லாமே அழிஞ்சிருச்சு. அப்படி என்றால் உங்களோட RPO இங்க 12 மணி நேரம்.

**Thiru:** ஓ, அப்போ அந்த 12 மணி நேர RPO-வை நான் zero-வா மாத்தணும்னா, அதாவது ஒரு பைசா data கூட அழியக்கூடாதுன்னா, நான் என் database design-ல என்ன மாற்றம் பண்ணனும்?

**Mahi:** நீங்க database level-ல cross-region replication-ஐ (Cross-region replication) set பண்ணனும். மும்பையில ஒரு data write ஆகும்போதே சிங்கப்பூர் region-லயும் அது எழுதப்படணும். இதுல synchronous, asynchronous-னு ரெண்டு type இருக்குமே?

## Interview Deep-Dive Q&A

**Thiru:** Correct. Synchronous replication-ல (Synchronous replication) ரெண்டு region-லயும் data உறுதியா எழுதப்பட்ட பிறகு தான் user-க்கு success message போகும். இது data-வை 100% காப்பாத்தும். ஆனா, network latency-யை அதிகப்படுத்தும்.

**Mahi:** அப்போ asynchronous (Asynchronous)?

**Thiru:** Asynchronous முறையில, மும்பையில எழுதப்பட்ட உடனே user-க்கு response போயிடும். பின்னாடி அது சிங்கப்பூருக்கு copy ஆகும். இதுல வேகம் அதிகமா இருக்கும். ஆனா suppose அந்த gap-ல crash ஆனா, millisecond அளவிலான data loss ஆக வாய்ப்பிருக்கு.

**Mahi:** ரொம்ப தெளிவா புரியுது. அப்போ RTO (RTO), அதாவது Recovery Time Objective (Recovery Time Objective) னா என்ன?

**Thiru:** இத நான் ஒரு downtime metric-ஆ பாக்குறேன். server down ஆன பிறகு மறுபடியும் உங்க application-ஐ online-க்கு கொண்டு வர எவ்வளவு நேரம் எடுத்துக்கிறீங்க அப்படிங்கறது தான் RTO.

**Mahi:** Perfect. அதாவது system fail ஆனதும், புது server-ஐ உருவாக்கி, backup-ஐ restore பண்ணி, DNS-ஐ மாத்தி application-ஐ மறுபடியும் live-க்கு கொண்டு வர ஒரு மணி நேரம் ஆகும்னா, உங்களோட RTO 1 hour.

**Thiru:** மிக துல்லியமான கணக்கீடு. இந்த RPO மற்றும் RTO ஓட இலக்குகளை பொறுத்து businesses ஒரு நாலு வகையான DR (DR) strategies-ஐ use பண்ணுவாங்க.

**Mahi:** அது என்னென்ன strategies?

**Thiru:** முதலாவது Backup and Restore. இதுல செலவு ரொம்ப ரொம்ப குறையுது. ஆனா system online-க்கு வர பல மணி நேரம் ஆகும். அதாவது அதிக RTO. இரண்டாவது Pilot Light. இங்க database மட்டும் எப்பவுமே run ஆயிட்டு இருக்கும். ஆனா application servers off-ல இருக்கும். disaster வந்தா மட்டும் அதை on பண்ணிப்போம்.

**Mahi:** Okay, மூணாவது?

**Thiru:** மூணாவது Warm Standby. இதுல database-உம், ஒரு சின்ன அளவிலான application server-உம் எப்பவுமே run ஆயிட்டு இருக்கும். disaster வந்தா, அந்த சின்ன server-ஐ உடனே scale up பண்ணிப்போம்.

**Mahi:** அப்போ நாலாவது என்ன, full setup-ஆ?

**Thiru:** ஆமா, நாலாவது Multi-site Active-Active (Multi-site Active-Active). ரெண்டு வெவ்வேறு regions-உம் 100% முழுமையான system எப்பவுமே run ஆயிட்டே இருக்கும்.

**Mahi:** வாவ், இந்த multi-site active-active முறையில பாத்தீங்கன்னா, RTO மற்றும் RPO கிட்டத்தட்ட zero-வா இருக்கும். பேரிடர் வந்தாலும் எந்த பாதிப்பும் user-க்கு தெரியவே தெரியாது. ஆனா இதுக்காகற அந்த infrastructure செலவு கண்டிப்பா மலைக்க வைக்கிற அளவுக்கு இருக்குமே?

**Thiru:** கண்டிப்பா இருக்கும். அதனாலதான் எந்த DR strategy-யை தேர்ந்தெடுக்கிறோம் அப்படிங்கறது அந்த company-யோட budget மற்றும் business தேவையைப் பொறுத்துதான் முடிவு பண்ணனும். ஒரு backend developer-ஆ வெறும் code எழுதுறதோட நின்னுடாம, அந்த code இயங்குற இந்த முழுமையான infrastructure-ஐயும் நீங்க தெரிஞ்சுக்கும் போதுதான் உங்களால நிஜமான ஒரு resilient application-ஐ (Resilient application) design பண்ண முடியும்.

**Mahi:** உலகளாவிய caching-ஐ பாத்துக்குறது, Global Accelerator gaming traffic-ஐ private express highway-ல கொண்டு போகுது. கடைசியா RPO, RTO மூலமா நம்ம system-ஐ பேரிடர்கள்ல இருந்து எப்படி காப்பாத்துறதுன்னு புரிஞ்சுக்கிட்டோம்.

**Thiru:** இந்த concepts எல்லாமே உங்களோட அன்றாட backend logic-ஓட நேரடியா தொடர்புடையவை தான்.

**Mahi:** networking அப்படிங்கறது ஒரு தனித்தீவு கிடையாது. அது உங்களோட application-ஓட ஒரு extension தான். இந்த விஷயங்கள் எல்லாம் யோசிச்சு பார்க்கும்போது இறுதியா ஒரு சிந்தனை எனக்குள்ள வருது. network தொழில்நுட்பம் நாளுக்கு நாள் ரொம்ப வேகமா வளர்ந்துட்டே போகுது. இன்னைக்கு நம்ம CloudFront-ஓட edge locations-ல வெறும் static படங்களையும் வீடியோக்களையும் மட்டுமே cache பண்றோம்.

**Thiru:** ஆமா.

**Mahi:** ஆனா வருங்காலத்துல இந்த edge locations வெறும் ஒரு cache-ஆ மட்டும் இல்லாம, உங்களோட backend compute logic-ஐயே, அதாவது நீங்க எழுதுற Java இல்லனா Python functions-ஐயே, அந்த edge location-க்கு நகர்த்தி user-க்கு ரொம்ப பக்கத்திலேயே execute பண்ணா என்ன ஆகும்?

**Thiru:** அது ஒரு மிகப்பெரிய paradigm shift-ஆ (Paradigm shift) இருக்கும்.

**Mahi:** கண்டிப்பா. அப்படி ஒரு நிலை வந்தா, உலகம் முழுக்க பரவியிருக்கிற ஒரு network-ஏ உங்களோட servers-ஆ மாறிடும். ஒரு குறிப்பிட்ட இடத்துல மட்டும் run ஆகுற பாரம்பரியமான central backend servers-ஓட தேவையே இல்லாம போயிடுமா? edge computing-ஓட இந்த பரிணாம வளர்ச்சி எதிர்கால backend development-ஐ எப்படி தலைகீழா மாற்றிப் போடப் போகுது? இந்த சுவாரஸ்யமான கேள்வியை நீங்களே கொஞ்சம் அலசிப் பாருங்க. இது உங்களோட அடுத்தகட்ட தேடலுக்கான ஒரு திறவுகோலா இருக்கட்டும். மீண்டும் ஒரு ஆழமான அலசலில் சந்திப்போம்.
