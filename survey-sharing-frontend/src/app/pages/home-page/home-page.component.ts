import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { Survey } from 'src/app/entities/survey';
import { User } from 'src/app/entities/user';
import { SurveyService } from 'src/app/services/survey.service';
import { UserService } from 'src/app/services/user.service';
import { SupportService } from 'src/app/support/support.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(public appComponent: AppComponent) { }

  trending: {survey: Survey, owner: User}[] = [];

  ngOnInit(): void {
    this.appComponent.reloadWindow();
    this.getTrending();
  }

  getTrending(): void {
    // TODO: sort surveys by ratings
    // Tmp: just showing survey list
    this.appComponent.surveyService.findAllSurveys().subscribe(responseMessage => {
      if(responseMessage.object!=null && responseMessage.object.length>0){
        const surveys: Survey[] = responseMessage.object;
        surveys.forEach(survey => {
          this.appComponent.userService.findUserByUsername(survey.owner).subscribe(responseMessage2 => {
            if(responseMessage2.object){
              const owner: User = responseMessage2.object;
              this.trending.push({survey: survey, owner: owner});
            }
          })
        })
      }
    })
  }

  getAverageRating(surveyTitle: string): number {
    const entry: {surveyTitle: string, averageRating: number} | undefined = this.appComponent.getAverageRatings().find(x => x.surveyTitle==surveyTitle);
    if(entry!=undefined)
      return entry.averageRating;
    return 0;
  }

}
