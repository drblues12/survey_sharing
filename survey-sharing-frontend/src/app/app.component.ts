import { Component, Injectable, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
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
import { QuestionService } from './services/question.service';
import { filter } from 'rxjs/operators';
import { SupportService } from './support/support.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public username: string = 'dr.blues.__';
  user!: User;
  createdSurveys: Map<string, Survey> = new Map<string,Survey>();
  answers: Map<string, Answer> = new Map<string, Answer>();
  answer_surveys!: string[];
  invitations: Map<string, Invitation> = new Map<string, Invitation>();
  surveysOwners: Map<string, User> = new Map<string, User>();
  invitationSenders: Map<string, User> = new Map<string, User>();
  searchType!: string;
  query: string = "";
  refresh: boolean = false;
  darkMode: boolean = false;

  constructor(public router: Router, public userService: UserService, public surveyService: SurveyService,
              public answerService: AnswerService, public invitationService: InvitationService,
              public statisticsService: StatisticsService, public questionService: QuestionService,
              private themeService: NbThemeService){
  }

  ngOnInit(): void {
    const theme: string | null = localStorage.getItem('theme');
    if(theme!=null){
      this.themeService.changeTheme(theme);
      if(theme=='default')
        this.darkMode = false;
      else
        this.darkMode = true;
    }
    this.userService.findUsersByUsername(this.username).subscribe(responseMessage => {
      this.user = responseMessage.object[0];
      this.getCreatedSurveys(this.user.username);
      this.getAnswers(this.user.username);
      this.getInvitations(this.user.username);
    })
  }

  switchTheme(){
    if(this.darkMode){
      this.themeService.changeTheme('dark');
      localStorage.setItem('theme','dark');
    }
    else{
      this.themeService.changeTheme('default');
      localStorage.setItem('theme','default');
    }
  }

  getUser(): User{
    if(this.user!=null)
      return this.user;
    return new User("","","","","",-1,"","",[]);
  }

  navigate(route: string, parameters: string | null){
    this.refresh = true;
    if(parameters==null)
      this.router.navigate([route]);
    else
      this.router.navigate([route, parameters]);
  }

  reloadWindow(){
    if(this.refresh){
      this.refresh = false;
      window.location.reload();
    }
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
