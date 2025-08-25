import { Component } from '@angular/core';

@Component({
  selector: 'app-card-catalogue',
  templateUrl: './card-catalogue.component.html',
  styleUrls: ['./card-catalogue.component.scss'],
})
export class CardCatalogueComponent {
  cardTypes = [
    'All Cards',
    'Rewards Cards',
    'Travel Cards',
    'Fuel Cards',
    'Cashback Cards',
    'Premium / Metal Cards',
    'Lifestyle Cards',
    'Corporate Cards',
  ];
  feeRanges = [
    'All Fees',
    'Free ($0)',
    'Low ($1-$99)',
    'Medium ($100-$299)',
    'High ($300+)',
  ];
  variants = ['VISA', 'AMERICAN EXPRESS', 'MasterCard', 'RuPay'];

  cards = [
    {
      title: 'Times Black DTB Bank Credit Card',
      image: 'assets/card1.png',
      benefits: [
        'Luxury stay gift card from EaseMyTrip worth ₹10,000',
        'Travel Visa Benefits with Altas and OneVasco worth ₹10,000',
        'Special Access to The Quorum club with exceptional benefits',
        'Unlimited complimentary access to lounges',
      ],
      joiningFee: '₹20,000 + GST',
      annualFee: '₹20,000 + GST',
    },
    {
      title: 'Emeralde Private Metal Credit Card',
      image: 'assets/card2.png',
      benefits: [
        '1 Complimentary night stay with Epicure Plus Membership',
        'Complimentary EazyDiner Prime Membership every year',
        '12,500 ICICI Bank Reward Points as Joining Bonus and Annual Bonus',
      ],
      joiningFee: '₹12,500 + GST',
      annualFee: '₹12,500 + GST',
    },
  ];
}
