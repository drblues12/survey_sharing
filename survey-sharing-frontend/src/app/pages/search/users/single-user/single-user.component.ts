import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { Survey } from 'src/app/entities/survey';
import { User } from 'src/app/entities/user';
import { SurveyService } from 'src/app/services/survey.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-single-user',
  templateUrl: './single-user.component.html',
  styleUrls: ['./single-user.component.scss']
})
export class SingleUserComponent implements OnInit {

  constructor(private route: ActivatedRoute, private appComponent: AppComponent) { }

  user!: User;
  createdSurveys: Survey[] = [];

  ngOnInit(): void{
    this.appComponent.reloadWindow();
    var username = this.route.snapshot.paramMap.get('username');
    if(username!=null){
      this.appComponent.userService.findUsersByUsername(username).subscribe(responseMessage => {
        this.user = responseMessage.object[0];
        this.findSurveys();
      });
    }
    else{
      alert ("No results");
    }
  }

  findSurveys(){
    this.appComponent.surveyService.findAllSurveysByOwner(this.user.username).subscribe(responseMessage => {
      var search_results: Survey[] = responseMessage.object;
      if(search_results.length==0) alert (responseMessage.message);
      this.createdSurveys = search_results;
    })
  }

}
