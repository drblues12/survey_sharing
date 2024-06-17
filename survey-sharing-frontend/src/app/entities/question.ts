import { Option } from "./option";

export class Question{
  question!: string;
  type!: string;
  questionDate!: string[];

  constructor(){
    this.question = "";
    this.type = "";
    const now: Date = new Date();
    this.questionDate = [now.getDate()+'', (now.getMonth()+1)+'', now.getFullYear()+'',
                        now.getHours()+'',now.getMinutes()+'',(now.getSeconds()+'').padStart(2, '0')];
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
