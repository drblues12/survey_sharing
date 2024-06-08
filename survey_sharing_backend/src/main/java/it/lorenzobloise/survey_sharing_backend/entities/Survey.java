package it.lorenzobloise.survey_sharing_backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

@Document("survey")
@ToString
@EqualsAndHashCode
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Survey implements Comparable<Survey> {

    public enum SurveyType{TEST, FORM}
    @Id
    private String id;
    @NotBlank(message = "Survey title shall not be blank")
    @Indexed(unique = true)
    private String title;
    private List<String> questions;
    private String owner; // Username of the owner
    private Set<String> answers; // Answers id
    private Set<String> invitations; // Invitations id
    private LocalDateTime creationDate;
    @NotBlank(message = "Survey type shall not be blank")
    private SurveyType surveyType;
    private String statistics;
    @Version
    @JsonIgnore
    private Long version;

    public Survey(String owner, String title, SurveyType surveyType){
        this.owner = owner;
        this.title = title;
        this.questions = new LinkedList<>();
        this.creationDate = LocalDateTime.now();
        this.surveyType = surveyType;
        this.answers = new TreeSet<>();
        this.invitations = new TreeSet<>();
        this.statistics = null;
    }

    public boolean equals(Object o){
        if(o==null) return false;
        if(o==this) return true;
        if(o instanceof Survey){
            Survey s = (Survey)o;
            return this.id.equals(s.getId()) || this.title.equals(s.getTitle());
        }
        return false;
    }

    @Override
    public int compareTo(Survey s) {
        if(this.equals(s)) return 0;
        return this.creationDate.compareTo(s.creationDate);
    }
}
