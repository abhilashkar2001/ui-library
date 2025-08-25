import { Component } from '@angular/core';

@Component({
  selector: 'app-card-landing',
  templateUrl: './card-landing.component.html',
  styleUrls: ['./card-landing.component.scss'],
})
export class CardLandingComponent {
  features = [
    {
      tag: 'Tap and Pay',
      description:
        'Tap and Pay with your Android Phone for PIN-free Debit Card transactions at supported contactless terminals',
    },
    {
      tag: 'Airport Lounge Accesses',
      description:
        'Get up to 2 complimentary airport lounge accesses per quarter on spends of ₹10,000 in the previous quarter',
    },
    {
      tag: 'Travel Assistance',
      description:
        'Zero Fuel surcharge on transactions done on DTB Bank swipe machines at selected',
    },
    {
      tag: '25% off',
      description: 'Get 25% off on select partner restaurants every weekend',
    },
  ];
}
