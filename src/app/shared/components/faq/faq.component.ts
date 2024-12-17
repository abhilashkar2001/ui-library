import { Component } from '@angular/core';
import { FaqConstant } from './faq.constant';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent {
  panelOpenState = false;
  closeOthers = false;
  faqList = FaqConstant.FAQ_LIST;
  isFaqMore = false;
}
