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
import { Question } from './entities/question';
import { ImageService } from './services/image.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public username: string = 'dr.blues.__';
  //public username: string = 'carmgug';
  user!: User;
  createdSurveys: Survey[] = [];
  answers: {answer: Answer, surveyOwner: User}[] = [];
  averageRatings: {surveyTitle: string, averageRating: number}[] = [];
  invitations: {invitation: Invitation, surveyOwner: User, survey: Survey}[] = [];
  searchType!: string;
  query: string = "";
  refresh: boolean = false;
  darkMode: boolean = false;

  constructor(public router: Router, public userService: UserService, public surveyService: SurveyService,
              public answerService: AnswerService, public invitationService: InvitationService,
              public statisticsService: StatisticsService, public questionService: QuestionService,
              public imageService: ImageService, private themeService: NbThemeService,
              public sanitizer: DomSanitizer){
  }

  ngOnInit(): void {
    //this.checkLogin();
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
    this.surveyService.findAllSurveysByOwner(this.username, true).subscribe(responseMessage => {
      if(responseMessage.object){
        this.createdSurveys = responseMessage.object;
        this.createdSurveys.forEach(s => {
          const surveyTitle: string = s.title;
          this.statisticsService.computeAverageRating(this.getUser().username, surveyTitle).subscribe(responseMessage => {
            if(responseMessage.object){
              this.averageRatings.push({surveyTitle: surveyTitle, averageRating: responseMessage.object});
            }
          })
        })
      }
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
          this.surveyService.findSurveyByTitle(answer.survey, true).subscribe(responseMessage2 => {
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
          this.surveyService.findSurveyByTitle(invitation.survey, true).subscribe(responseMessage2 => {
            if(responseMessage2.object)
              this.userService.findUserByUsername(responseMessage2.object.owner).subscribe(responseMessage3 => {
                if(responseMessage3.object)
                  this.invitations.push({invitation: invitation, surveyOwner: responseMessage3.object, survey: responseMessage2.object});
              })
          })
        })
    })
  }

  getInvitations(): {invitation: Invitation, surveyOwner: User, survey: Survey}[] {
    if(this.invitations)
      return this.invitations;
    return [];
  }

  getAverageRatings(){
    if(this.averageRatings)
      return this.averageRatings;
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

  compareQuestions(q1: Question, q2: Question): number {
    if(q1.questionDate[2]<q2.questionDate[2]) return -1;
    if(q1.questionDate[2]>q2.questionDate[2]) return 1;
    if(q1.questionDate[1]<q2.questionDate[1]) return -1;
    if(q1.questionDate[1]>q2.questionDate[1]) return 1;
    if(q1.questionDate[0]<q2.questionDate[0]) return -1;
    if(q1.questionDate[0]>q2.questionDate[0]) return 1;
    if(q1.questionDate[3]<q2.questionDate[3]) return -1;
    if(q1.questionDate[3]>q2.questionDate[3]) return 1;
    if(q1.questionDate[4]<q2.questionDate[4]) return -1;
    if(q1.questionDate[4]>q2.questionDate[4]) return 1;
    if(q1.questionDate[5]<q2.questionDate[5]) return -1;
    if(q1.questionDate[5]>q2.questionDate[5]) return 1;
    return 0;
  }

  compareInvitations(i1: Invitation, i2: Invitation): number {
    if(i1.invitationDate[2]<i2.invitationDate[2]) return -1;
    if(i1.invitationDate[2]>i2.invitationDate[2]) return 1;
    if(i1.invitationDate[1]<i2.invitationDate[1]) return -1;
    if(i1.invitationDate[1]>i2.invitationDate[1]) return 1;
    if(i1.invitationDate[0]<i2.invitationDate[0]) return -1;
    if(i1.invitationDate[0]>i2.invitationDate[0]) return 1;
    if(i1.invitationDate[3]<i2.invitationDate[3]) return -1;
    if(i1.invitationDate[3]>i2.invitationDate[3]) return 1;
    if(i1.invitationDate[4]<i2.invitationDate[4]) return -1;
    if(i1.invitationDate[4]>i2.invitationDate[4]) return 1;
    if(i1.invitationDate[5]<i2.invitationDate[5]) return -1;
    if(i1.invitationDate[5]>i2.invitationDate[5]) return 1;
    return 0;
  }

  compareAnswers(a1: Answer, a2: Answer): number {
    if(a1.answerDate[2]<a2.answerDate[2]) return -1;
    if(a1.answerDate[2]>a2.answerDate[2]) return 1;
    if(a1.answerDate[1]<a2.answerDate[1]) return -1;
    if(a1.answerDate[1]>a2.answerDate[1]) return 1;
    if(a1.answerDate[0]<a2.answerDate[0]) return -1;
    if(a1.answerDate[0]>a2.answerDate[0]) return 1;
    if(a1.answerDate[3]<a2.answerDate[3]) return -1;
    if(a1.answerDate[3]>a2.answerDate[3]) return 1;
    if(a1.answerDate[4]<a2.answerDate[4]) return -1;
    if(a1.answerDate[4]>a2.answerDate[4]) return 1;
    if(a1.answerDate[5]<a2.answerDate[5]) return -1;
    if(a1.answerDate[5]>a2.answerDate[5]) return 1;
    return 0;
  }

  getImageMimeType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      default:
        throw new Error('Image format not supported');
    }
  }

  logout(){
    //localStorage.setItem('loggedIn', 'false');
    //this.navigate('login', null);
  }

}
