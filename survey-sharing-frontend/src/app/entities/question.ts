import { Option } from "./option";

export class Question{
  id!: string;
  question!: string;
}

export class ImageQuestion extends Question{
  url!: string;
}

export class MultipleChoiceQuestion extends Question{
  options!: Option[]
}

export class OpenEndedQuestion extends Question{
  answer!: string;
}
