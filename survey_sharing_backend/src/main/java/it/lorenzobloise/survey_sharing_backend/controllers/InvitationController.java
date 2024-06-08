package it.lorenzobloise.survey_sharing_backend.controllers;

import it.lorenzobloise.survey_sharing_backend.entities.Invitation;
import it.lorenzobloise.survey_sharing_backend.services.InvitationService;
import it.lorenzobloise.survey_sharing_backend.support.ResponseMessage;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/invitations")
@AllArgsConstructor
public class InvitationController {

    private final InvitationService invitationService;

    // POST

    //TODO
    // Authentication as this survey's owner
    @PostMapping
    public ResponseEntity createInvitations(@RequestParam String surveyTitle, @RequestBody @Valid List<Invitation> invitations){
        try{
            Set<Invitation> result = invitationService.addNewInvitationsToSurvey(surveyTitle, invitations);
            if(result.size()==0)
                return new ResponseEntity<>(new ResponseMessage("No result"), HttpStatus.OK);
            return new ResponseEntity(result, HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    // GET

    //TODO
    // Authentication as this user
    @GetMapping("/{user}")
    public ResponseEntity findAllInvitations(@PathVariable(value = "user") String user){
        try{
            Set<Invitation> result = invitationService.getAllInvitations(user);
            if(result.size()==0)
                return new ResponseEntity<>(new ResponseMessage("No result"), HttpStatus.OK);
            return new ResponseEntity(result, HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    //TODO
    // Authentication as this user
    @DeleteMapping("/{user}")
    public ResponseEntity deleteInvitation(@PathVariable(value = "user") String user, @RequestParam String invitation){
        try {
            Invitation result = invitationService.removeInvitation(invitation);
            return new ResponseEntity(result, HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    // PUT
    //TODO
    // Authentication as this user
    @PutMapping("/{user}")
    public ResponseEntity updateInvitation(@PathVariable(value = "user") String user, @RequestParam String invitation,
                                           @RequestParam boolean read, @RequestParam boolean accepted){
        try {
            Invitation result = invitationService.updateInvitation(user, invitation, read, accepted);
            return new ResponseEntity(result, HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

}
