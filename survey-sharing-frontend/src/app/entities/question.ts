import { Option } from "./option";

export class Question{
  question!: string;
  type!: string;

  constructor(){
    this.question = "";
    this.type = "";
  }

  setQuestion(question: string){
    this.question = question;
  }
}

export class ImageQuestion extends Question{
  url!: string;

  constructor(){
    super();
    this.type = "ImageQuestion";
  }
}

export class MultipleChoiceQuestion extends Question{
  options!: Option[];

  constructor(){
    super();
    this.options = [];
    this.type = "MultipleChoiceQuestion";
  }
}

export class OpenEndedQuestion extends Question{
  answer!: string;

  constructor(){
    super();
    this.type = "OpenEndedQuestion";
  }
}
