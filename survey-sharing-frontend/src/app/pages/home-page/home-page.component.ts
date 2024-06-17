import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { Survey } from 'src/app/entities/survey';
import { User } from 'src/app/entities/user';
import { SurveyService } from 'src/app/services/survey.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(public appComponent: AppComponent) { }

  trending: Survey[] = [];
  user_details: Map<string,User> = new Map<string,User>();

  ngOnInit(): void {
    this.appComponent.reloadWindow();
    this.getTrending();
  }

  getTrending(): void {
    // TODO: sort surveys by ratings
    // Tmp: just showing survey list
    this.appComponent.surveyService.findAllSurveys().subscribe(responseMessage => {
      this.trending = responseMessage.object;
      if(this.trending!=null && this.trending.length>0)
        this.trending.forEach(survey => {
          this.getUserDetails(survey.owner);
        })
    })
  }

  getUserDetails(username: string): void {
    if(!this.user_details.has(username)){
      this.appComponent.userService.findUsersByUsername(username).subscribe(responseMessage => {
        var result = responseMessage.object[0];
        this.user_details.set(username, result);
      })
    }
  }

}
