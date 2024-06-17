import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

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
    this.appComponent.navigate('',null);
  }

  navigateToRegister(){
    this.appComponent.navigate('/register',null);
  }

  constructor(private appComponent: AppComponent) { }

  ngOnInit(): void {
  }

}
