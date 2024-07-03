import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { UserComponent } from './pages/basic-page/user/user.component';
import { SurveyListComponent } from './pages/basic-page/search/surveys/survey-list/survey-list.component';
import { AnswerComponent } from './pages/basic-page/search/surveys/answer/answer.component';
import { UserListComponent } from './pages/basic-page/search/users/user-list/user-list.component';
import { SingleUserComponent } from './pages/basic-page/search/users/single-user/single-user.component';
import { CreateSurveyComponent } from './pages/basic-page/create-survey/create-survey.component';
import { RegisterComponent } from './pages/register/register.component';
import { SurveyDetailsComponent } from './pages/basic-page/survey-details/survey-details.component';
import { AnswerDetailsComponent } from './pages/basic-page/answer-details/answer-details.component';
import { AnswerSummaryComponent } from './pages/basic-page/answer-summary/answer-summary.component';
import { BasicPageComponent } from './pages/basic-page/basic-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
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
    path: 'home',
    component: BasicPageComponent,
    children: [
      {
        path: 'user',
        component: UserComponent
      },
      {
        path: 'create-survey',
        component: CreateSurveyComponent
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
        path: 'answer/:surveyTitle',
        component: AnswerComponent
      },
      {
        path: 'survey-details/:surveyTitle',
        component: SurveyDetailsComponent
      },
      {
        path: 'answer-details/:surveyTitle',
        component: AnswerDetailsComponent
      },
      {
        path: 'answer-summary/:answer_id',
        component: AnswerSummaryComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
