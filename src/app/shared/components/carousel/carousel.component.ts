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
import { interval } from 'rxjs';

// import Swiper core and required modules
import SwiperCore, { Navigation } from 'swiper';
// install Swiper modules
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
  onLoadImagesLen = 4;
  private autoSlideInterval: any;
  selectedIndex: number | any;
  totalListCount: number | any;
  carouselArrowDisplay = false;
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

  caroselPayload() {
    this.selectedIndex = 0;
    this.totalListCount = this.carowselData.length;
    this.addDynamicImages();
    if (this.carowselData.length > 4) {
      this.startAutoSlide();
    } else {
      this.carouselArrowDisplay = true;
    }
  }

  startAutoSlide() {
    this.stopAutoSlide();
    this.autoSlideInterval = interval(5000).subscribe(() => {
      this.nextImage();
    });
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      this.autoSlideInterval.unsubscribe();
    }
  }

  addDynamicImages() {
    this.dynamicList = [];
    const endIndex = Math.min(
      this.selectedIndex + this.onLoadImagesLen,
      this.totalListCount,
    );
    for (let i = this.selectedIndex; i < endIndex; i++) {
      this.dynamicList.push(this.carowselData[i]);
    }
  }

  nextImage() {
    this.selectedIndex = this.selectedIndex + 1;

    if (this.selectedIndex == this.onLoadImagesLen) {
      this.selectedIndex = 0;
    }
    this.addDynamicImages();
  }

  prevImage() {
    this.selectedIndex = this.selectedIndex - 1;
    if (this.selectedIndex == -1) {
      this.selectedIndex = this.onLoadImagesLen - 1;
    }

    this.addDynamicImages();
  }

  moveToSubAccountPage(basisClass: string) {
    this.customApplyLoan.emit(basisClass);
  }
  mapUrl(data: any) {
    if (
      data.documents.fileUrl &&
      !data.documents.fileUrl.toLowerCase().includes('https')
    )
      return `${this.baseUrl}${data.documents.fileUrl}`;
    else return `assets/images/Frame 5.svg`;
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
