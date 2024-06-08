package it.lorenzobloise.survey_sharing_backend.services;

import it.lorenzobloise.survey_sharing_backend.entities.MultipleChoiceQuestion;
import it.lorenzobloise.survey_sharing_backend.entities.Question;
import it.lorenzobloise.survey_sharing_backend.repositories.OptionRepository;
import it.lorenzobloise.survey_sharing_backend.repositories.QuestionRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@AllArgsConstructor
@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final OptionRepository optionRepository;

    // POST

    public Question addQuestion(Question q){
        if(q instanceof MultipleChoiceQuestion) {
            MultipleChoiceQuestion q2 = (MultipleChoiceQuestion) q;
            // Add all this question's options in the options repository
            optionRepository.saveAll(q2.getOptions());
        }
        // Add this question in the questions repository
        Question q_saved = questionRepository.save(q);
        return q_saved;
    }

    // GET

    public Question getQuestion(String question_id){
        Optional<Question> opt_q = questionRepository.findById(question_id);
        if(opt_q.isEmpty())
            throw new RuntimeException("Question does not exist");
        return opt_q.get();
    }

    // DELETE

    public void removeQuestion(String q){
        Optional<Question> opt_q = questionRepository.findById(q);
        if(opt_q.isEmpty())
            throw new RuntimeException("Question does not exist");
        if(opt_q.get() instanceof MultipleChoiceQuestion)
            // Remove all options in this question from the options repository, if it is a MultipleChoiceQuestion
            optionRepository.deleteAll(((MultipleChoiceQuestion)(opt_q.get())).getOptions());
        // Remove this question from the questions repository
        questionRepository.delete(opt_q.get());
    }

}