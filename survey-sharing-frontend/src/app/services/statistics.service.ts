import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ResponseMessage } from "../support/response-message";

@Injectable({
  providedIn: 'root'
})
export class StatisticsService{

  private base_url = "http://localhost:8080/surveys";

  constructor(private http:HttpClient) { }

  // GET

  public findStatistics(user: string, survey: string){
    return this.http.get<ResponseMessage>(this.base_url+'/'+user+'/'+survey+'/statistics');
  }

}
