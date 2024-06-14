package it.lorenzobloise.survey_sharing_backend.controllers;

import it.lorenzobloise.survey_sharing_backend.entities.Option;
import it.lorenzobloise.survey_sharing_backend.entities.User;
import it.lorenzobloise.survey_sharing_backend.services.UserService;
import it.lorenzobloise.survey_sharing_backend.support.ResponseMessage;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    // POST

    //TODO
    // Authentication as admin
    @PostMapping
    public ResponseEntity createUser(@RequestParam String username, @RequestParam String email, @RequestParam String name,
                                     @RequestParam String surname, @RequestParam int age, @RequestParam String gender,
                                     @RequestParam String country){
        try{
            return new ResponseEntity(new ResponseMessage("Created successfully",
                    userService.addUser(username,email,name,surname,age,gender,country)), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    // GET

    //TODO
    // Authentication (every role)
    @GetMapping("/search/all")
    public ResponseEntity findAllUsers(){
        Set<User> result = userService.getAllUsers();
        if(result.size()==0)
            return new ResponseEntity<>(new ResponseMessage("No result"), HttpStatus.OK);
        return new ResponseEntity<>(new ResponseMessage("",result), HttpStatus.OK);
    }

    //TODO
    // Authentication (every role)
    @GetMapping("/search/by_name_surname")
    public ResponseEntity findUsersByNameAndSurname(@RequestParam(required = false) String query){
        if(query==null)
            return findAllUsers();
        Set<User> result = userService.getUsersByNameAndSurname(query);
        if(result.size()==0)
            return new ResponseEntity<>(new ResponseMessage("No result"), HttpStatus.OK);
        return new ResponseEntity<>(new ResponseMessage("",result), HttpStatus.OK);
    }

    //TODO
    // Authentication (every role)
    @GetMapping("/search/by_username")
    public ResponseEntity findUsersByUsername(@RequestParam String username){
        Set<User> result = userService.getUsersByUsername(username);
        if(result.size()==0)
            return new ResponseEntity<>(new ResponseMessage("No result"), HttpStatus.OK);
        return new ResponseEntity<>(new ResponseMessage("",result), HttpStatus.OK);
    }

    //TODO
    // Authentication (every role)
    @GetMapping("/search/by_email")
    public ResponseEntity findUsersByEmail(@RequestParam String email){
        Set<User> result = userService.getUsersByEmail(email);
        if(result.size()==0)
            return new ResponseEntity<>(new ResponseMessage("No result"), HttpStatus.OK);
        return new ResponseEntity<>(new ResponseMessage("",result), HttpStatus.OK);
    }

    @GetMapping("/search/by_id")
    public ResponseEntity findUserById(@RequestParam String id){
        Optional<User> result = userService.getUserById(id);
        if(result.isEmpty())
            return new ResponseEntity<>(new ResponseMessage("No result"), HttpStatus.OK);
        return new ResponseEntity<>(new ResponseMessage("",result.get()), HttpStatus.OK);
    }

    // DELETE

    //TODO
    // Authentication as this user
    @DeleteMapping
    public ResponseEntity deleteUser(@RequestParam String user){
        try{
            Optional<User> result = userService.removeUser(user);
            return new ResponseEntity(new ResponseMessage("Deleted successfully", result.get()), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

}
