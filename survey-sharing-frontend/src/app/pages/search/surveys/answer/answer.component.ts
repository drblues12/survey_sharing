import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { Answer } from 'src/app/entities/answer';
import { Option } from 'src/app/entities/option';
import { ImageQuestion, MultipleChoiceQuestion, OpenEndedQuestion, Question } from 'src/app/entities/question';
import { Survey } from 'src/app/entities/survey';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss']
})
export class AnswerComponent implements OnInit {

  answer!: Answer;
  survey!: Survey;
  questions: {question: Question, answer: string}[] = [];
  nextIndex: number = 0;

  constructor(private appComponent: AppComponent, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.appComponent.reloadWindow();
    var surveyTitle = this.route.snapshot.paramMap.get('surveyTitle');
    if(surveyTitle!=null){
      this.appComponent.surveyService.findSurveyByTitle(surveyTitle).subscribe(responseMessage => {
        if(responseMessage.object!=null){
          this.survey = responseMessage.object;
          this.answer = new Answer(this.appComponent.user.username, this.survey.title);
          this.survey.questions.forEach(q => {
            this.appComponent.questionService.findQuestionById(q).subscribe(responseMessage2 => {
              if(responseMessage2.object!=null){
                if(this.isMultipleChoice(responseMessage2.object)){
                  var newQ: MultipleChoiceQuestion = new MultipleChoiceQuestion();
                  newQ.setOptions((responseMessage2.object as MultipleChoiceQuestion).options);
                  newQ.setQuestion(responseMessage2.object.question);
                  newQ.setQuestionDate(responseMessage2.object.questionDate);
                  this.questions.push({question: newQ, answer: ""});
                }
                if(this.isOpenEnded(responseMessage2.object)){
                  var newQ2: OpenEndedQuestion = new OpenEndedQuestion();
                  newQ2.setAnswer((responseMessage2.object as OpenEndedQuestion).answer);
                  newQ2.setQuestion(responseMessage2.object.question);
                  newQ2.setQuestionDate(responseMessage2.object.questionDate);
                  this.questions.push({question: newQ2, answer: ""});
                }
                if(this.isImage(responseMessage2.object)){
                  var newQ3: ImageQuestion = new ImageQuestion();
                  newQ3.setUrl((responseMessage2.object as ImageQuestion).url);
                  newQ3.setQuestion(responseMessage2.object.question);
                  newQ3.setQuestionDate(responseMessage2.object.questionDate);
                  this.questions.push({question: newQ3, answer: ""});
                }
                this.questions.sort((q1, q2) => q1.question.compareTo(q2.question));
              }
            })
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
    this.questions.forEach(q => {
      if(this.isMultipleChoice(q.question)){
        var q2: MultipleChoiceQuestion = q.question as MultipleChoiceQuestion;
        const indexOptionSelected: number = q2.options.findIndex(x => x.option==q.answer)
        q2.options[indexOptionSelected].selected = true;
      }
      if(this.isOpenEnded(q.question))
        (q.question as OpenEndedQuestion).setAnswer(q.answer);
      if(this.isImage(q.question))
        (q.question as ImageQuestion).setUrl(q.answer);
    })
    var questionList: Question[] = [];
    this.questions.forEach(q => {
      questionList.push(q.question);
    })
    var jsonObj = JSON.stringify(questionList.map(q => ({
      ...q,
      '@type': q.type
    })))
    this.appComponent.answerService.createAnswer(this.appComponent.user.username, this.getSurvey().title, -1, ".", jsonObj).subscribe(responseMessage => {
      alert(responseMessage.message);
      this.appComponent.navigate('user', null);
    })
  }

}
