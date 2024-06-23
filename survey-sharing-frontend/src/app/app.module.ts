import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormGroup, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule, NbSidebarModule, NbMenuModule, NbActionsModule, NbInputModule, NbCardModule, NbContextMenuModule, NbIconModule, NbSearchModule, NbSelectModule, NbToggleModule, NbButtonModule, NbFormFieldModule, NbStepperModule, NbListModule, NbUserModule, NbTabsetModule, NbBadgeModule, NbPopoverModule, NbPosition, NbRadioModule, NbTooltipModule, NbWindowModule, NbCheckboxModule, NbAccordionModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { LoginComponent } from './pages/login/login.component';
import { UserComponent } from './pages/user/user.component';
import { SurveyListComponent } from './pages/search/surveys/survey-list/survey-list.component';
import { AnswerComponent } from './pages/search/surveys/answer/answer.component';
import { UserListComponent } from './pages/search/users/user-list/user-list.component';
import { CreateSurveyComponent } from './pages/create-survey/create-survey.component';
import { RegisterComponent } from './pages/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SingleUserComponent } from './pages/search/users/single-user/single-user.component';
import { SurveyDetailsComponent } from './pages/survey-details/survey-details.component';
import { InvitationComponent } from './pages/invitation/invitation.component';
import { AnswerDetailsComponent } from './pages/answer-details/answer-details.component';
import { AnswerSummaryComponent } from './pages/answer-summary/answer-summary.component';
import { NgbModule, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { RatingComponent } from './support/rating/rating.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { PieChartComponent } from './support/charts/pie-chart/pie-chart.component';
import { BarChartComponent } from './support/charts/bar-chart/bar-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    SurveyListComponent,
    AnswerComponent,
    UserListComponent,
    CreateSurveyComponent,
    RegisterComponent,
    SingleUserComponent,
    SurveyDetailsComponent,
    InvitationComponent,
    AnswerDetailsComponent,
    AnswerSummaryComponent,
    RatingComponent,
    PieChartComponent,
    BarChartComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
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
    NbToggleModule,
    NbButtonModule,
    NbFormFieldModule,
    NbStepperModule,
    NbListModule,
    NbUserModule,
    NbTabsetModule,
    NbBadgeModule,
    NbPopoverModule,
    NbRadioModule,
    NbTooltipModule,
    NbWindowModule.forRoot(),
    NbCheckboxModule,
    NgbModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    NbAccordionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
