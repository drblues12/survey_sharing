import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { SupportService } from 'src/app/support/support.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username!: string;
  email!: string;
  password!: string;
  showPassword = true;

  constructor(private appComponent: AppComponent) { }

  ngOnInit(): void { }

  getInputType() {
    if (this.showPassword) {
      return 'text';
    }
    return 'password';
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  login(){
    // TODO
    localStorage.setItem('loggedIn', 'true');
    this.appComponent.navigate('',null);
  }

  navigateToRegister(){
    this.appComponent.navigate('/register',null);
  }

}
