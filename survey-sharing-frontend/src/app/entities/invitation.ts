import { Survey } from "./survey";
import { User } from "./user";

export class Invitation{
  id!: number;
  user!: User;
  survey!: Survey;
  message!: string;
  read!: boolean;
  accepted!: boolean;
  date!: string; //TODO
}
