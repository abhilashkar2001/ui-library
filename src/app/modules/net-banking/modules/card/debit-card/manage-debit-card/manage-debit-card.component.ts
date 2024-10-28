import { Component, OnInit } from '@angular/core';
import { DrawerConstant } from 'app/shared/components/custom-drawer/custom-drawer.constant';

@Component({
  selector: 'app-manage-debit-card',
  templateUrl: './manage-debit-card.component.html',
  styleUrls: ['./manage-debit-card.component.scss']
})
export class ManageDebitCardComponent implements OnInit {
  tabs = DrawerConstant.cardMenuTabs;


  constructor() { }

  ngOnInit(): void {
  }

}
