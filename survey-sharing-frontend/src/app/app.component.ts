import { Component, OnInit } from '@angular/core';
import { GlobalService } from './services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private globalService: GlobalService){}

  ngOnInit(): void {
    //this.globalService.themeCheck();
    /*
    this.userService.findUsersByUsername(this.username).subscribe(responseMessage => {
      this.user = responseMessage.object[0];
      this.fetchCreatedSurveys();
      this.fetchAnswers();
      this.fetchInvitations();
    })
    */
  }

}
