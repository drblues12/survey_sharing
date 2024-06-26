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

  public createSurvey(user: string, surveyTitle: string, questions: string): Observable<ResponseMessage>{
    return this.http.post<ResponseMessage>(this.base_url+'?user='+user+'&surveyTitle='+surveyTitle,questions, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // GET

  public findAllSurveys(returnClosedSurveys: boolean): Observable<ResponseMessage>{
    return this.http.get<ResponseMessage>(this.base_url+'/search?returnClosedSurveys='+returnClosedSurveys);
  }

  public findAllSurveysByOwner(owner: string, returnClosedSurveys: boolean): Observable<ResponseMessage>{
    return this.http.get<ResponseMessage>(this.base_url+'/search/by_owner?owner='+owner+'&returnClosedSurveys='+returnClosedSurveys);
  }

  public findSurveysByTitle(surveyTitle: string, returnClosedSurveys: boolean): Observable<ResponseMessage>{
    return this.http.get<ResponseMessage>(this.base_url+'/search/by_title?surveyTitle='+surveyTitle+'&returnClosedSurveys='+returnClosedSurveys);
  }

  public findSurveyByTitle(surveyTitle: string, returnClosedSurveys: boolean): Observable<ResponseMessage>{
    return this.http.get<ResponseMessage>(this.base_url+'/search/single/by_title?surveyTitle='+surveyTitle+'&returnClosedSurveys='+returnClosedSurveys);
  }

  // PUT

  public closeSurvey(surveyTitle: string): Observable<ResponseMessage>{
    return this.http.put<ResponseMessage>(this.base_url+'?surveyTitle='+surveyTitle, null);
  }

  // DELETE

  public deleteCreatedSurvey(user: string, surveyTitle: string): Observable<ResponseMessage>{
    return this.http.delete<ResponseMessage>(this.base_url+'/'+user+'?surveyTitle='+surveyTitle);
  }

  public deleteSurvey(surveyTitle: string): Observable<ResponseMessage>{
    return this.http.delete<ResponseMessage>(this.base_url+'?surveyTitle='+surveyTitle);
  }

}
