import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { Survey } from 'src/app/entities/survey';
import { User } from 'src/app/entities/user';
import { SurveyService } from 'src/app/services/survey.service';
import { UserService } from 'src/app/services/user.service';
import { ResponseMessage } from 'src/app/support/response-message';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.scss']
})
export class SurveyListComponent implements OnInit {

  private query!: string;
  public search_results: Survey[] = [];
  public owners_details: Map<string, User> = new Map<string, User>();

  constructor(public appComponent: AppComponent) {
    this.query = appComponent.query;
  }

  ngOnInit(): void {
    this.appComponent.reloadWindow();
    this.search_results = [];
    if(this.query===""){
      this.appComponent.surveyService.findAllSurveys().subscribe(responseMessage => {
        this.search_results = responseMessage.object;
        if(this.search_results.length==0) alert (responseMessage.message);
        this.search_results.forEach(survey => {
          this.findOwnerDetails(survey.owner);
        })
      })
    }
    else{
      this.appComponent.surveyService.findSurveysByTitle(this.query).subscribe(responseMessage => {
        this.search_results = responseMessage.object;
        if(this.search_results.length==0) alert (responseMessage.message);
        this.search_results.forEach(survey => {
          this.findOwnerDetails(survey.owner);
        })
      })
    }
  }

  findOwnerDetails(owner: string) {
    if(!this.owners_details.has(owner)){
      this.appComponent.userService.findUsersByUsername(owner).subscribe(responseMessage => {
        if(responseMessage.object.length==0)
          alert (responseMessage.message);
        else
          this.owners_details.set(owner, responseMessage.object[0]);
      })
    }
  }

  answerSurvey(survey: string){
    this.appComponent.navigate('answer', survey);
  }

  hasAnswered(survey: string): boolean {
    return this.appComponent.getAnswers().find(a => a.answer.survey==survey)!=undefined;
  }

  getTooltip(survey: string): string {
    if(this.hasAnswered(survey))
      return "You have already answered this survey";
    return "";
  }

}
