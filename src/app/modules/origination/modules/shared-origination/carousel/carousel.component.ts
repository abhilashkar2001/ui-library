import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { environment } from 'environments/environment';
import SwiperCore, { Navigation } from 'swiper';

SwiperCore.use([Navigation]);

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CarouselComponent implements OnInit, OnChanges {
  @Input() carowselData: any = {};
  @Input() flow: string | any;
  @Output() customApplyLoan = new EventEmitter<any>();
  @Input() businessSuiteName: any = '';
  dynamicList: any = [];
  selectedIndex: number | any;
  swiperConfig: any = {
    spaceBetween: 20,
    breakpoints: {
      768: {
        slidesPerView: 6,
      },
      576: {
        slidesPerView: 0,
      },
    },
  };
  protected baseUrl = environment.microServiceURL;

  ngOnChanges() {
    this.dynamicList = this.carowselData;
    this.alignItems();
  }

  alignItems() {
    if (this.dynamicList?.length > 0) {
      const swiperwrapper: any =
        document.getElementsByClassName('swiper-wrapper')[0];
      if (this.dynamicList?.length <= 5) {
        swiperwrapper.style.justifyContent = 'center';
      } else {
        swiperwrapper.style.justifyContent = 'normal';
      }
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      const nextIcon: any =
        document.getElementsByClassName('swiper-button-next')[0];
      const prevIcon: any =
        document.getElementsByClassName('swiper-button-prev')[0];
      nextIcon.innerHTML = `<img src="assets/images/next_icon.svg" />`;
      prevIcon.innerHTML = `<img src="assets/images/prev_icon.svg" />`;
      this.alignItems();
    }, 200);
  }

  moveToSubAccountPage(basisClass: string) {
    this.customApplyLoan.emit(basisClass);
  }

  getbackgroundImage(data: any) {
    let url = '';
    if (
      data.documents.fileUrl &&
      !data.documents.fileUrl.toLowerCase().includes('https')
    )
      url = `${this.baseUrl}${data.documents.fileUrl}`;
    else url = `assets/images/Frame 5.svg`;

    return { 'background-image': 'url(' + url + ')' };
  }
}
