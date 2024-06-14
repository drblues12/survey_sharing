import { Survey } from "./survey";
import { User } from "./user";

export class Invitation{
  id!: string;
  user!: string;
  survey!: string;
  message!: string;
  read!: boolean;
  accepted!: boolean;
  invitationDate!: string[];
}
