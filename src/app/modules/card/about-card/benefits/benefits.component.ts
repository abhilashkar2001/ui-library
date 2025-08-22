import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-benefits',
  templateUrl: './benefits.component.html',
  styleUrls: ['./benefits.component.scss'],
})
export class BenefitsComponent {
  @Input() title!: any;
  @Input() description!: any;
  @Input() cardInfo!: any;
}
