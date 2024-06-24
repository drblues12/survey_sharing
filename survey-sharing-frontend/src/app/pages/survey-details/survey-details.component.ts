import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbWindowService } from '@nebular/theme';
import { AppComponent } from 'src/app/app.component';
import { Invitation } from 'src/app/entities/invitation';
import { Option } from 'src/app/entities/option';
import { MultipleChoiceQuestion, Question } from 'src/app/entities/question';
import { Survey } from 'src/app/entities/survey';
import { User } from 'src/app/entities/user';
import { InvitationComponent } from '../invitation/invitation.component';
import { SupportService } from 'src/app/support/support.service';
import { Answer } from 'src/app/entities/answer';
import { Statistics } from 'src/app/entities/statistics';

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
  answers: { id: string, answer: Answer, user: User }[] = [];
  answersWithFeedback: { id: string, answer: Answer, user: User }[] = [];
  statistics!: Statistics;
  nullVariable: null = null;

  constructor(public appComponent: AppComponent, private route: ActivatedRoute,
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
          this.survey.answers.forEach(a => {
            this.appComponent.answerService.findAnswerById(a).subscribe(responseMessage2 => {
              if(responseMessage2.object!=null){
                const currAnswer: Answer = responseMessage2.object;
                this.appComponent.userService.findUserByUsername(currAnswer.user).subscribe(responseMessage3 => {
                  if(responseMessage3.object!=null){
                    const currUser: User = responseMessage3.object;
                    this.answers.push({id: currAnswer.id, answer: currAnswer, user: currUser});
                    if(currAnswer.feedback!="")
                      this.answersWithFeedback.push({id: currAnswer.id, answer: currAnswer, user: currUser});
                  }
                })
              }
            })
          })
          this.appComponent.statisticsService.computeStatistics(this.appComponent.getUser().username, this.survey.title).subscribe(responseMessage2 => {
            if(responseMessage2.object)
              this.statistics = responseMessage2.object;
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

  goToAnswerSummaryPage(answer: Answer){
    this.appComponent.navigate('answer-summary', answer.id);
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

  getRating(answer: Answer): number {
    if(answer.rating)
      return answer.rating as number;
    return 0;
  }

  getStatistics(): Statistics {
    if(this.statistics)
      return this.statistics;
    return new Statistics("",this.getSurvey().title, -1, -1, -1, [], -1, -1, [], -1, -1, -1, [], -1, -1, [], -1);
  }

  getDistribution(data: number[], categories: number[], type: string): number[] {
    var support: {category: number, count: number}[] = [];
    var distribution: number[] = [];
    categories.forEach(c => {
      support.push({category: c, count: 0});
      distribution.push(0);
    });
    data.forEach(d => {
      const entry: {category: number, count: number} | undefined = support.find(x => x.category==d);
      if(entry!=undefined) entry.count++;
    })
    if(type=='Ratings')
      support.forEach(x => distribution[x.category-1]=x.count);
    if(type=='Age'){
      const minValue: number = Math.min(...data as number[]);
      support.forEach(x => distribution[x.category-minValue]=x.count);
    }
    return distribution;
  }

  linspace(data: number[]): {numberArray: number[], stringArray: string[]} {
    const minValue: number = Math.min(...data);
    const maxValue: number = Math.max(...data);
    var numberArray: number[] = [];
    var stringArray: string[] = [];
    for(let i=minValue; i<=maxValue; i++){
      numberArray.push(i);
      stringArray.push(i+'');
    }
    return {numberArray: numberArray, stringArray: stringArray};
  }

  getDistributionCountries(data: string[], categories: string[]): number[] {
    var result: number[] = [];
    var support: {name: string, value: number}[] = [];
    categories.forEach(c => {
      support.push({name: c, value: 0});
    });
    data.forEach(d => {
      const index: number | undefined = support.findIndex(x => x.name==d);
      if(index!=undefined)
        support[index].value++;
    })
    support.forEach(x => {
      result.push(x.value);
    })
    return result;
  }

  getCountries(data: string[]): string[] {
    var result: string[] = [];
    data.forEach(d => {
      if(!result.find(x => x==d))
        result.push(d);
    })
    result.sort();
    return result;
  }

}
