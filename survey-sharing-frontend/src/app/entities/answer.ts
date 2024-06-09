import { Question } from "./question";
import { Survey } from "./survey";
import { User } from "./user";

export class Answer{
  id!: number;
  user!: User;
  survey!: Survey;
  questions!: Question[];
  date!: string; //TODO
  feedback!: string;
}
