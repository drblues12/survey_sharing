import { Question } from "./question";
import { Survey } from "./survey";
import { User } from "./user";

export class Answer{
  id!: string;
  user!: string;
  survey!: string;
  questions!: Question[];
  answerDate!: string[];
  feedback!: string;
  rating!: number | null;
}
