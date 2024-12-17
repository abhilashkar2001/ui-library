import { Component, OnInit } from '@angular/core';
import { DrawerConstant } from 'app/shared/components/custom-drawer/custom-drawer.constant';

@Component({
  selector: 'app-credit-card-control',
  templateUrl: './credit-card-control.component.html',
  styleUrls: ['./credit-card-control.component.scss'],
})
export class CreditCardControlComponent implements OnInit {
  tabs = DrawerConstant.cardControlTabs;
  selectedTabName: any;

  constructor() {}

  ngOnInit(): void {
    this.selectedTabName = 'Increase Limit';
  }
  tabChanges(val: any) {
    console.log(val);
    this.selectedTabName = val?.screenName;
  }
}
