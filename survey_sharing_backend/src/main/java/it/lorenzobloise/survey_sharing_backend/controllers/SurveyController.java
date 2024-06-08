package it.lorenzobloise.survey_sharing_backend.controllers;

import it.lorenzobloise.survey_sharing_backend.entities.Question;
import it.lorenzobloise.survey_sharing_backend.entities.Statistics;
import it.lorenzobloise.survey_sharing_backend.entities.Survey;
import it.lorenzobloise.survey_sharing_backend.services.StatisticsService;
import it.lorenzobloise.survey_sharing_backend.services.SurveyService;
import it.lorenzobloise.survey_sharing_backend.support.ResponseMessage;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    private final StatisticsService statisticsService;

    // POST

    //TODO
    // Authentication as this user
    @PostMapping
    public ResponseEntity createSurvey(@RequestParam String user, @RequestParam String surveyTitle, @RequestParam String surveyType,
                                       @RequestBody List<Question> questions){
        try{
            return new ResponseEntity(new ResponseMessage("Created successfully",
                    surveyService.addSurvey(user, surveyTitle, surveyType, questions)), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    // GET methods about all surveys

    //TODO
    // Authentication (every role)
    @GetMapping("/search")
    public ResponseEntity findAllSurveys(){
        Set<Survey> result = surveyService.getAllSurveys();
        if(result.size()==0)
            return new ResponseEntity<>(new ResponseMessage("No result"), HttpStatus.OK);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    //TODO
    // Authentication (every role)
    @GetMapping("/search/by_owner")
    public ResponseEntity findAllSurveysByOwner(@RequestParam String owner){
        try{
            Set<Survey> result = surveyService.getAllSurveysByOwner(owner);
            if(result.size()==0)
                return new ResponseEntity<>(new ResponseMessage("No result"), HttpStatus.OK);
            return new ResponseEntity<>(result, HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    //TODO
    // Authentication (every role)
    @GetMapping("/search/by_title")
    public ResponseEntity findSurveysByTitle(@RequestParam String surveyTitle){
        try{
            Set<Survey> result = surveyService.getSurveysByTitle(surveyTitle);
            if(result.size()==0)
                return new ResponseEntity<>(new ResponseMessage("No result"), HttpStatus.OK);
            return new ResponseEntity<>(result, HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    // GET methods about this user's surveys (prerequisite: authentication as this user)

    //TODO
    // Authentication as this user
    @GetMapping("/{user}/search")
    public ResponseEntity findAllCreatedSurveys(@PathVariable(value = "user") String user){
        //TODO
        // If user is authenticated, invoke method above "findAllSurveysByOwner(String owner)"
        try {
            Set<Survey> result = surveyService.getAllSurveysByOwner(user);
            if(result.size()==0)
                return new ResponseEntity<>(new ResponseMessage("No result"), HttpStatus.OK);
            return new ResponseEntity<>(result, HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    //TODO
    // Authentication as this user
    @GetMapping("/{user}/search/by_title")
    public ResponseEntity findCreatedSurveysByTitle(@PathVariable(value = "user") String user, @RequestParam String surveyTitle){
        try{
            Set<Survey> result = surveyService.getAllSurveysByOwner(user);
            Set<Survey> match = surveyService.getSurveysByTitle(surveyTitle);
            result.retainAll(match);
            if(result.size()==0)
                return new ResponseEntity<>(new ResponseMessage("No result"), HttpStatus.OK);
            return new ResponseEntity<>(result, HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    //TODO
    // Authentication as this user
    @GetMapping("/{user}/{survey}/statistics")
    public ResponseEntity findStatistics(@PathVariable(value = "user") String user, @PathVariable(value = "survey") String surveyTitle){
        try{
            Statistics result = statisticsService.getStatistics(surveyTitle);
            return new ResponseEntity(result, HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    // DELETE methods about this user's surveys

    //TODO
    // Authentication as this user
    @DeleteMapping("/{user}")
    public ResponseEntity deleteCreatedSurvey(@PathVariable(value = "user") String user, @RequestParam String surveyTitle){
        //TODO
        // If the user is authenticated, invoke the method below "deleteSurvey(String surveyTitle)"
        try{
            Optional<Survey> result = surveyService.removeSurvey(surveyTitle);
            return new ResponseEntity(new ResponseMessage("Deleted successfully", result.get()), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

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

}
