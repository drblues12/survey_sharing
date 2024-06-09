import { Answer } from "./answer";
import { Invitation } from "./invitation";
import { Survey } from "./survey";

export class User{
  username!: string;
  name!: string;
  surname!: string;
  email!: string;
  age!: number;
  gender!: string;
  country!: string;
  created_surveys!: Survey[];
  answers!: Answer[];
  invitations!: Invitation[];
}
