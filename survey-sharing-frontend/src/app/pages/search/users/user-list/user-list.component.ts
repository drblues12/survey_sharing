import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { User } from 'src/app/entities/user';
import { UserService } from 'src/app/services/user.service';
import { ResponseMessage } from 'src/app/support/response-message';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  private query!: string;
  public search_results: User[] = [];

  constructor(private appComponent: AppComponent,
              private router: Router) {
    this.query = this.appComponent.query;
  }

  ngOnInit(): void {
    this.search_results = [];
    if(this.query===""){
      this.appComponent.userService.findAllUsers().subscribe(responseMessage => {
        this.search_results = responseMessage.object
        if(this.search_results.length==0) alert (responseMessage.message);
      })
    }
    else{
      this.appComponent.userService.findUsersByNameAndSurname(this.query).subscribe(responseMessage => {
        this.search_results = responseMessage.object;
        if(this.search_results.length==0) alert (responseMessage.message);
      })
    }
  }

  goToSingleUserPage(username: string): void{
    this.router.navigate(['search/users/single-user', username]);
  }

}
