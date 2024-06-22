import { StarTemplateContext } from "@ng-bootstrap/ng-bootstrap/rating/rating";

export class StarTemplate implements StarTemplateContext{
  fill!: number;
  index!: number;

  constructor(index: number, fill: number){
    this.index = index;
    this.fill = fill;
  }
}
