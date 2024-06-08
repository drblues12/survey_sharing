package it.lorenzobloise.survey_sharing_backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;

@Document("answer")
@ToString
@EqualsAndHashCode
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Answer implements Comparable<Answer> {

    @Id
    private String id;
    private String survey; // Survey's title
    @JsonIgnore
    private List<String> questions; // Questions id
    private String user; // User's username
    private LocalDateTime date;
    private String feedback;
    @Version
    private Long version;

    public Answer(String user, String survey){
        this();
        this.user = user;
        this.survey = survey;
        this.questions = new LinkedList<>();
        this.feedback = "";
        this.date = LocalDateTime.now();
    }

    public Answer(String user, String survey, String feedback){
        this(user, survey);
        this.feedback = feedback;
    }

    public boolean equals(Object o){
        if(o==null) return false;
        if(o==this) return true;
        if(o instanceof Answer){
            Answer a = (Answer)o;
            return this.user.equals(a.getUser()) && this.survey.equals(a.getSurvey());
        }
        return false;
    }

    public int compareTo(Answer a){
        if(this.equals(a)) return 0;
        return this.date.compareTo(a.getDate());
    }

}
