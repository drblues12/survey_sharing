import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { UserComponent } from './pages/user/user.component';
import { SurveyListComponent } from './pages/search/surveys/survey-list/survey-list.component';
import { AnswerComponent } from './pages/search/surveys/answer/answer.component';
import { UserListComponent } from './pages/search/user-list/user-list.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    pathMatch: 'full'
  },
  {
    path: 'user',
    component: UserComponent
  },
  {
    path: 'statistics',
    component: StatisticsComponent
  },
  {
    path: 'messages',
    component: MessagesComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'user-list',
    component: UserListComponent
  },
  {
    path: 'survey-list',
    component: SurveyListComponent
  },
  {
    path: 'answer',
    component: AnswerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
