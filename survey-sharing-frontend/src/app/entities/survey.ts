import { Answer } from "./answer";
import { Invitation } from "./invitation";
import { Statistics } from "./statistics";
import { User } from "./user";

export class Survey{
  id!: string;
  title!: string;
  owner!: string;
  surveyType!: string;
  creationDate!: string[];
  answers!: string[];
  invitations!: string[];
  statistics!: string | null;
}
