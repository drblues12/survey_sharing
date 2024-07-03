import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { Answer } from 'src/app/entities/answer';
import { Invitation } from 'src/app/entities/invitation';
import { User } from 'src/app/entities/user';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(public globalService: GlobalService) { }

  debug(){
    console.log(this.globalService.getUser());
  }

  ngOnInit(): void {
    this.globalService.reloadWindow();
  }

  goToSurveyDetailsPage(surveyTitle: string){
    this.globalService.navigate('survey-details', surveyTitle);
  }

  deleteCreatedSurvey(surveyTitle: string){
    this.globalService.surveyService.deleteCreatedSurvey(this.globalService.user.username, surveyTitle).subscribe(responseMessage => {
      alert(responseMessage.message);
      window.location.reload();
    })
  }

  deleteInvitation(invitation: string){
    this.globalService.invitationService.deleteInvitation(this.globalService.getUser().username, invitation).subscribe(responseMessage => {
      alert(responseMessage.message);
      window.location.reload();
    })
  }

  deleteAnswer(answer: string){
    this.globalService.answerService.deleteAnswer(this.globalService.getUser().username, answer).subscribe(responseMessage => {
      alert(responseMessage.message);
      window.location.reload();
    })
  }

  goToAnswerDetailsPage(survey: string){
    this.globalService.navigate('answer-details', survey);
  }

  answerSurvey(survey: string){
    this.globalService.navigate('answer', survey);
  }

  checkAccepted(survey: string): boolean {
    const answerToThisInvitation: {answer: Answer, surveyOwner: User} | undefined = this.globalService.getAnswers().find(a => a.answer.survey==survey);
    return answerToThisInvitation!=undefined;
  }

  getTooltip(invitation: Invitation): string {
    if(this.globalService.invitations.find(i => i.invitation.id==invitation.id)?.survey.closed)
      return "This survey is closed";
    if(this.checkAccepted(invitation.survey))
      return "You have already answered this survey";
    return "";
  }

  getAverageRating(surveyTitle: string): number {
    const result: {surveyTitle: string, averageRating: number} | undefined = this.globalService.getAverageRatings().find(x => x.surveyTitle==surveyTitle);
    if(result!=undefined)
      return result.averageRating;
    else
      return 0;
  }

}
