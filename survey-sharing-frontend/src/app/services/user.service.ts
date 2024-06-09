import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ResponseMessage } from "../support/response-message";

@Injectable({
  providedIn: 'root'
})
export class UserService{

  private base_url = "http://localhost:8080/users";

  constructor(private http:HttpClient) { }

  // POST

  public createUser(username: string, email: string, name: string, surname: string, age: string, gender: string, country: string){
    return this.http.post<ResponseMessage>(this.base_url+'?username='+username+'&email='+email+'&name='+name+'&surname='+surname+'&age='+age+'&gender='+gender+'&country='+country,null);
  }

  // GET

  public findAllUsers(){
    return this.http.get<ResponseMessage>(this.base_url+'/search/all');
  }

  public findUsersByNameAndSurname(name: string, surname: string){
    var url = this.base_url+'/search/by_name_surname';
    if(name!=null && name.length!=0){
      url += '/?name='+name;
    }
    if(surname!=null && surname.length!=0){
      if(name!=null && name.length!=0){
        url += '&'
      }
      url += 'surname='+surname
    }
    return this.http.get<ResponseMessage>(url);
  }

  public findUsersByEmail(email: string){
    return this.http.get<ResponseMessage>(this.base_url+'/search/by_email?email='+email);
  }

  // DELETE

  public deleteUser(user: string){ //user = username or email
    return this.http.delete<ResponseMessage>(this.base_url+'?user='+user);
  }

}
