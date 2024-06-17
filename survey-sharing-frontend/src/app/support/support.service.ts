import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class SupportService{
  public surveyTitle!: string;
  public user!: string;

  constructor() { }
}
