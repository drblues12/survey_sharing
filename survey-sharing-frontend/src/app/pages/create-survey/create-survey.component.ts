import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { NbMenuService, NbPopoverDirective, NbPosition, NbTrigger } from '@nebular/theme';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.scss']
})
export class CreateSurveyComponent implements OnInit {

  constructor(private appComponent: AppComponent, private nbMenuService: NbMenuService) { }

  surveyTitle!: string;
  available!: boolean;
  questionTypes = [
    { title: 'Multiple choice' },
    { title: 'Open ended' },
    { title: 'Image' }
  ]

  ngOnInit(): void {
    this.nbMenuService.onItemClick()
    .pipe(
      filter(({ tag }) => tag === 'my-context-menu'),
      map(({ item: { title } }) => title)
    )
    .subscribe(title => this.addQuestion(title))
  }

  checkAvailability() {
    if(this.surveyTitle==null || this.surveyTitle=='')
      alert("Survey name is empty");
    else{
      this.appComponent.surveyService.findSurveysByTitle(this.surveyTitle).subscribe(responseMessage => {
        if(responseMessage!=null){
          if(responseMessage.object.length>0)
            this.available = false;
          else
            this.available = true;
        }
      })
    }
  }

  addQuestion(questionType: string){
    // TODO
  }

  submit(){
    // TODO
  }

}
