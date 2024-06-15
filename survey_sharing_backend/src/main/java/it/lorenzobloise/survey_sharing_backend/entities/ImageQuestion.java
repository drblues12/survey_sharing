package it.lorenzobloise.survey_sharing_backend.entities;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotBlank;

@Document("question")
@ToString
@Getter
@Setter
@NoArgsConstructor
public class ImageQuestion extends Question {

    @NotBlank(message = "Url of the image shall not be blank")
    private String url; // Url of the image uploaded by the user

    public ImageQuestion(String url){
        super();
        this.url = url;
        this.type = QuestionType.Image.toString();
    }

    public ImageQuestion(ImageQuestion iq){
        super(iq.getQuestion());
        this.url = iq.getUrl();
        this.type = QuestionType.Image.toString();
    }

}

