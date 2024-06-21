import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbWindowService } from '@nebular/theme';
import { AppComponent } from 'src/app/app.component';
import { Invitation } from 'src/app/entities/invitation';
import { Option } from 'src/app/entities/option';
import { ImageQuestion, MultipleChoiceQuestion, OpenEndedQuestion, Question } from 'src/app/entities/question';
import { Survey } from 'src/app/entities/survey';
import { User } from 'src/app/entities/user';
import { InvitationComponent } from '../invitation/invitation.component';
import { SupportService } from 'src/app/support/support.service';

@Component({
  selector: 'app-survey-details',
  templateUrl: './survey-details.component.html',
  styleUrls: ['./survey-details.component.scss']
})
export class SurveyDetailsComponent implements OnInit {

  survey!: Survey;
  ownerDetails!: User;
  questions: { id: string, question: Question}[] = [];
  invitations: { id: string, invitation: Invitation, recipient: User }[] = [];
  nullVariable: null = null;

  constructor(private appComponent: AppComponent, private route: ActivatedRoute,
              private windowService: NbWindowService, private supportService: SupportService) {}

  ngOnInit(): void {
    this.appComponent.reloadWindow();
    var surveyTitle = this.route.snapshot.paramMap.get('surveyTitle');
    if(surveyTitle!=null){
      this.appComponent.surveyService.findSurveyByTitle(surveyTitle).subscribe(responseMessage => {
        if(responseMessage.object!=null){
          this.survey = responseMessage.object;
          this.appComponent.userService.findUsersByUsername(this.survey.owner).subscribe(responseMessage2 => {
            if(responseMessage2.object!=null && responseMessage2.object.length>0)
              this.ownerDetails = responseMessage2.object[0];
            else
              alert(responseMessage.message);
          })
          this.survey.questions.forEach(q => {
            this.appComponent.questionService.findQuestionById(q).subscribe(responseMessage2 => {
              if(responseMessage2.object!=null && !this.questions.find(x => x.id==q)){
                this.questions.push({ id: q, question: responseMessage2.object });
                this.questions.sort((x,y) => {
                  if(x.id < y.id) return -1;
                  if(x.id > y.id) return 1;
                  return 0;
                })
              }
              else
                alert(responseMessage.message);
            })
          })
          this.survey.invitations.forEach(i => {
            this.appComponent.invitationService.findInvitationById(i).subscribe(responseMessage2 => {
              if(responseMessage2.object!=null && !this.invitations.find(x => x.id==i)){
                this.appComponent.userService.findUsersByUsername(responseMessage2.object.user).subscribe(responseMessage3 => {
                  if(responseMessage3.object!=null && responseMessage3.object.length>0){
                    this.invitations.push({ id: i, invitation: responseMessage2.object, recipient: responseMessage3.object[0] });
                    this.invitations.sort((i1, i2) => {
                      if(i1.id < i2.id)
                        return -1;
                      if(i1.id > i2.id)
                        return 1;
                      return 0;
                    })
                  }
                })
              }
            })
          })
        }
        else
          alert(responseMessage.message);
      })
    }
  }

  getOwnerDetails(): User{
    if(this.ownerDetails!=undefined)
      return this.ownerDetails;
    return new User("","","","","",-1,"","",[]);
  }

  getSurvey(): Survey{
    if(this.survey!=undefined)
      return this.survey;
    return new Survey("","","",[],[],[],[],null);
  }

  getQuestion(question: string): Question{
    const result = this.questions.find(x => x.id==question)?.question;
    if(result != undefined && result != null)
      return result;
    return new Question();
  }

  isMultipleChoice(question: Question): boolean{
    return question.type=='MultipleChoiceQuestion';
  }

  isOpenEnded(question: Question): boolean{
    return question.type=='OpenEndedQuestion';
  }

  isImage(question: Question): boolean{
    return question.type=='ImageQuestion';
  }

  getOptions(question: Question): Option[] | null{
    if(question.type=='MultipleChoiceQuestion'){
      const mcq: MultipleChoiceQuestion = question as MultipleChoiceQuestion;
      return mcq.options;
    }
    return null;
  }

  deleteSurvey(surveyTitle: string){
    this.appComponent.surveyService.deleteCreatedSurvey(this.appComponent.user.username, surveyTitle).subscribe(responseMessage => {
      alert(responseMessage.message);
      this.appComponent.navigate('user', null);
    })
  }

  getInvitationAcceptedIcon(invitation: Invitation){
    switch(invitation.accepted){
      case true:
        return 'checkmark-circle-2'
      case false:
        return 'close-circle'
      default:
        return ''
    }
  }

  getInvitationAcceptedStatus(invitation: Invitation){
    switch(invitation.accepted){
      case true:
        return 'success'
      case false:
        return 'danger'
      default:
        return ''
    }
  }

  openInvitationWindow(){
    this.supportService.surveyTitle = this.survey.title;
    this.supportService.username = this.appComponent.getUser().username;
    this.windowService.open(InvitationComponent,
      { title: 'Invite other users to answer your survey', windowClass: 'custom-window' });
  }

  deleteInvitation(invitation: string){
    this.appComponent.invitationService.deleteInvitation(this.appComponent.getUser().username, invitation).subscribe(ResponseMessage => {
      alert(ResponseMessage.message);
      window.location.reload();
    })
  }

}
