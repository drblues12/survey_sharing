import { Component } from '@angular/core';
import { NbMenuItem, NbThemeService } from '@nebular/theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'survey-sharing-frontend';
  user: any;
}
