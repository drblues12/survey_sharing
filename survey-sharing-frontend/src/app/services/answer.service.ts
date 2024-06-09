import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ResponseMessage } from "../support/response-message";

@Injectable({
  providedIn: 'root'
})
export class AnswerService{

  private base_url = "http://localhost:8080/answers";

  constructor(private http:HttpClient) { }

  // PUT

  public createAnswer(user: string, surveyTitle: string){
    return this.http.put<ResponseMessage>(this.base_url+'/'+user+'/create?surveyTitle='+surveyTitle, null);
  }

  // GET

  public findAllAnswers(user: string){
    return this.http.get<ResponseMessage>(this.base_url+'/'+user+'/search');
  }

  public findAnswersBySurveyTitle(user: string, surveyTitle: string){
    return this.http.get<ResponseMessage>(this.base_url+'/'+user+'/search/by_survey_title?surveyTitle='+surveyTitle);
  }

  // DELETE

  public deleteAnswer(user: string, answer: string){
    return this.http.delete<ResponseMessage>(this.base_url+'/'+user+'/'+answer);
  }

}
