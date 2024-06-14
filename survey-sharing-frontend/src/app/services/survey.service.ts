import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ResponseMessage } from "../support/response-message";
import { Question } from "../entities/question";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SurveyService{

  private base_url = "http://localhost:8080/surveys";

  constructor(private http:HttpClient) { }

  // POST

  public createSurvey(user: string, surveyTitle: string, surveyType: string, questions: Question[]): Observable<ResponseMessage>{
    return this.http.post<ResponseMessage>(this.base_url+'?user='+user+'&surveyTitle='+surveyTitle+'&surveyType='+surveyType,questions);
  }

  // GET

  public findAllSurveys(): Observable<ResponseMessage>{
    return this.http.get<ResponseMessage>(this.base_url+'/search');
  }

  public findAllSurveysByOwner(owner: string): Observable<ResponseMessage>{
    return this.http.get<ResponseMessage>(this.base_url+'/search/by_owner?owner='+owner);
  }

  public findSurveysByTitle(surveyTitle: string): Observable<ResponseMessage>{
    return this.http.get<ResponseMessage>(this.base_url+'/search/by_title?surveyTitle='+surveyTitle);
  }

  public findAllCreatedSurveys(user: string): Observable<ResponseMessage>{
    return this.http.get<ResponseMessage>(this.base_url+'/'+user+'/search');
  }

  public findCreatedSurveysByTitle(user: string, surveyTitle: string): Observable<ResponseMessage>{
    return this.http.get<ResponseMessage>(this.base_url+'/'+user+'/search/by_title?surveyTitle='+surveyTitle);
  }

  // DELETE

  public deleteCreatedSurvey(user: string, surveyTitle: string): Observable<ResponseMessage>{
    return this.http.delete<ResponseMessage>(this.base_url+'/'+user+'?surveyTitle='+surveyTitle);
  }

  public deleteSurvey(surveyTitle: string): Observable<ResponseMessage>{
    return this.http.delete<ResponseMessage>(this.base_url+'?surveyTitle='+surveyTitle);
  }

}
