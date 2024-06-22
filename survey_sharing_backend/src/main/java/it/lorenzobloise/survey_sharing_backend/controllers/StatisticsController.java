package it.lorenzobloise.survey_sharing_backend.controllers;

import it.lorenzobloise.survey_sharing_backend.entities.Statistics;
import it.lorenzobloise.survey_sharing_backend.services.StatisticsService;
import it.lorenzobloise.survey_sharing_backend.support.ResponseMessage;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/statistics")
@AllArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsService;

    //TODO
    // Authentication as this user
    @GetMapping()
    public ResponseEntity computeStatistics(@RequestParam String user, @RequestParam String surveyTitle){
        try{
            Statistics result = statisticsService.getStatistics(surveyTitle);
            return new ResponseEntity(new ResponseMessage("",result), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

}
