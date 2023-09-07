import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { SwiperComponent } from "swiper/angular";

// import Swiper core and required components
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller,
} from "swiper";
import { BehaviorSubject } from "rxjs";
import Swiper from "swiper/types/swiper-class";
import { Router } from "@angular/router";

// install Swiper components
SwiperCore.use([
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller,
]);

@Component({
  selector: "app-custom-swiper",
  templateUrl: "./custom-swiper.component.html",
  styleUrls: ["./custom-swiper.component.scss"],
})
export class CustomSwiperComponent implements OnInit {
  @ViewChild("swiperRef", { static: false }) swiperRef?: SwiperComponent;
  @Input() carowselData: any = {};
  dynamicList: any = [];
  @Output() customApplyLoan = new EventEmitter<any>();
  show: boolean;
  thumbs: any;
  slides$ = new BehaviorSubject<string[]>([""]);
  constructor(private router: Router) {}
  ngOnInit() {}
  ngOnChanges() {
    // for (let i = 0; i <= 5; i++) {
    //   this.carowselData.forEach((item) => {
    //     this.dynamicList.push(item);
    //   });
    // }
    this.dynamicList = this.carowselData;

    // if (this.dynamicList && this.dynamicList.length) {
    //   this.caroselPayload();
    // }
    console.log("Carowsel: ", this.dynamicList);
  }

  thumbsSwiper: any;
  setThumbsSwiper(swiper) {
    this.thumbsSwiper = swiper;
  }
  controlledSwiper: any;
  setControlledSwiper(swiper) {
    this.controlledSwiper = swiper;
  }

  indexNumber = 1;
  exampleConfig = { slidesPerView: 3 };
  slidesPerView: number = 4;
  pagination: any = false;

  togglePagination() {
    if (!this.pagination) {
      this.pagination = { type: "fraction" };
    } else {
      this.pagination = false;
    }
  }

  navigation = false;
  toggleNavigation() {
    this.navigation = !this.navigation;
  }

  scrollbar: any = false;
  // toggleScrollbar() {
  //   if (!this.scrollbar) {
  //     this.scrollbar = { draggable: true };
  //   } else {
  //     this.scrollbar = false;
  //   }
  // }
  breakpoints = {
    640: { slidesPerView: 2, spaceBetween: 20 },
    768: { slidesPerView: 4, spaceBetween: 40 },
    1024: { slidesPerView: 4, spaceBetween: 50 },
  };

  slides = Array.from({ length: 5 }).map((el, index) => `Slide ${index + 1}`);
  virtualSlides = Array.from({ length: 600 }).map(
    (el, index) => `Slide ${index + 1}`
  );

  breakPointsToggle: boolean;
  breakpointChange() {
    this.breakPointsToggle = !this.breakPointsToggle;
    this.breakpoints = {
      640: { slidesPerView: 2, spaceBetween: 20 },
      768: { slidesPerView: 4, spaceBetween: 40 },
      1024: { slidesPerView: this.breakPointsToggle ? 7 : 5, spaceBetween: 50 },
    };
  }

  moveToSubAccountPage(imagesdata) {
    console.log(imagesdata);

    this.router.navigate(["/loan/loan-type"], {
      queryParams: { subClass: imagesdata.basisClass },
    });
    this.customApplyLoan.emit(imagesdata);
  }
}
