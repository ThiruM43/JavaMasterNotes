# Java Interview Podcast — Episode: Exception Handling in Spring
### Hosts: Mahi & Thiru

---

**Mahi:** இன்னைக்கு Exception Handling பத்தி பேசலாம். Spring-ல exceptions-ஐ எப்படி handle பண்றது Thiru?

**Thiru:** Spring-ல **Global Exception Handling** [எல்லா controllers-ல வர்ற exceptions-ஐ ஒரே இடத்துல handle பண்றது] ரொம்ப popular. இதுக்கு `@ControllerAdvice` use பண்ணுவோம்.

---

## 1. Real World Analogy

**Mahi:** Analogy ஏதாவது சொல்லுங்க, easy-ஆ புரிஞ்சுக்க.

**Thiru:** நீங்க ஒரு company-ல வேலை பாக்குறீங்க. எந்த department-ல (Controller) பிரச்சனை வந்தாலும், HR department (ControllerAdvice) அதை handle பண்ணி, proper ஆனா solution (Response) கொடுப்பாங்க. இதுதான் centralized handling.

---

## 2. Internals — How It Actually Works

**Mahi:** Internal level-ல எப்படி work ஆகுது?

**Thiru:** DispatcherServlet-ல exception வந்தா, அது `HandlerExceptionResolver`-க்கு போகும். அது `@ExceptionHandler` annotated methods-ஐ தேடி கண்டுபிடிச்சு execute பண்ணும்.

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(UserNotFoundException ex) {
        ErrorResponse error = new ErrorResponse("USER_NOT_FOUND", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
}
```

---

## 3. Comparison Table

**Mahi:** Thiru, இதை ஒரு simple comparison table-ஆ சொல்ல முடியுமா?

**Thiru:** கண்டிப்பா Mahi. இந்த table-ஐ பாரு:
| Annotation | Scope | Usage |
|--------|----------|----------|
| `@ExceptionHandler` | Specific Controller | அந்த controller-ல வர்ற exceptions-க்கு மட்டும் |
| `@ControllerAdvice` | Global (All Controllers) | எல்லா controllers-க்கும் common exceptions handle பண்ண |
| `@ResponseStatus` | Method or Exception class | Exception வரும்போது HTTP status code மாத்த |

---

## 4. Edge Cases

**Mahi:** Interview-ல என்ன மாதிரி traps இருக்கும்?

**Thiru:** Multiple `@ExceptionHandler` methods இருந்தா, Spring எது most specific exception class-ஓ அதை தான் call பண்ணும். Parent exception (`Exception.class`) கீழ இருந்தா கூட specific child exception-ஐ தான் choose பண்ணும்.

---

## 5. Production Concerns

**Mahi:** Production-ல இதுல என்ன problems வரும்?

**Thiru:** Stacktrace-ஐ அப்படியே client-க்கு அனுப்ப கூடாது. Security risk. Proper error code, message மட்டும் தான் அனுப்பணும். PII data logs-ல விழாம பாத்துக்கணும்.

---

## 6. ECR Now Production Experience

**Mahi:** நம்ம ECR Now system-ல இது எப்படி use ஆகுது?

**Thiru:** ECR Now-ல (Electronic Case Reporting Spring Boot system for CDC reporting via IMAP+FHIR) நாங்க FHIR server errors-ஐ catch பண்ணி, standard OperationOutcome JSON format-ல error response அனுப்புவோம். இதுக்கு `@RestControllerAdvice` தான் use பண்ணிருக்கோம்.

---

## 7. Senior/Architect Perspective

**Mahi:** Architect-ஆ யோசிக்கும்போது என்ன factors consider பண்ணனும்?

**Thiru:** Error responses consistent-ஆ இருக்கணும். RFC 7807 Problem Details for HTTP APIs standard-ஐ follow பண்றது நல்லது. Microservices-ல எல்லா services-உம் ஒரே error format-ஐ maintain பண்ணனும்.

---

## 8. Interview Deep-Dive Questions

**Mahi:** Technical round-ல deep-dive questions எப்படி இருக்கும்?

**Thiru:** இங்க சில examples இருக்கு:

**Q:** `@ControllerAdvice` மற்றும் `@RestControllerAdvice` என்ன வித்தியாசம்?
*Answer:* `@RestControllerAdvice` = `@ControllerAdvice` + `@ResponseBody`. இது JSON/XML response அனுப்ப use ஆகுது.

**Q:** Filter-ல வர exception-ஐ `@ControllerAdvice` handle பண்ணுமா?
*Answer:* பண்ணாது! `@ControllerAdvice` DispatcherServlet-க்கு உள்ள தான் work ஆகும். Filter அதுக்கு வெளியில இருக்கு. அதனால Filter exceptions-ஐ `HandlerExceptionResolver` வச்சு manually handle பண்ணனும்.

---

## Quick Revision Summary

- `@ControllerAdvice` global exception handling-க்கு use ஆகுது.
- `@ExceptionHandler` specific exception types-ஐ map பண்ணும்.
- Exception-ஐ client-க்கு expose பண்ணும்போது security-ஐ consider பண்ணனும்.
- Filter exceptions-ஐ `@ControllerAdvice` பிடிக்காது.
