package it.lorenzobloise.survey_sharing_backend.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("image")
@ToString
@EqualsAndHashCode
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Image {

    @Id
    private String id;
    private byte[] image;
    private String fileName;
    @Version
    private Long version;

    public Image(byte[] image, String fileName){
        this.image = image;
        this.fileName = fileName;
    }

}
