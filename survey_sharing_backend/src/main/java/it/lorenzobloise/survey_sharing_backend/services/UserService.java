package it.lorenzobloise.survey_sharing_backend.services;

import it.lorenzobloise.survey_sharing_backend.entities.User;
import it.lorenzobloise.survey_sharing_backend.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;
import java.util.TreeSet;

@AllArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final SurveyService surveyService;

    // POST

    public User addUser(String username, String email, String name, String surname, int age, String gender, String country){
        if(userRepository.existsByIdOrUsernameOrEmail(null, username, email))
            throw new RuntimeException("User already exists");
        try {
            User.Gender genderConverted = User.Gender.valueOf(gender);
            User user = new User(username, email, name, surname, age, genderConverted, country);
            // Add this user in the users repository
            return userRepository.save(user);
        }catch (IllegalArgumentException e){
            throw new RuntimeException("Gender "+gender+" is not supported");
        }
    }

    // GET

    public Set<User> getAllUsers(){
        return new TreeSet<>(userRepository.findAll());
    }

    public Set<User> getUsersByNameAndSurname(String name, String surname){
        if(name==null && surname==null)
            return new TreeSet<>();
        if(name==null)
            return new TreeSet<>(userRepository.findUsersBySurnameContainingIgnoreCase(surname));
        if(surname==null)
            return new TreeSet<>(userRepository.findUsersByNameContainingIgnoreCase(name));
        Set<User> result = new TreeSet<>(userRepository.findUsersByNameContainingIgnoreCase(name));
        result.addAll(userRepository.findUsersBySurnameContainingIgnoreCase(surname));
        return result;
    }

    public Set<User> getUsersByUsername(String username){
        return new TreeSet<>(userRepository.findUsersByUsernameContainingIgnoreCase(username));
    }

    public Set<User> getUsersByEmail(String email){
        return new TreeSet<>(userRepository.findUsersByEmailContainingIgnoreCase(email));
    }

    public Optional<User> getUserById(String id){
        return userRepository.findById(id);
    }

    // DELETE

    public Optional<User> removeUser(String user){
        Optional<User> result = userRepository.findUserByIdOrUsernameOrEmail(user, user, user);
        if(result.isEmpty())
            throw new RuntimeException("User does not exist");
        // Remove this user's created surveys
        for(String surveyTitle: result.get().getCreatedSurveys())
            surveyService.removeSurvey(surveyTitle);
        // Remove this user from the users repository
        result = userRepository.findUserByIdOrUsernameOrEmail(user, user, user);
        // In the midtime, its former value has been modified, so when I try to delete it from the repository,
        // the old version number doesn't match with the new one
        if(result.isEmpty())
            throw new RuntimeException("User does not exist");
        userRepository.delete(result.get());
        return result;
    }

}
