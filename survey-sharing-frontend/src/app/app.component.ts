import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbMenuItem, NbThemeService } from '@nebular/theme';
import { User } from './entities/user';
import { Survey } from './entities/survey';
import { UserService } from './services/user.service';
import { SurveyService } from './services/survey.service';
import { AnswerService } from './services/answer.service';
import { InvitationService } from './services/invitation.service';
import { StatisticsService } from './services/statistics.service';
import { Answer } from './entities/answer';
import { Invitation } from './entities/invitation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public user_tmp: User = new User('666b2ec551913d367a84ea7c', 'dr.blues.__', 'Lorenzo', 'Bloise',
    'l.bloise@outlook.it', 23, 'MALE', 'Italy', ['13','06','2024','19','39','17']);
  user: User = this.user_tmp;
  createdSurveys: Map<string, Survey> = new Map<string,Survey>();
  answers: Map<string, Answer> = new Map<string, Answer>();
  answer_surveys!: string[];
  invitations: Map<string, Invitation> = new Map<string, Invitation>();
  surveysOwners: Map<string, User> = new Map<string, User>();
  invitationSenders: Map<string, User> = new Map<string, User>();
  mail = false;
  router: Router;
  searchType!: string;
  query: string = "";

  constructor(public r: Router, public userService: UserService, public surveyService: SurveyService,
              public answerService: AnswerService, public invitationService: InvitationService, public statisticsService: StatisticsService){
    this.router = r;
    this.user_tmp.setCreatedSurveys(['My second survey']);
    var tmp_answers: Map<string,string> = new Map<string, string>();
    tmp_answers.set('My first survey', '666b620e6d9fb635b7d9ca40');
    this.user_tmp.setAnswers(tmp_answers);
    this.user_tmp.setInvitations(['666b628c6d9fb635b7d9ca41']);
  }

  ngOnInit(): void {
    this.getCreatedSurveys(this.user.username);
    this.getAnswers(this.user.username);
    this.getInvitations(this.user.username);
  }

  hasMail(): boolean{
    return this.mail;
  }

  notLoginNorRegister(): boolean{
    return this.router.url !== '/login' && this.router.url !== '/register';
  }

  getCreatedSurveys(username: string): void {
    this.surveyService.findAllCreatedSurveys(username).subscribe(responseMessage => {
      var result: Survey[] = responseMessage.object;
      if(result!=null && result.length>0)
        result.forEach(survey => {
          if(!this.createdSurveys.has(survey.title))
            this.createdSurveys.set(survey.title, survey);
        })
    })
  }

  getAnswers(username: string): void {
    this.answerService.findAllAnswers(username).subscribe(responseMessage => {
      var result: Answer[] = responseMessage.object;
      if(result!=null && result.length>0)
        result.forEach(answer => {
          if(!this.answers.has(answer.survey))
            this.answers.set(answer.survey, answer);
          this.getSurveyOwnerDetails(answer.survey);
        })
        this.answer_surveys = [...this.answers.keys()];
    })
  }

  getInvitations(username: string): void {
    this.invitationService.findAllInvitations(username).subscribe(responseMessage => {
      var result: Invitation[] = responseMessage.object;
      if(result!=null && result.length>0)
        result.forEach(invitation => {
          if(!this.invitations.has(invitation.id))
            this.invitations.set(invitation.id, invitation);
          this.getInvitationSender(invitation);
        })
    })
  }

  getSurveyOwnerDetails(surveyTitle: string): void {
    this.surveyService.findSurveysByTitle(surveyTitle).subscribe(responseMessage => {
      var result: Survey = responseMessage.object[0];
      this.userService.findUsersByUsername(result.owner).subscribe(responseMessage2 => {
        var result2: User = responseMessage2.object[0];
        if(!this.surveysOwners.has(surveyTitle))
          this.surveysOwners.set(surveyTitle, result2);
      })
    })
  }

  getInvitationSender(invitation: Invitation): void {
    this.surveyService.findSurveysByTitle(invitation.survey).subscribe(responseMessage => {
      var result: Survey = responseMessage.object[0];
      this.userService.findUsersByUsername(result.owner).subscribe(responseMessage2 => {
        var result2: User = responseMessage2.object[0];
        if(!this.invitationSenders.has(invitation.id))
          this.invitationSenders.set(invitation.id, result2);
      })
    })
  }

  getParsedDate(date: string[] | undefined): string | null {
    if(date!=undefined)
      return date[0]+'/'+date[1]+'/'+date[2];
    return null;
  }

  getParsedHour(date: string[] | undefined): string | null {
    if(date!=undefined)
      return date[3]+':'+date[4]+':'+date[5];
    return null;
  }

}
