import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
})
export class FeaturesComponent {
  @Input() title!: any;
  @Input() description!: any;
  @Input() bannerInfo!: any;
  @Input() cardTitle!: any;
  @Input() cardInfo!: any;
}
