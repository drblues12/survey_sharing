import { Injectable } from "@angular/core";
import { User } from "../entities/user";
import { Survey } from "../entities/survey";
import { Answer } from "../entities/answer";
import { Invitation } from "../entities/invitation";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "./user.service";
import { SurveyService } from "./survey.service";
import { InvitationService } from "./invitation.service";
import { QuestionService } from "./question.service";
import { StatisticsService } from "./statistics.service";
import { ImageService } from "./image.service";
import { DomSanitizer } from "@angular/platform-browser";
import { NbThemeService } from "@nebular/theme";
import { AnswerService } from "./answer.service";

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  username!:string;
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
    public imageService: ImageService, public themeService: NbThemeService,
    public sanitizer: DomSanitizer){}

  initialize(username: string): void {
    this.username = username;
    this.fetchUser();
    this.fetchCreatedSurveys();
    this.fetchAnswers();
    this.fetchInvitations();
  }

  /*
  checkLogin(): void {
    const loggedIn: string | null = localStorage.getItem('loggedIn');
    if(loggedIn==null){
      this.logout();
      return;
    }
    if(loggedIn=='true') return;
    this.logout();
  }
  */

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

  navigate(route: string, parameters: string | null, relativeTo?: ActivatedRoute){
    this.refresh = true;
    if(parameters==null){
      if(relativeTo)
        this.router.navigate([route], { relativeTo });
      else
        this.router.navigate([route]);
    }
    else{
      if(relativeTo)
        this.router.navigate([route, parameters], { relativeTo });
      else
        this.router.navigate([route, parameters]);
    }
  }

  reloadWindow(){
    if(this.refresh){
      this.refresh = false;
      window.location.reload();
    }
  }

  fetchUser(): void {
    this.userService.findUserByUsername(this.username).subscribe(responseMessage => {
      this.user = responseMessage.object;
    })
  }

  getUser(): User{
    if(this.user!=null)
      return this.user;
    return new User("","","","","",-1,"","",[]);
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

  compareDates(date1: string[], date2: string[]): number {
    if(date1[2]<date2[2]) return -1;
    if(date1[2]>date2[2]) return 1;
    if(date1[1]<date2[1]) return -1;
    if(date1[1]>date2[1]) return 1;
    if(date1[0]<date2[0]) return -1;
    if(date1[0]>date2[0]) return 1;
    if(date1[3]<date2[3]) return -1;
    if(date1[3]>date2[3]) return 1;
    if(date1[4]<date2[4]) return -1;
    if(date1[4]>date2[4]) return 1;
    if(date1[5]<date2[5]) return -1;
    if(date1[5]>date2[5]) return 1;
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
    localStorage.setItem('loggedIn', 'false');
    this.navigate('login', null);
  }
}
