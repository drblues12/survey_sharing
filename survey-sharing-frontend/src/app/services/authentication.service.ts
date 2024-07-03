import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RegistrationRequest } from "../entities/auth/registration-request";
import { ResponseMessage } from "../support/response-message";
import { AuthenticationRequest } from "../entities/auth/authentication-request";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private base_url = 'http://localhost:8080/auth'

  constructor(private httpClient:HttpClient){}

  public register(request: RegistrationRequest){
    return this.httpClient.post<ResponseMessage>(this.base_url+'/register',request);
  }

  public authenticate(request: AuthenticationRequest){
    return this.httpClient.post<ResponseMessage>(this.base_url+'/authenticate',request);
  }

}
