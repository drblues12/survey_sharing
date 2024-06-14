package it.lorenzobloise.survey_sharing_backend.controllers;

import it.lorenzobloise.survey_sharing_backend.entities.Answer;
import it.lorenzobloise.survey_sharing_backend.services.AnswerService;
import it.lorenzobloise.survey_sharing_backend.support.ResponseMessage;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/answers")
@AllArgsConstructor
public class AnswerController {

    private final AnswerService answerService;

    // POST

    //TODO
    // Authentication as this user
    @PostMapping("/{user}/create")
    public ResponseEntity createAnswer(@PathVariable(value = "user") String user, @RequestParam String surveyTitle){
        try{
            Answer result = answerService.addAnswer(user, surveyTitle);
            return new ResponseEntity(new ResponseMessage("Added successfully", result), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    // GET

    //TODO
    // Authentication as this user
    @GetMapping("/{user}/search")
    public ResponseEntity findAllAnswers(@PathVariable(value = "user") String user){
        try{
            Set<Answer> result = answerService.getAllAnswers(user);
            if(result.size()==0)
                return new ResponseEntity<>(new ResponseMessage("No result"), HttpStatus.OK);
            return new ResponseEntity(new ResponseMessage("",result), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    //TODO
    // Authentication as this user
    @GetMapping("/{user}/search/by_survey_title")
    public ResponseEntity findAnswersBySurveyTitle(@PathVariable(value = "user") String user, @RequestParam String surveyTitle){
        try{
            Set<Answer> result = answerService.getAnswersBySurveyTitle(user, surveyTitle);
            if(result.size()==0)
                return new ResponseEntity<>(new ResponseMessage("No result"), HttpStatus.OK);
            return new ResponseEntity(new ResponseMessage("",result), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    // DELETE

    //TODO
    // Authentication as this user
    @DeleteMapping("/{user}/{answer}")
    public ResponseEntity deleteAnswer(@PathVariable(value = "user") String user, @PathVariable(value = "answer") String answer){
        try{
            Optional<Answer> result = answerService.removeAnswer(answer);
            return new ResponseEntity(new ResponseMessage("Deleted successfully", result.get()), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

}
