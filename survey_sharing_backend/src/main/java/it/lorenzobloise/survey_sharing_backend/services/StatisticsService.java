package it.lorenzobloise.survey_sharing_backend.services;

import it.lorenzobloise.survey_sharing_backend.entities.Statistics;
import it.lorenzobloise.survey_sharing_backend.entities.Survey;
import it.lorenzobloise.survey_sharing_backend.repositories.StatisticsRepository;
import it.lorenzobloise.survey_sharing_backend.repositories.SurveyRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@AllArgsConstructor
@Service
public class StatisticsService {

    private final StatisticsRepository statisticsRepository;
    private final SurveyRepository surveyRepository;

    // POST

    public Statistics addStatistics(Statistics statistics){
        if(statisticsRepository.existsById(statistics.getId()))
            throw new RuntimeException("Statistics already present");
        Optional<Statistics> existingStatistics = statisticsRepository.findStatisticsBySurvey(statistics.getSurvey());
        if(existingStatistics.isPresent())
            removeStatistics(existingStatistics.get().getId());
        return statisticsRepository.save(statistics);
    }

    // GET

    //TODO
    // Invoke AWS Lambda passing this survey title. The function on Lambda will compute all the necessary information creating
    // and returning a Statistics object that will replace the one present in the repository.
    // Also make a system to verify survey's version: if version is the same from previous
    // invocation of this method, simply return the Statistics object from the repository
    public Statistics getStatistics(String surveyTitle){
        Optional<Survey> s = surveyRepository.findSurveyByTitle(surveyTitle);
        if(s.isEmpty())
            throw new RuntimeException("Survey does not exist");
        return null;
    }

    // DELETE

    public Statistics removeStatistics(String statistics){
        if(statistics!=null) {
            Optional<Statistics> result = statisticsRepository.findById(statistics);
            if (result.isEmpty())
                throw new RuntimeException("Statistics does not exist");
            statisticsRepository.delete(result.get());
            return result.get();
        }
        return null;
    }

}
