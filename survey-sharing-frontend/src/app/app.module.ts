import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule, NbSidebarModule, NbMenuModule, NbActionsModule, NbInputModule, NbCardModule, NbContextMenuModule, NbIconModule, NbSearchModule, NbSelectModule, NbToggleModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { LoginComponent } from './pages/login/login.component';
import { UserComponent } from './pages/user/user.component';
import { SurveyListComponent } from './pages/search/surveys/survey-list/survey-list.component';
import { AnswerComponent } from './pages/search/surveys/answer/answer.component';
import { UserListComponent } from './pages/search/user-list/user-list.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    SurveyListComponent,
    AnswerComponent,
    UserListComponent,
    StatisticsComponent,
    MessagesComponent,
    HomePageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbIconModule,
    NbEvaIconsModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbActionsModule,
    NbInputModule,
    NbCardModule,
    NbContextMenuModule,
    NbSearchModule,
    NbSelectModule,
    NbToggleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
