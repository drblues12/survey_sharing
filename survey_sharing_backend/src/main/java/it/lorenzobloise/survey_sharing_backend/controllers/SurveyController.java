package it.lorenzobloise.survey_sharing_backend.controllers;

import it.lorenzobloise.survey_sharing_backend.entities.Question;
import it.lorenzobloise.survey_sharing_backend.entities.Statistics;
import it.lorenzobloise.survey_sharing_backend.entities.Survey;
import it.lorenzobloise.survey_sharing_backend.entities.User;
import it.lorenzobloise.survey_sharing_backend.services.StatisticsService;
import it.lorenzobloise.survey_sharing_backend.services.SurveyService;
import it.lorenzobloise.survey_sharing_backend.support.ResponseMessage;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/surveys")
@AllArgsConstructor
public class SurveyController {

    private final SurveyService surveyService;

    // POST

    //TODO
    // Authentication as this user
    @PostMapping
    public ResponseEntity createSurvey(@RequestParam String surveyTitle, @RequestBody List<Question> questions, Authentication connectedUser){
        try{
            return new ResponseEntity(new ResponseMessage("Created successfully",
                    surveyService.addSurvey(surveyTitle, questions, connectedUser)), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    // GET methods about all surveys

    //TODO
    // Authentication (every role)
    @GetMapping("/search")
    public ResponseEntity findAllSurveys(@RequestParam boolean returnClosedSurveys){
        Set<Survey> result = surveyService.getAllSurveys(returnClosedSurveys);
        if(result.size()==0)
            return new ResponseEntity<>(new ResponseMessage("No result"), HttpStatus.OK);
        return new ResponseEntity<>(new ResponseMessage("",result), HttpStatus.OK);
    }

    //TODO
    // Authentication (every role)
    @GetMapping("/search/by_owner")
    public ResponseEntity findAllSurveysByOwner(@RequestParam boolean returnClosedSurveys, Authentication connectedUser){
        try{
            Set<Survey> result = surveyService.getAllSurveysByOwner(returnClosedSurveys, connectedUser);
            if(result.size()==0)
                return new ResponseEntity<>(new ResponseMessage("No result"), HttpStatus.OK);
            return new ResponseEntity<>(new ResponseMessage("",result), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    //TODO
    // Authentication (every role)
    @GetMapping("/search/by_title")
    public ResponseEntity findSurveysByTitle(@RequestParam String surveyTitle, @RequestParam boolean returnClosedSurveys){
        try{
            Set<Survey> result = surveyService.getSurveysByTitle(surveyTitle, returnClosedSurveys);
            if(result.size()==0)
                return new ResponseEntity<>(new ResponseMessage("No result"), HttpStatus.OK);
            return new ResponseEntity<>(new ResponseMessage("",result), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    //TODO
    // Authentication (every role)
    @GetMapping("/search/single/by_title")
    public ResponseEntity findSurveyByTitle(@RequestParam String surveyTitle, @RequestParam boolean returnClosedSurveys){
        try{
            Optional<Survey> result = surveyService.getSurveyByTitle(surveyTitle, returnClosedSurveys);
            if(result==null || result.isEmpty())
                return new ResponseEntity<>(new ResponseMessage("No result"), HttpStatus.OK);
            return new ResponseEntity<>(new ResponseMessage("",result), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    // PUT

    //TODO
    // Authentication as this user
    @PutMapping
    public ResponseEntity closeSurvey(@RequestParam String surveyTitle){
        try{
            Survey result = surveyService.closeSurvey(surveyTitle);
            return new ResponseEntity(new ResponseMessage("Survey closed", result), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    // DELETE methods about this user's surveys

    //TODO
    // Authentication as this user
    @DeleteMapping
    public ResponseEntity deleteCreatedSurvey(@RequestParam String surveyTitle){
        //TODO
        // If the user is authenticated, invoke the method below "deleteSurvey(String surveyTitle)"
        try{
            Optional<Survey> result = surveyService.removeSurvey(surveyTitle);
            return new ResponseEntity(new ResponseMessage("Deleted successfully", result.get()), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    /*
    //TODO
    // Authentication as admin
    @DeleteMapping
    public ResponseEntity deleteSurvey(@RequestParam String surveyTitle){
        try{
            Optional<Survey> result = surveyService.removeSurvey(surveyTitle);
            return new ResponseEntity(new ResponseMessage("Deleted successfully", result.get()), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

     */

}
