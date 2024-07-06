import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ResponseMessage } from "../../support/response-message";
import { Question } from "../../entities/question";

@Injectable({
  providedIn: 'root'
})
export class AnswerService{

  private base_url = "http://localhost:8080/answers";

  constructor(private http:HttpClient) { }

  // POST

  public createAnswer(survey: string, rating: number, feedback: string, questions: string){
    return this.http.post<ResponseMessage>(this.base_url+'/create?survey='+survey+'&rating='+rating+'&feedback='+feedback, questions, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // GET

  public findAllAnswers(){
    return this.http.get<ResponseMessage>(this.base_url+'/search');
  }

  public findAnswersBySurveyTitle(surveyTitle: string){
    return this.http.get<ResponseMessage>(this.base_url+'/search/by_survey_title?surveyTitle='+surveyTitle);
  }

  public findAnswerById(answer: string){
    return this.http.get<ResponseMessage>(this.base_url+'/search/by_id?answer_id='+answer);
  }

  // DELETE

  public deleteAnswer(answer: string){
    return this.http.delete<ResponseMessage>(this.base_url+'/'+answer);
  }

}
