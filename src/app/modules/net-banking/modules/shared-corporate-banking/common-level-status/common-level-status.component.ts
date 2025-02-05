import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-common-level-status',
  templateUrl: './common-level-status.component.html',
  styleUrls: ['./common-level-status.component.scss'],
})
export class CommonLevelStatusComponent {
  @Input() approvalList: any;
}
