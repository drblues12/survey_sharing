import { Injectable } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { BehaviorSubject, Observable, map, tap } from "rxjs";
import { User } from "../entities/user";
import { HttpClient } from "@angular/common/http";
import { ResponseMessage } from "./response-message";
import { UserService } from "../services/user.service";
import { SurveyService } from "../services/survey.service";
import { AnswerService } from "../services/answer.service";
import { InvitationService } from "../services/invitation.service";
import { QuestionService } from "../services/question.service";
import { StatisticsService } from "../services/statistics.service";
import { Survey } from "../entities/survey";
import { Answer } from "../entities/answer";
import { Invitation } from "../entities/invitation";

@Injectable({
  providedIn: 'root'
})
export class SupportService{
  public surveyTitle!: string;
  public username!: string;

  constructor() { }

}
