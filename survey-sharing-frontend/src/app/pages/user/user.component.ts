import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { Answer } from 'src/app/entities/answer';
import { Invitation } from 'src/app/entities/invitation';
import { Survey } from 'src/app/entities/survey';
import { User } from 'src/app/entities/user';
import { AnswerService } from 'src/app/services/answer.service';
import { InvitationService } from 'src/app/services/invitation.service';
import { SurveyService } from 'src/app/services/survey.service';
import { UserService } from 'src/app/services/user.service';
import { ResponseMessage } from 'src/app/support/response-message';
import { SupportService } from 'src/app/support/support.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(public appComponent: AppComponent, private router: Router, private supportService: SupportService) { }

  ngOnInit(): void {
    this.appComponent.reloadWindow();
  }

  goToSurveyDetailsPage(surveyTitle: string){
    this.appComponent.navigate('survey-details', surveyTitle);
  }

  deleteCreatedSurvey(surveyTitle: string){
    this.appComponent.surveyService.deleteCreatedSurvey(this.appComponent.user.username, surveyTitle).subscribe(responseMessage => {
      alert(responseMessage.message);
      window.location.reload();
    })
  }

  deleteInvitation(invitation: string){
    this.appComponent.invitationService.deleteInvitation(this.appComponent.getUser().username, invitation).subscribe(responseMessage => {
      alert(responseMessage.message);
      window.location.reload();
    })
  }

  deleteAnswer(answer: string){
    this.appComponent.answerService.deleteAnswer(this.appComponent.getUser().username, answer).subscribe(responseMessage => {
      alert(responseMessage.message);
      window.location.reload();
    })
  }

  goToAnswerDetailsPage(survey: string){
    this.appComponent.navigate('answer-details', survey);
  }

  answerSurvey(survey: string){
    this.appComponent.navigate('answer', survey);
  }

  checkAccepted(survey: string): boolean {
    const answerToThisInvitation: {answer: Answer, surveyOwner: User} | undefined = this.appComponent.getAnswers().find(a => a.answer.survey==survey);
    return answerToThisInvitation!=undefined;
  }

  getTooltip(invitation: Invitation): string {
    if(this.checkAccepted(invitation.survey))
      return "You have already answered this survey";
    return "";
  }

}
