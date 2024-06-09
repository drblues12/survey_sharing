import { Answer } from "./answer";
import { Invitation } from "./invitation";
import { Statistics } from "./statistics";
import { User } from "./user";

export class Survey{
  title!: string;
  owner!: User;
  survey_type!: string;
  creation_date!: string; //TODO
  answers!: Answer[];
  invitations!: Invitation[];
  statistics!: Statistics;
}
