import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card-banner',
  templateUrl: './card-banner.component.html',
  styleUrls: ['./card-banner.component.scss'],
})
export class CardBannerComponent {
  @Input() basisClass!: string;
  @Output() onApplyClick = new EventEmitter<any>();

  features = [
    'BookMyShow and Inox Offer',
    'Spends-based complimentary airport lounge access',
    'Higher reward points',
  ];

  goToCatalogue(e: Event) {
    this.onApplyClick.emit(e);
  }
}
