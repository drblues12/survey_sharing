import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Survey } from 'src/app/entities/survey';
import { User } from 'src/app/entities/user';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-single-user',
  templateUrl: './single-user.component.html',
  styleUrls: ['./single-user.component.scss']
})
export class SingleUserComponent implements OnInit {

  constructor(private route: ActivatedRoute, public globalService: GlobalService) { }

  user!: User;
  createdSurveys: Survey[] = [];

  ngOnInit(): void{
    this.globalService.reloadWindow();
    var username = this.route.snapshot.paramMap.get('username');
    if(username!=null){
      this.globalService.userService.findUsersByUsername(username).subscribe(responseMessage => {
        this.user = responseMessage.object[0];
        this.findSurveys();
      });
    }
    else{
      alert ("No results");
    }
  }

  findSurveys(){
    this.globalService.surveyService.findAllSurveysByOwner(this.user.username, false).subscribe(responseMessage => {
      var search_results: Survey[] = responseMessage.object;
      if(search_results.length==0) alert (responseMessage.message);
      this.createdSurveys = search_results;
    })
  }

  surveyAlreadyAnswered(surveyTitle: string): boolean {
    return this.globalService.getAnswers().find(a => a.answer.survey==surveyTitle)!=undefined;
  }

}
