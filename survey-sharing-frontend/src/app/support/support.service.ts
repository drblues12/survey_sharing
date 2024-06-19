import { Injectable } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class SupportService{
  public surveyTitle!: string;
  public user!: string;

  constructor() { }
}
