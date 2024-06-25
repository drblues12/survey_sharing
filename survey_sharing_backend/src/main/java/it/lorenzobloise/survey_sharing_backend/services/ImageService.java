package it.lorenzobloise.survey_sharing_backend.services;

import it.lorenzobloise.survey_sharing_backend.entities.Image;
import it.lorenzobloise.survey_sharing_backend.repositories.ImageRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@AllArgsConstructor
@Service
public class ImageService {

    private ImageRepository imageRepository;

    // POST

    public Image addImage(byte[] image, String fileName){
        return imageRepository.save(new Image(image, fileName));
    }

    // GET

    public Optional<Image> getImageById(String imageId){
        return imageRepository.findById(imageId);
    }

}
