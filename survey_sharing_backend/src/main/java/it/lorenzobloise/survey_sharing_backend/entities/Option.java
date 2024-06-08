package it.lorenzobloise.survey_sharing_backend.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotBlank;

@Document("option")
@ToString
@EqualsAndHashCode
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Option {

    @Id
    private String id;
    @Version
    private Long version;
    @NotBlank(message = "Question shall not be blank")
    private String option;
    private boolean selected;
    private boolean correct;

    public Option(String option){
        this.selected = false;
        this.option = option;
        this.correct = false;
    }

    public Option(String option, boolean selected, boolean correct){
        this(option);
        this.selected = selected;
        this.correct = correct;
    }

}
