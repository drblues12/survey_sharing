import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { Answer } from 'src/app/entities/answer';
import { Option } from 'src/app/entities/option';
import { ImageQuestion, MultipleChoiceQuestion, OpenEndedQuestion, Question } from 'src/app/entities/question';
import { Survey } from 'src/app/entities/survey';
import { User } from 'src/app/entities/user';

@Component({
  selector: 'app-answer-summary',
  templateUrl: './answer-summary.component.html',
  styleUrls: ['./answer-summary.component.scss']
})
export class AnswerSummaryComponent implements OnInit {

  answer!: Answer;
  survey!: Survey;
  user!: User;
  questions: {question: Question, answer: string}[] = [];

  constructor(private appComponent: AppComponent, private route: ActivatedRoute) { }

  ngOnInit(): void {
    var answer_id = this.route.snapshot.paramMap.get('answer_id');
    if(answer_id!=null){
      this.appComponent.answerService.findAnswerById(answer_id).subscribe(responseMessage => {
        if(responseMessage.object!=null){
          this.answer = responseMessage.object;
          this.appComponent.surveyService.findSurveyByTitle(this.answer.survey).subscribe(responseMessage2 => {
            if(responseMessage2.object!=null){
              this.survey = responseMessage2.object;
            }
          })
          this.appComponent.userService.findUserByUsername(this.answer.user).subscribe(responseMessage2 => {
            if(responseMessage2.object!=null)
              this.user = responseMessage2.object;
          })
          this.answer.questions.forEach(q => {
            this.appComponent.questionService.findQuestionById(q).subscribe(responseMessage2 => {
              if(responseMessage2.object!=null){
                const currQuestion: Question = responseMessage2.object;
                var answer: string = "";
                if(this.isMultipleChoice(currQuestion)){
                  const mcq: MultipleChoiceQuestion = currQuestion as MultipleChoiceQuestion;
                  const checked: Option | undefined = mcq.options.find(o => o.selected==true);
                  if(checked!=undefined)
                    answer = checked.option;
                }
                if(this.isOpenEnded(currQuestion)){
                  const oeq: OpenEndedQuestion = currQuestion as OpenEndedQuestion;
                  answer = oeq.answer;
                }
                if(this.isImage(currQuestion)){
                  const iq: ImageQuestion = currQuestion as ImageQuestion;
                  answer = iq.image;
                }
                this.questions.push({question: currQuestion, answer: answer});
                this.questions.sort((q1, q2) => this.appComponent.compareQuestions(q1.question, q2.question));
              }
            })
          })
        }
      })
    }
  }

  getAnswer(): Answer {
    if(this.answer)
      return this.answer;
    return new Answer("","");
  }

  getSurvey(): Survey {
    if(this.survey)
      return this.survey;
    return new Survey("","","",[],[],[],[],"");
  }

  getUser(): User {
    if(this.user)
      return this.user;
    return new User("","","","","",-1,"","",[]);
  }

  isMultipleChoice(q: Question){
    return q.type=='MultipleChoiceQuestion';
  }

  isOpenEnded(q: Question){
    return q.type=='OpenEndedQuestion';
  }

  isImage(q: Question){
    return q.type=='ImageQuestion';
  }

  getOptions(q: Question): Option[] | null{
    if(q.type=='MultipleChoiceQuestion'){
      const mcq: MultipleChoiceQuestion = q as MultipleChoiceQuestion;
      return mcq.options;
    }
    return null;
  }

  getRating(): number {
    if(this.getAnswer().rating)
      return this.getAnswer().rating as number;
    return 0;
  }
}
