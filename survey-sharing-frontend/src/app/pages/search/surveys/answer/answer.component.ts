import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbWindowService } from '@nebular/theme';
import { AppComponent } from 'src/app/app.component';
import { Answer } from 'src/app/entities/answer';
import { Image } from 'src/app/entities/image';
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
  questions: {id: number, question: Question, answer: string}[] = [];
  questionId: number = 0;
  rating: number = 0;
  feedback: string = "";
  nextIndex: number = 0;

  constructor(private appComponent: AppComponent, private route: ActivatedRoute, private windowService: NbWindowService) { }

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
                  this.questions.push({id: this.generateId(), question: newQ, answer: ""});
                }
                if(this.isOpenEnded(responseMessage2.object)){
                  var newQ2: OpenEndedQuestion = new OpenEndedQuestion();
                  newQ2.setAnswer((responseMessage2.object as OpenEndedQuestion).answer);
                  newQ2.setQuestion(responseMessage2.object.question);
                  newQ2.setQuestionDate(responseMessage2.object.questionDate);
                  this.questions.push({id: this.generateId(), question: newQ2, answer: ""});
                }
                if(this.isImage(responseMessage2.object)){
                  var newQ3: ImageQuestion = new ImageQuestion();
                  newQ3.setImage((responseMessage2.object as ImageQuestion).image);
                  newQ3.setQuestion(responseMessage2.object.question);
                  newQ3.setQuestionDate(responseMessage2.object.questionDate);
                  this.questions.push({id: this.generateId(), question: newQ3, answer: ""});
                }
                this.questions.sort((q1, q2) => this.appComponent.compareQuestions(q1.question, q2.question));
              }
            })
          })
        }
        else alert(responseMessage.message);
      })
    }
  }

  generateId(): number {
    this.questionId++;
    return this.questionId;
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

  existsEmptyAnswer(): boolean {
    return this.questions.find(q => q.answer=="")!=undefined;
  }

  uploadImage(image: HTMLInputElement, questionId: number): void {
    if(image.files!=null && image.files.length>0){
      const file: File = image.files[0];
      const fileToByteArray = async(): Promise<number[]> => {
        return new Promise((resolve, reject) => {
          try{
            let reader = new FileReader();
            let fileByteArray: number[] = [];
            reader.readAsArrayBuffer(file);
            reader.onloadend = (evt) => {
              if(evt.target?.readyState === FileReader.DONE){
                const arrayBuffer = evt.target.result;
                if(arrayBuffer!=null && typeof arrayBuffer!=='string'){
                  const array = new Uint8Array(arrayBuffer);
                  array.forEach((item) => fileByteArray.push(item));
                }
              }
              resolve(fileByteArray);
            };
            reader.onerror = (error) => {
              reject(error);
            };
          }catch(e){
            reject(e);
          }
        })
      };
      (async() => {
        try{
          const byteArray = await fileToByteArray();
          this.appComponent.imageService.uploadImage(byteArray, file.name).subscribe(responseMessage => {
            if(responseMessage.object!=null){
              const image: Image = responseMessage.object;
              var index: number = this.questions.findIndex(q => q.id==questionId);
              if(index!=-1){
                this.questions[index].answer = image.id;
                alert("Image uploaded");
              }
            }
          })
        }catch(e){
          alert("There was an error uploading the image");
          console.error(e);
        }
      })();
    }
  }

  submit(): void {
    if(this.existsEmptyAnswer()){
      alert("All questions must have been answered");
      return;
    }
    this.questions.forEach(q => {
      if(this.isMultipleChoice(q.question)){
        var q2: MultipleChoiceQuestion = q.question as MultipleChoiceQuestion;
        const indexOptionSelected: number = q2.options.findIndex(x => x.option==q.answer)
        q2.options[indexOptionSelected].selected = true;
      }
      if(this.isOpenEnded(q.question))
        (q.question as OpenEndedQuestion).setAnswer(q.answer);
      if(this.isImage(q.question))
        (q.question as ImageQuestion).setImage(q.answer);
    })
    var questionList: Question[] = [];
    this.questions.forEach(q => {
      questionList.push(q.question);
    })
    var jsonObj = JSON.stringify(questionList.map(q => ({
      ...q,
      '@type': q.type
    })))
    this.appComponent.answerService.createAnswer(this.appComponent.user.username, this.getSurvey().title, this.rating, this.feedback, jsonObj).subscribe(responseMessage => {
      alert(responseMessage.message);
      this.appComponent.navigate('answer-details', this.getSurvey().title);
    })
  }

}
