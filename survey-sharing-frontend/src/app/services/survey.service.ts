import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ResponseMessage } from "../support/response-message";
import { Question } from "../entities/question";

@Injectable({
  providedIn: 'root'
})
export class SurveyService{

  private base_url = "http://localhost:8080/surveys";

  constructor(private http:HttpClient) { }

  // POST

  public createSurvey(user: string, surveyTitle: string, surveyType: string, questions: Question[]){
    return this.http.post<ResponseMessage>(this.base_url+'?user='+user+'&surveyTitle='+surveyTitle+'&surveyType='+surveyType,questions);
  }

  // GET

  public findAllSurveys(){
    return this.http.get<ResponseMessage>(this.base_url+'/search');
  }

  public findAllSurveysByOwner(owner: string){
    return this.http.get<ResponseMessage>(this.base_url+'/search/by_owner/?owner='+owner);
  }

  public findSurveysByTitle(surveyTitle: string){
    return this.http.get<ResponseMessage>(this.base_url+'/search/by_title/?title='+surveyTitle);
  }

  public findAllCreatedSurveys(user: string){
    return this.http.get<ResponseMessage>(this.base_url+'/'+user+'/search');
  }

  public findCreatedSurveysByTitle(user: string, surveyTitle: string){
    return this.http.get<ResponseMessage>(this.base_url+'/'+user+'/search/by_title?surveyTitle='+surveyTitle);
  }

  // DELETE

  public deleteCreatedSurvey(user: string, surveyTitle: string){
    return this.http.delete<ResponseMessage>(this.base_url+'/'+user+'?surveyTitle='+surveyTitle);
  }

  public deleteSurvey(surveyTitle: string){
    return this.http.delete<ResponseMessage>(this.base_url+'?surveyTitle='+surveyTitle);
  }

}
