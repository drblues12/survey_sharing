import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ResponseMessage } from "../support/response-message";
import { User } from "../entities/user";

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

  public findUsersByNameAndSurname(name_and_surname: string){
    return this.http.get<ResponseMessage>(this.base_url+'/search/by_name_surname?query='+name_and_surname);
  }

  public findUsersByEmail(email: string){
    return this.http.get<ResponseMessage>(this.base_url+'/search/by_email?email='+email);
  }

  public findUserByEmail(email: string){
    return this.http.get<ResponseMessage>(this.base_url+'/search/single/by_email?email='+email);
  }

  public findUserById(id: string){
    return this.http.get<ResponseMessage>(this.base_url+'/search/by_id?id='+id);
  }

  public findUsersByUsername(username: string){
    return this.http.get<ResponseMessage>(this.base_url+'/search/by_username?username='+username);
  }

  public findUserByUsername(username: string){
    return this.http.get<ResponseMessage>(this.base_url+'/search/single/by_username?username='+username);
  }

  // DELETE

  public deleteUser(user: string){ //user = username or email
    return this.http.delete<ResponseMessage>(this.base_url+'?user='+user);
  }

}
