package it.lorenzobloise.survey_sharing_backend.services;

import it.lorenzobloise.survey_sharing_backend.entities.*;
import it.lorenzobloise.survey_sharing_backend.repositories.StatisticsRepository;
import it.lorenzobloise.survey_sharing_backend.repositories.SurveyRepository;
import it.lorenzobloise.survey_sharing_backend.repositories.UserRepository;
import it.lorenzobloise.survey_sharing_backend.support.SentimentAnalysis;
import it.lorenzobloise.survey_sharing_backend.support.Utils;
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
            removeStatistics(existingStatistics.get().getId());
        return statisticsRepository.save(statistics);
    }

    // GET

    //TODO
    // Invoke AWS Lambda passing this survey title. The function on Lambda will compute all the necessary information creating
    // and returning a Statistics object that will replace the one present in the repository.
    // Also make a system to verify survey's version: if version is the same from previous
    // invocation of this method, simply return the Statistics object from the repository
    //TODO
    // Divide in multiple methods for each statistic
    public Statistics getStatistics(String surveyTitle){
        Optional<Survey> s = surveyRepository.findSurveyByTitle(surveyTitle);
        if(s.isEmpty())
            throw new RuntimeException("Survey does not exist");
        Statistics result = new Statistics();
        SentimentAnalysis sentimentAnalysis = new SentimentAnalysis();
        // Number of answers
        result.setNumberOfAnswers(s.get().getAnswers().size());
        // Percent of users who answered
        int totalNumberOfUsers = userRepository.findAll().size();
        result.setPercentOfUsersWhoAnswered(((double)(result.getNumberOfAnswers())/totalNumberOfUsers)*100);
        // Minimum, maximum and average age + number of males and females who answered
        // + countries list + number of diffefent countries + feedbacks + ratings
        LinkedList<Integer> ages = new LinkedList<>();
        int males = 0;
        int females = 0;
        LinkedList<String> countries = new LinkedList<>();
        HashSet<String> differentCountries = new HashSet<>();
        LinkedList<String> feedbacks = new LinkedList<>();
        int positiveFeedbacks = 0;
        int negativeFeedbacks = 0;
        int mixedFeedbacks = 0;
        int neutralFeedbacks = 0;
        LinkedList<Double> ratings = new LinkedList<>();
        for(String a: s.get().getAnswers()){
            Optional<Answer> curr_a = answerService.getAnswerById(a);
            if(curr_a.isPresent()){
                Optional<User> curr_u = userRepository.findUserByIdOrUsernameOrEmail(curr_a.get().getUser(),curr_a.get().getUser(),curr_a.get().getUser());
                if(curr_u.isPresent()) {
                    ages.add(curr_u.get().getAge());
                    if(curr_u.get().getGender().equals(User.Gender.Male)) males++;
                    else females++;
                    differentCountries.add(curr_u.get().getCountry());
                    countries.add(curr_u.get().getCountry());
                }
                String curr_feedback = curr_a.get().getFeedback();
                if(!curr_feedback.equals("")) {
                    feedbacks.add(curr_feedback);
                    String sentiment = sentimentAnalysis.detectSentimentWithComprehend(curr_feedback);
                    switch (sentiment) {
                        case "POSITIVE" -> positiveFeedbacks++;
                        case "NEGATIVE" -> negativeFeedbacks++;
                        case "MIXED" -> mixedFeedbacks++;
                        case "NEUTRAL" -> neutralFeedbacks++;
                        default -> {}
                    }
                }
                Double curr_rating = curr_a.get().getRating();
                if(curr_rating!=null && curr_rating!=0d) ratings.add(curr_rating);
            }
        }
        int sumAges = 0;
        for(Integer age: ages) sumAges+=age;
        result.setAverageAge((double)(sumAges)/ages.size());
        result.setAgeList(ages);
        result.setNumberOfMaleUsersWhoAnswered(males);
        result.setNumberOfFemaleUsersWhoAnswered(females);
        result.setCountriesList(countries);
        result.setNumberOfDifferentCountries(differentCountries.size());
        result.setListOfFeedbacks(feedbacks);
        result.setNumberOfPositiveFeedbacks(positiveFeedbacks);
        result.setNumberOfNegativeFeedbacks(negativeFeedbacks);
        result.setNumberOfMixedFeedbacks(mixedFeedbacks);
        result.setNumberOfNeutralFeedbacks(neutralFeedbacks);
        result.setRatings(ratings);
        int sum_ratings = 0;
        for(Double r: ratings) sum_ratings += r;
        result.setAverageRating((double)(sum_ratings)/(ratings.size()));
        // Number of invitations sent
        result.setNumberOfInvitationsSent(s.get().getInvitations().size());
        // Percent of invitations accepted
        LinkedList<Invitation> invitationsList = new LinkedList<>();
        for(String i: s.get().getInvitations())
            invitationsList.add(invitationService.getInvitationById(i));
        int numAccepted = 0;
        if(invitationsList.isEmpty())
            result.setPercentOfInvitationsAccepted(numAccepted);
        for(Invitation i: invitationsList) {
            if (i.isAccepted()) numAccepted++;
            result.setPercentOfInvitationsAccepted(((double) (numAccepted) / (invitationsList.size()))*100);
        }
        return addStatistics(result);
    }

    public double getAverageRating(String surveyTitle){
        Optional<Survey> s = surveyRepository.findSurveyByTitle(surveyTitle);
        if(s.isEmpty())
            throw new RuntimeException("Survey does not exist");
        LinkedList<Double> ratings = new LinkedList<>();
        for(String a: s.get().getAnswers()) {
            Optional<Answer> curr_a = answerService.getAnswerById(a);
            if (curr_a.isPresent()) {
                Double curr_rating = curr_a.get().getRating();
                if(curr_rating!=null && curr_rating!=0d) ratings.add(curr_rating);
            }
        }
        int sum_ratings = 0;
        for(Double r: ratings) sum_ratings += r;
        return (double)(sum_ratings)/(ratings.size());
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
