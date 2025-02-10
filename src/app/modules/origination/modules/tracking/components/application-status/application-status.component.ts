import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-application-status',
  templateUrl: './application-status.component.html',
  styleUrls: ['./application-status.component.scss'],
})
export class ApplicationStatusComponent {
  @Input() applicationInfo: any = [];
}
