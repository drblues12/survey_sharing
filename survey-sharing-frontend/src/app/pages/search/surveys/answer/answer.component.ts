import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { Option } from 'src/app/entities/option';
import { MultipleChoiceQuestion, Question } from 'src/app/entities/question';
import { Survey } from 'src/app/entities/survey';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss']
})
export class AnswerComponent implements OnInit {

  survey!: Survey;
  questions: {id: string, question: Question, answer: string}[] = [];

  constructor(private appComponent: AppComponent, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.appComponent.reloadWindow();
    var surveyTitle = this.route.snapshot.paramMap.get('surveyTitle');
    if(surveyTitle!=null){
      this.appComponent.surveyService.findSurveyByTitle(surveyTitle).subscribe(responseMessage => {
        if(responseMessage.object!=null){
          this.survey = responseMessage.object;
          this.survey.questions.forEach(q => {
            if(!this.questions.find(x => x.id==q)){
              this.appComponent.questionService.findQuestionById(q).subscribe(responseMessage2 => {
                if(responseMessage2.object!=null){
                  this.questions.push({id: q, question: responseMessage2.object, answer: ""});
                }
                else alert(responseMessage2.message);
              })
            }
          })
        }
        else alert(responseMessage.message);
      })
    }
  }

  getSurvey(): Survey{
    if(this.survey!=null) return this.survey;
    return new Survey("","","",[],[],[],[],null);
  }

  isMultipleChoice(question: Question): boolean {
    return question.type=='MultipleChoiceQuestion';
  }

  isOpenEnded(question: Question): boolean {
    return question.type=='OpenEndedQuestion';
  }

  isImage(question: Question): boolean {
    return question.type=='ImageQuestion';
  }

  getOptions(question: Question): Option[] | null {
    if(question.type=='MultipleChoiceQuestion'){
      const mcq: MultipleChoiceQuestion = question as MultipleChoiceQuestion;
      return mcq.options;
    }
    return null;
  }

  submit(): void {
    this.appComponent.answerService.createAnswer(this.appComponent.user.username, this.getSurvey().title)
    //TODO
  }

}
