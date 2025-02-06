import { Component } from '@angular/core';
import { DrawerConstant } from '../../../shared-corporate-banking/custom-drawer/custom-drawer.constant';

@Component({
  selector: 'app-manage-debit-card',
  templateUrl: './manage-debit-card.component.html',
  styleUrls: ['./manage-debit-card.component.scss'],
})
export class ManageDebitCardComponent {
  tabs = DrawerConstant.cardMenuTabs;
}
