import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username!: string;
  email!: string;
  password!: string;
  router: Router;

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
    this.router.navigate(['']);
  }

  navigateToRegister(){
    this.router.navigate(['/register']);
  }

  constructor(private r: Router) {
    this.router = r;
  }

  ngOnInit(): void {
  }

}
