import { Component, Input, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { Invitation } from 'src/app/entities/invitation';
import { User } from 'src/app/entities/user';
import { InvitationService } from 'src/app/services/invitation.service';
import { UserService } from 'src/app/services/user.service';
import { SupportService } from 'src/app/support/support.service';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss']
})
export class InvitationComponent implements OnInit {

  surveyTitle!: string;
  user!: string;
  users: {invited: boolean, user: User}[] = []
  message: string = "";

  constructor(private userService: UserService, private invitationService: InvitationService,
              private supportService: SupportService) {
    this.surveyTitle = this.supportService.surveyTitle;
    this.user = this.supportService.username;
  }

  ngOnInit(): void {
    this.userService.findAllUsers().subscribe(responseMessage => {
      if(responseMessage.object!=null){
        const result: User[] = responseMessage.object;
        result.forEach(x => {
          if(x.username != this.user)
            this.users.push({ invited: false, user: x });
        })
      }
    })
  }

  sendInvitations(){
    var toSend: Invitation[] = [];
    this.users.forEach(x => {
      if(x.invited){
        var i = new Invitation(x.user.username, this.surveyTitle, this.message);
        toSend.push(i);
      }
    })
    this.invitationService.createInvitations(this.surveyTitle, toSend).subscribe(responseMessage => {
      alert(responseMessage.message);
      window.location.reload();
    })
  }

}
