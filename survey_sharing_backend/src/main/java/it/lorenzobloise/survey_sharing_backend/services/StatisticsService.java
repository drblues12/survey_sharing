package it.lorenzobloise.survey_sharing_backend.services;

import it.lorenzobloise.survey_sharing_backend.entities.*;
import it.lorenzobloise.survey_sharing_backend.repositories.StatisticsRepository;
import it.lorenzobloise.survey_sharing_backend.repositories.SurveyRepository;
import it.lorenzobloise.survey_sharing_backend.repositories.UserRepository;
import it.lorenzobloise.survey_sharing_backend.support.SentimentAnalysis;
import it.lorenzobloise.survey_sharing_backend.support.StatisticsBuilder;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;


@AllArgsConstructor
@Service
public class StatisticsService {

    private final StatisticsRepository statisticsRepository;
    private final SurveyRepository surveyRepository;
    private final UserRepository userRepository;
    private final AnswerService answerService;
    private final InvitationService invitationService;

    // POST

    public Statistics addStatistics(Statistics statistics){
        Optional<Statistics> existingStatistics = statisticsRepository.findStatisticsBySurvey(statistics.getSurvey());
        if(existingStatistics.isPresent())
            removeStatistics(statistics.getSurvey());
        return statisticsRepository.save(statistics);
    }

    // GET

    public Statistics getStatistics(String surveyTitle){
        int totalNumberOfUsers = userRepository.findAll().size()-1; // Except this survey's owner
        Optional<Survey> survey = surveyRepository.findSurveyByTitle(surveyTitle);
        if(survey.isEmpty())
            throw new RuntimeException("Survey does not exist");
        Map<Answer, User> answers = new TreeMap<>();
        for(String a: survey.get().getAnswers()){
            Optional<Answer> answer = answerService.getAnswerById(a);
            if(answer.isPresent()){
                Optional<User> user = userRepository.findUserByIdOrUsernameOrEmail(answer.get().getUser(),answer.get().getUser(),answer.get().getUser());
                if(user.isPresent()) answers.put(answer.get(), user.get());
            }
        }
        Set<Invitation> invitations = new TreeSet<>();
        for(String i: survey.get().getInvitations())
            invitations.add(invitationService.getInvitationById(i));
        StatisticsBuilder sb = new StatisticsBuilder(totalNumberOfUsers, survey.get(), answers, invitations);
        return this.addStatistics(sb.buildStatistics());
    }

    /**
     * Useful when the frontend needs to display only the average rating and not the other statistics
     */
    public double getAverageRating(String surveyTitle){
        Optional<Survey> survey = surveyRepository.findSurveyByTitle(surveyTitle);
        if(survey.isEmpty())
            throw new RuntimeException("Survey does not exist");
        Set<Answer> answers = new TreeSet<>();
        for(String a: survey.get().getAnswers()) {
            Optional<Answer> answer = answerService.getAnswerById(a);
            if(answer.isPresent()) answers.add(answer.get());
        }
        return StatisticsBuilder.buildAverageRating(answers);
    }

    // DELETE

    public Statistics removeStatistics(String surveyTitle){
        Optional<Statistics> result = statisticsRepository.findStatisticsBySurvey(surveyTitle);
        if (result.isEmpty())
            throw new RuntimeException("Statistics does not exist");
        statisticsRepository.delete(result.get());
        return result.get();
    }

}
