import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { UserComponent } from './pages/user/user.component';
import { SurveyListComponent } from './pages/search/surveys/survey-list/survey-list.component';
import { AnswerComponent } from './pages/search/surveys/answer/answer.component';
import { UserListComponent } from './pages/search/users/user-list/user-list.component';
import { SingleUserComponent } from './pages/search/users/single-user/single-user.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { CreateSurveyComponent } from './pages/create-survey/create-survey.component';
import { RegisterComponent } from './pages/register/register.component';
import { SurveyDetailsComponent } from './pages/survey-details/survey-details.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'user',
    component: UserComponent
  },
  {
    path: 'create-survey',
    component: CreateSurveyComponent
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
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'search/users',
    component: UserListComponent
  },
  {
    path: 'search/users/single-user/:username',
    component: SingleUserComponent
  },
  {
    path: 'search/surveys',
    component: SurveyListComponent
  },
  {
    path: 'answer',
    component: AnswerComponent
  },
  {
    path: 'survey-details/:surveyTitle',
    component: SurveyDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
