package it.lorenzobloise.survey_sharing_backend.services;

import it.lorenzobloise.survey_sharing_backend.entities.Question;
import it.lorenzobloise.survey_sharing_backend.entities.Survey;
import it.lorenzobloise.survey_sharing_backend.entities.User;
import it.lorenzobloise.survey_sharing_backend.repositories.SurveyRepository;
import it.lorenzobloise.survey_sharing_backend.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.TreeSet;

@AllArgsConstructor
@Service
public class SurveyService {

    private final UserRepository userRepository;
    private final SurveyRepository surveyRepository;
    private final AnswerService answerService;
    private final InvitationService invitationService;
    private final StatisticsService statisticsService;
    private final QuestionService questionService;

    // POST

    public Survey addSurvey(String user, String surveyTitle, String surveyType, List<Question> questions){
        Optional<User> u = userRepository.findUserByIdOrUsernameOrEmail(user, user, user);
        if(u.isEmpty())
            throw new RuntimeException("User does not exist");
        if(surveyRepository.findSurveyByTitle(surveyTitle).isPresent())
            throw new RuntimeException("Survey already exists");
        try {
            Survey.SurveyType surveyTypeConverted = Survey.SurveyType.valueOf(surveyType);
            // Create survey
            Survey survey = new Survey(u.get().getUsername(), surveyTitle, surveyTypeConverted);
            // Add this survey to the surveys repository
            Survey result = surveyRepository.save(survey);
            // Add questions
            for(Question q: questions){
                Question q_saved = questionService.addQuestion(q);
                survey.getQuestions().add(q_saved.getId());
            }
            // Add this survey to the user's created surveys
            u.get().getCreatedSurveys().add(result.getTitle());
            userRepository.save(u.get());
            return surveyRepository.save(result);
        }catch (IllegalArgumentException e){
            throw new RuntimeException("Survey type is not supported");
        }catch (RuntimeException e){
            throw new RuntimeException(e);
        }
    }

    // GET

    public Set<Survey> getAllSurveys(){
        return new TreeSet<>(surveyRepository.findAll());
    }

    public Set<Survey> getAllSurveysByOwner(String user){
        Optional<User> opt_u = userRepository.findUserByIdOrUsernameOrEmail(user, user, user);
        if(opt_u.isEmpty())
            throw new RuntimeException("User "+user+" does not exist");
        Set<Survey> result = new TreeSet<>();
        for(String surveyTitle: opt_u.get().getCreatedSurveys()){
            Optional<Survey> opt_s = surveyRepository.findSurveyByTitle(surveyTitle);
            if(opt_s.isEmpty())
                throw new RuntimeException("Survey "+surveyTitle+" does not exist");
            result.add(opt_s.get());
        }
        return result;
    }

    public Set<Survey> getSurveysByTitle(String surveyTitle){
        return new TreeSet<>(surveyRepository.findSurveysByTitleContaining(surveyTitle));
    }

    // DELETE

    public Optional<Survey> removeSurvey(String surveyTitle){
        Optional<Survey> opt_s = surveyRepository.findSurveyByTitle(surveyTitle);
        if(opt_s.isEmpty())
            throw new RuntimeException("Survey "+surveyTitle+" does not exist");
        // Remove this survey from the owner's created surveys
        Optional<User> opt_u = userRepository.findUserByIdOrUsernameOrEmail(opt_s.get().getOwner(), opt_s.get().getOwner(), opt_s.get().getOwner());
        if(opt_u.isEmpty())
            throw new RuntimeException("User "+opt_s.get().getOwner()+" does not exist");
        opt_u.get().getCreatedSurveys().remove(opt_s.get().getTitle());
        userRepository.save(opt_u.get());
        // Remove all invitations related to this survey
        for(String i: opt_s.get().getInvitations())
            invitationService.removeInvitation(i);
        // Remove all answers given to this survey
        for(String a: opt_s.get().getAnswers())
            answerService.removeAnswer(a);
        // Remove all questions in this survey
        for(String q: opt_s.get().getQuestions())
            questionService.removeQuestion(q);
        // Remove this survey's statistics from the statistics repository
        statisticsService.removeStatistics(opt_s.get().getStatistics());
        opt_s = surveyRepository.findSurveyByTitle(surveyTitle); // In the midtime, its former value has been modified, so when I try to delete it from the repository,
        // the old version number doesn't match with the new one
        if(opt_s.isEmpty())
            throw new RuntimeException("Survey "+surveyTitle+" does not exist");
        // Remove this survey from the surveys repository
        surveyRepository.delete(opt_s.get());
        return opt_s;
    }

}
