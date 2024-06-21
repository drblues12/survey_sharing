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

  setType(type: string){
    this.type = type;
  }

  setQuestionDate(questionDate: string[]){
    this.questionDate = questionDate;
  }

  compareTo(q2: Question): number {
    if(this.questionDate[2]<q2.questionDate[2]) return -1;
    if(this.questionDate[2]>q2.questionDate[2]) return 1;
    if(this.questionDate[1]<q2.questionDate[1]) return -1;
    if(this.questionDate[1]>q2.questionDate[1]) return 1;
    if(this.questionDate[0]<q2.questionDate[0]) return -1;
    if(this.questionDate[0]>q2.questionDate[0]) return 1;
    if(this.questionDate[3]<q2.questionDate[3]) return -1;
    if(this.questionDate[3]>q2.questionDate[3]) return 1;
    if(this.questionDate[4]<q2.questionDate[4]) return -1;
    if(this.questionDate[4]>q2.questionDate[4]) return 1;
    if(this.questionDate[5]<q2.questionDate[5]) return -1;
    if(this.questionDate[5]>q2.questionDate[5]) return 1;
    return 0;
  }
}

export class MultipleChoiceQuestion extends Question{
  options!: Option[];

  constructor(){
    super();
    this.options = [];
    this.type = "MultipleChoiceQuestion";
  }

  setOptions(options: Option[]){
    options.forEach(o => {
      if(!this.options.find(x => x.id==o.id))
        this.options.push(new Option(o.option));
    })
  }
}

export class OpenEndedQuestion extends Question{
  answer!: string;

  constructor(){
    super();
    this.type = "OpenEndedQuestion";
  }

  setAnswer(answer: string){
    this.answer = answer;
  }
}

export class ImageQuestion extends Question{
  url!: string;

  constructor(){
    super();
    this.type = "ImageQuestion";
  }

  setUrl(url: string){
    this.url = url;
  }
}
