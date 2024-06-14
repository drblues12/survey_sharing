package it.lorenzobloise.survey_sharing_backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import it.lorenzobloise.survey_sharing_backend.support.Utils;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.TreeSet;

@Document("user")
@ToString
@EqualsAndHashCode
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User implements Comparable<User> {

    public enum Gender{Male, Female};
    @Id
    private String id;
    @NotBlank(message = "Username shall not be blank")
    @Indexed(unique = true)
    private String username;
    private String name;
    private String surname;
    @NotBlank(message = "Email shall not be blank")
    @Email(message="Email is not valid", regexp="[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}", flags = Pattern.Flag.CASE_INSENSITIVE)
    @Indexed(unique = true)
    private String email;
    @NotBlank(message = "Age shall not be blank")
    private int age;
    @NotBlank(message = "Gender shall not be blank")
    private Gender gender;
    @NotBlank(message = "Country shall not be blank")
    private String country;
    private Set<String> createdSurveys; // Titles of the created surveys
    private Map<String,String> answers; // The key is the survey's title, so each user can only give one answer per survey, and the value is the answer's id
    private Set<String> invitations; // Ids of the invitations received
    @JsonIgnore
    private LocalDateTime registrationDateObj;
    private String[] registrationDate;
    @JsonIgnore
    @Version
    private Long version;

    public User(String username, String email, String name, String surname, int age, Gender gender, String country) {
        this.username = username;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.age = age;
        this.gender = gender;
        this.country = country;
        this.createdSurveys = new TreeSet<>();
        this.answers = new TreeMap<>();
        this.invitations = new TreeSet<>();
        this.registrationDateObj = LocalDateTime.now();
        this.registrationDate = Utils.parseDate(this.registrationDateObj.toString());
    }

    public User(String username, String email, String name, String surname, int age, Gender gender, String country, Set<String> createdSurveys, Map<String,String> answers) {
        this.username = username;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.age = age;
        this.gender = gender;
        this.country = country;
        this.createdSurveys = createdSurveys;
        this.answers = answers;
        this.invitations = new TreeSet<>();
        this.registrationDateObj = LocalDateTime.now();
        this.registrationDate = Utils.parseDate(this.registrationDateObj.toString());
    }

    public boolean equals(Object o){
        if(o==null) return false;
        if(o==this) return true;
        if(o instanceof User){
            User u = (User)o;
            return this.username.equals(u.getUsername()) || this.email.equals(u.getEmail());
        }
        return false;
    }

    public int compareTo(User u){
        if(this.equals(u)) return 0;
        return (this.name+this.surname+this.username).compareTo(u.getName()+u.getSurname()+u.getUsername());
    }

}
