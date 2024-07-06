import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ResponseMessage } from "../../support/response-message";

@Injectable({
  providedIn: 'root'
})
export class QuestionService{

  private base_url = "http://localhost:8080/questions";

  constructor(private http: HttpClient) { }

  // GET

  public findQuestionById(questionId: string){
    return this.http.get<ResponseMessage>(this.base_url+'?questionId='+questionId);
  }

}
