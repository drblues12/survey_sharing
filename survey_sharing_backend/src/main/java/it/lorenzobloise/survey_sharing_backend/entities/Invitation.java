package it.lorenzobloise.survey_sharing_backend.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Document("invitation")
@ToString
@EqualsAndHashCode
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Invitation implements Comparable<Invitation> {

    @Id
    private String id;
    @NotBlank(message = "User shall not be blank")
    private String user;
    @NotBlank(message = "Survey shall not be blank")
    private String survey;
    private String message;
    private boolean read;
    private boolean accepted;
    private LocalDateTime date;

    public Invitation(String user, String survey, String message){
        this.user = user;
        this.survey = survey;
        this.message = message;
        this.date = LocalDateTime.now();
    }

    public Invitation(Invitation i){
        this(i.getUser(), i.getSurvey(), i.getMessage());
    }

    public boolean equals(Object o){
        if(o==null) return false;
        if(o==this) return true;
        if(o instanceof Invitation){
            Invitation i = (Invitation) o;
            return user.equals(i.getUser()) && survey.equals(i.getSurvey()) && date.equals(i.getDate());
        }
        return false;
    }

    public int compareTo(Invitation i){
        if(this.equals(i)) return 0;
        return this.date.compareTo(i.getDate());
    }

}