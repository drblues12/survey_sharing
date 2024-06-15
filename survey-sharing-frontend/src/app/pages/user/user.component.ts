import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(public appComponent: AppComponent) { }

  user: User = this.appComponent.user_tmp;
  createdSurveys: Map<string, Survey> = this.appComponent.createdSurveys;
  answers: Map<string, Answer> = this.appComponent.answers;
  answer_surveys: string[] = this.appComponent.answer_surveys;
  invitations: Map<string, Invitation> = this.appComponent.invitations;
  surveysOwners: Map<string, User> = this.appComponent.surveysOwners;
  invitationSenders: Map<string, User> = this.appComponent.invitationSenders;

  ngOnInit(): void {
    if(this.appComponent.reloadUser){
      this.appComponent.reloadUser = false;
      window.location.reload();
    }
  }

}
