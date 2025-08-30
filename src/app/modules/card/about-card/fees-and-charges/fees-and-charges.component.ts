import { Component } from '@angular/core';
import { AboutCard } from 'app/modules/card/about-card/about-card.constants';

@Component({
  selector: 'app-fees-and-charges',
  templateUrl: './fees-and-charges.component.html',
  styleUrls: ['./fees-and-charges.component.scss'],
})
export class FeesAndChargesComponent {
  feeConfig = AboutCard.FEE_CONFIG;
  feesAndChargeData = AboutCard.FEES_AND_CHARGES_DATA;
  cardData = AboutCard.CARD_DATA;
}
