import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-basic-page',
  templateUrl: './basic-page.component.html',
  styleUrls: ['./basic-page.component.scss']
})
export class BasicPageComponent implements OnInit {

  constructor(public globalService: GlobalService, private route: ActivatedRoute) { }

  ngOnInit(): void {}

  navigate(route: string, parameters: string | null){
    this.globalService.navigate(route, parameters, this.route);
  }

}
