import { Answer } from "./answer";
import { Invitation } from "./invitation";
import { Statistics } from "./statistics";
import { User } from "./user";

export class Survey{
  id!: string;
  title!: string;
  owner!: string;
  closed!: boolean;
  questions!: string[];
  creationDate!: string[];
  closingDate!: string[];
  answers!: string[];
  invitations!: string[];
  statistics!: string | null;

  constructor(id: string, title: string, owner: string, closed: boolean, questions: string[], creationDate: string[],
              closingDate: string[], answers: string[], invitations: string[], statistics: string | null){
    this.id = id;
    this.title = title;
    this.owner = owner;
    this.closed = closed;
    this.questions = questions;
    this.creationDate = creationDate;
    this.closingDate = closingDate;
    this.answers = answers;
    this.invitations = invitations;
    this.statistics = statistics;
  }
}
