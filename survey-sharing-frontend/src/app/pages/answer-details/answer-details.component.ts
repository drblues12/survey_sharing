import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { Answer } from 'src/app/entities/answer';
import { Image } from 'src/app/entities/image';
import { Option } from 'src/app/entities/option';
import { ImageQuestion, MultipleChoiceQuestion, OpenEndedQuestion, Question } from 'src/app/entities/question';
import { Survey } from 'src/app/entities/survey';
import { User } from 'src/app/entities/user';

@Component({
  selector: 'app-answer-details',
  templateUrl: './answer-details.component.html',
  styleUrls: ['./answer-details.component.scss']
})
export class AnswerDetailsComponent implements OnInit {

  answer!: Answer;
  survey!: Survey;
  surveyOwner!: User;
  questions: {question: Question, answer: string}[] = [];
  images: {id: string, image: Image, src: SafeUrl}[] = [];

  constructor(private appComponent: AppComponent, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.appComponent.reloadWindow();
    var surveyTitle = this.route.snapshot.paramMap.get('surveyTitle');
    if(surveyTitle!=null){
      this.appComponent.answerService.findAnswersBySurveyTitle(this.appComponent.username, surveyTitle).subscribe(responseMessage => {
        if(responseMessage.object!=null && responseMessage.object.length>0){
          this.answer = responseMessage.object[0];
          this.answer.questions.forEach(q => {
            this.appComponent.questionService.findQuestionById(q).subscribe(responseMessage2 => {
              if(responseMessage2.object!=null){
                var currQuestion: Question = responseMessage2.object;
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
                  this.appComponent.imageService.findImageById(answer).subscribe(responseMessage3 => {
                    if(responseMessage3.object){
                      const byteArray: number[] = responseMessage3.object.image;
                      try{
                        const mimeType = this.appComponent.getImageMimeType(responseMessage3.object.fileName);
                        const blob = new Blob([new Uint8Array(byteArray)], { type: mimeType });
                        const imageUrl = URL.createObjectURL(blob);
                        const sanitizedImageUrl = this.appComponent.sanitizer.bypassSecurityTrustUrl(imageUrl);
                        this.images.push({id: answer, image: responseMessage3.object, src: sanitizedImageUrl});
                      }catch(e){
                        console.error(e);
                      }
                    }
                  })
                }
                this.questions.push({question: currQuestion, answer: answer});
                this.questions.sort((q1, q2) => this.appComponent.compareQuestions(q1.question,q2.question));
              }
            })
          })
        }
      })
      this.appComponent.surveyService.findSurveyByTitle(surveyTitle, true).subscribe(responseMessage => {
        if(responseMessage.object!=null){
          this.survey = responseMessage.object;
          this.appComponent.userService.findUserByUsername(this.survey.owner).subscribe(responseMessage2 => {
            if(responseMessage2.object!=null)
              this.surveyOwner = responseMessage2.object;
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
    return new Survey("","","",false,[],[],[],[],[],"");
  }

  getSurveyOwner(): User {
    if(this.surveyOwner)
      return this.surveyOwner;
    return new User("","","","","",-1,"","",[]);
  }

  deleteAnswer(answer: string){
    this.appComponent.answerService.deleteAnswer(this.appComponent.getUser().username, answer).subscribe(responseMessage => {
      alert(responseMessage.message);
      this.appComponent.navigate('user', null);
    })
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
    else
      return 0;
  }

  getImage(question: Question): {id: string, image: Image, src: SafeUrl} | null {
    if(this.isImage(question)){
      const iq: ImageQuestion = question as ImageQuestion;
      const index: number = this.images.findIndex(i => i.id==iq.image);
      if(index!=-1){
        return this.images[index];
      }
    }
    return null;
  }

}
