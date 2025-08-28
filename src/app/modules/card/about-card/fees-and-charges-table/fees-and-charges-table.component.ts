import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fees-and-charges-table',
  templateUrl: './fees-and-charges-table.component.html',
  styleUrls: ['./fees-and-charges-table.component.scss'],
})
export class FeesAndChargesTableComponent {
  @Input() config!: any;
  @Input() data: any[] = [];
}
