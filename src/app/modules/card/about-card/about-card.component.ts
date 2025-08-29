import { Component } from '@angular/core';
import { AboutCard } from './about-card.constants';

@Component({
  selector: 'app-about-card',
  templateUrl: './about-card.component.html',
  styleUrls: ['./about-card.component.scss'],
})
export class AboutCardComponent {
  tabs = ['Overview', 'Benefits', 'Features', 'Eligibility', 'Fees & Charges'];
  selectedIndex = 0;

  selectTab(index: number) {
    this.selectedIndex = index;
  }

  getUnderlineTransform() {
    return `translateX(${this.selectedIndex * 100}%)`;
  }
  // overview constants
  overViewTitle = AboutCard.overView[0]?.title;
  overViewDescription = AboutCard.overView[0]?.description;
  overViewCardInfo = AboutCard.overView[0]?.cardInfo;
  overViewKeyHightLights = AboutCard.overView[0]?.keyHighLights;
  // benefits constants
  benefitsTitle = AboutCard.benefits[0]?.title;
  benefitsDescription = AboutCard.benefits[0]?.description;
  benefitsCardInfo = AboutCard.benefits[0]?.cardInfo;
  // features constants
  featuresTitle = AboutCard.features[0]?.title;
  featuresDescription = AboutCard.features[0]?.description;
  featuresBannerInfo = AboutCard.features[0]?.bannerInfo;
  featuresCardTitle = AboutCard.features[0]?.cardTitle;
  featuresCardInfo = AboutCard.features[0]?.cardInfo;
}
