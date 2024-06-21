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
  createdSurveys: Survey[] = [];
  answers: {answer: Answer, surveyOwner: User}[] = [];
  invitations: {invitation: Invitation, surveyOwner: User}[] = [];
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
    this.checkLogin();
    this.themeCheck();
    this.userService.findUsersByUsername(this.username).subscribe(responseMessage => {
      this.user = responseMessage.object[0];
      this.fetchCreatedSurveys();
      this.fetchAnswers();
      this.fetchInvitations();
    })
  }

  checkLogin(): void {
    const loggedIn: string | null = localStorage.getItem('loggedIn');
    if(loggedIn==null){
      this.logout();
      return;
    }
    if(loggedIn=='true') return;
    this.logout();
  }

  themeCheck(): void {
    const theme: string | null = localStorage.getItem('theme');
    if(theme!=null){
      this.themeService.changeTheme(theme);
      if(theme=='default')
        this.darkMode = false;
      else
        this.darkMode = true;
    }
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

  fetchCreatedSurveys(): void {
    this.surveyService.findAllCreatedSurveys(this.username).subscribe(responseMessage => {
      if(responseMessage.object)
        this.createdSurveys = responseMessage.object;
    })
  }

  getCreatedSurveys(): Survey[] {
    if(this.createdSurveys)
      return this.createdSurveys;
    return [];
  }

  fetchAnswers(): void {
    this.answerService.findAllAnswers(this.username).subscribe(responseMessage => {
      var result: Answer[] = responseMessage.object;
      if(result!=null && result.length>0)
        result.forEach(answer => {
          this.surveyService.findSurveyByTitle(answer.survey).subscribe(responseMessage2 => {
            if(responseMessage2.object)
              this.userService.findUserByUsername(responseMessage2.object.owner).subscribe(responseMessage3 => {
                if(responseMessage3.object)
                  this.answers.push({answer: answer, surveyOwner: responseMessage3.object});
              })
          })
        })
    })
  }

  getAnswers(): {answer: Answer, surveyOwner: User}[] {
    if(this.answers)
      return this.answers;
    return [];
  }

  fetchInvitations(): void {
    this.invitationService.findAllInvitations(this.username).subscribe(responseMessage => {
      var result: Invitation[] = responseMessage.object;
      if(result!=null && result.length>0)
        result.forEach(invitation => {
          this.surveyService.findSurveyByTitle(invitation.survey).subscribe(responseMessage2 => {
            if(responseMessage2.object)
              this.userService.findUserByUsername(responseMessage2.object.owner).subscribe(responseMessage3 => {
                if(responseMessage3.object)
                  this.invitations.push({invitation: invitation, surveyOwner: responseMessage3.object});
              })
          })
        })
    })
  }

  getInvitations(): {invitation: Invitation, surveyOwner: User}[] {
    if(this.invitations)
      return this.invitations;
    return [];
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

  logout(){
    localStorage.setItem('loggedIn', 'false');
    this.navigate('login', null);
  }

}
