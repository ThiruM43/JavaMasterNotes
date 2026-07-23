# Java Interview Podcast — Episode: SQL Injection Prevention
### Hosts: Mahi & Thiru

---

**Mahi:** வணக்கம் Thiru! Security-ல ரொம்ப முக்கியமான topic ஆன SQL Injection பத்தி பேசலாம். SQL Injection-னா என்ன?

**Thiru:** வணக்கம் Mahi! **SQL Injection** [SQLi] என்பது ஒரு attack. Hacker தன்னோட malicious SQL queries-ஐ input fields-ல (login form, search box) type பண்ணி, database-ஐ ஏமாத்தி data-ஐ திருடுவாங்க இல்லனா delete பண்ணுவாங்க.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** கண்டிப்பா Mahi. நீ ஒருத்தர்கிட்ட "எனக்கு ₹100 வேணும்"னு ஒரு பேப்பர்ல எழுதி குடுக்குற. அவர் அதை அப்படியே cashier-கிட்ட குடுப்பாரு. Hacker என்ன பண்ணுவான்? பேப்பர்ல "எனக்கு ₹100 வேணும், அப்புறம் லாக்கர் சாவியையும் குடு"னு எழுதிடுவான். Cashier அதை உண்மைனு நம்பி சாவி குடுத்துருவாரு. இதுதான் SQL Injection.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** String concatenation use பண்ணி query எழுதுனா இந்த problem வரும். Hacker `' OR '1'='1` அப்படின்னு input குடுத்தா, condition always true ஆகிடும். இதை தடுக்க **PreparedStatement** (Parameterized query) use பண்ணனும். இந்த code-ஐ பாரு:

```java
// Vulnerable Code (DON'T DO THIS)
String query = "SELECT * FROM users WHERE username = '" + user + "' AND pwd = '" + pwd + "'";
Statement stmt = connection.createStatement();
ResultSet rs = stmt.executeQuery(query);

// Secure Code (DO THIS)
String secureQuery = "SELECT * FROM users WHERE username = ? AND pwd = ?";
PreparedStatement pstmt = connection.prepareStatement(secureQuery);
pstmt.setString(1, user);
pstmt.setString(2, pwd);
ResultSet rs = pstmt.executeQuery();
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. Statement மற்றும் PreparedStatement-க்கு உள்ள வித்தியாசத்தை இந்த table-ஐ பாரு:

| Aspect | Statement | PreparedStatement |
|--------|-----------|-------------------|
| Compilation | Every time execute ஆகும்போது compile ஆகும் | ஒரு தடவ தான் pre-compile ஆகும் |
| Security | SQL Injection-க்கு வாய்ப்பு அதிகம் | SQL Injection-ஐ தடுக்கும் |
| Performance | மெதுவாக வேலை செய்யும் | Fast (Pre-compiled) |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** "JPA / Hibernate use பண்ணா SQL Injection வராதா?" அப்டின்னு கேட்பாங்க. Default-ஆ வராது. ஆனா, நீ manually `@Query` annotation-ல `SELECT * FROM User WHERE name = ` + variable அப்டினு concatenate பண்ணா கண்டிப்பா வரும். Named parameters (`:name`) use பண்ணனும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** `ORDER BY` clause-ல table column name-ஐ dynamically pass பண்ணும்போது parameters use பண்ண முடியாது. அங்க hacker injection பண்ண வாய்ப்பு இருக்கு. அதை தடுக்க whitelist validation பண்ணனும். WAF (Web Application Firewall) use பண்ணி attacks-ஐ block பண்ணலாம்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க database queries-க்கு Spring Data JPA தான் use பண்றோம். Dynamic search criteria-க்கு JPA Specifications use பண்றோம், அதனால SQLi problem சுத்தமா avoid பண்ணிருக்கோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Architect-ஆ, "Least Privilege Principle" follow பண்ணனும். Application use பண்ற Database user-க்கு DROP TABLE, DELETE பண்ற permissions இருக்க கூடாது. Stored procedures-ஐ கவனமா எழுதணும், அதுலயும் injection வர வாய்ப்பு இருக்கு.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** PreparedStatement எப்படி SQL Injection-ஐ தடுக்குது?
*Answer:* PreparedStatement query-ஐ முதல்லயே compile பண்ணிடும். அப்புறம் user input-ஐ வெறும் data-ஆ மட்டும் தான் பார்க்கும், SQL commands-ஆ பார்க்காது. அதனால escape characters தானாக handle ஆகிடும்.

**Q:** LIKE operator use பண்ணும்போது எப்படி parameter set பண்ணுவீங்க?
*Answer:* Query-ல `LIKE ?` அப்படின்னு வச்சுட்டு, Java code-ல `pstmt.setString(1, "%" + keyword + "%");` அப்டினு set பண்ணனும்.

---

## Quick Revision Summary

- SQL Injection database-ஐ compromise பண்ணும் ஒரு attack.
- String concatenation தவிர்க்க வேண்டும்.
- PreparedStatement parameters-ஐ data-ஆக மட்டுமே கருதும்.
- JPA/Hibernate-ல் named parameters (`:variable`) பயன்படுத்த வேண்டும்.
- Database access-க்கு least privilege principle follow பண்ணனும்.
