import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
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
  Controller
} from "swiper";
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "environments/environment";

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
  Controller
]);

@Component({
  selector: "app-custom-swiper",
  templateUrl: "./custom-swiper.component.html",
  styleUrls: ["./custom-swiper.component.scss"]
})
export class CustomSwiperComponent implements OnInit {
  @ViewChild("swiperRef", { static: false }) swiperRef?: SwiperComponent;
  @Input() carowselData: any = {};
  dynamicList: any = [];
  @Output() customApplyLoan = new EventEmitter<any>();
  show: boolean | any;
  thumbs: any;
  slides$ = new BehaviorSubject<string[]>([""]);
  protected baseUrl = environment.microServiceURL;
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
  setThumbsSwiper(swiper: any) {
    this.thumbsSwiper = swiper;
  }
  controlledSwiper: any;
  setControlledSwiper(swiper: any) {
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
    1024: { slidesPerView: 4, spaceBetween: 50 }
  };

  slides = Array.from({ length: 5 }).map((index: any) => `Slide ${index + 1}`);
  virtualSlides = Array.from({ length: 600 }).map(
    (index: any) => `Slide ${index + 1}`
  );

  breakPointsToggle: boolean | any;
  breakpointChange() {
    this.breakPointsToggle = !this.breakPointsToggle;
    this.breakpoints = {
      640: { slidesPerView: 2, spaceBetween: 20 },
      768: { slidesPerView: 4, spaceBetween: 40 },
      1024: { slidesPerView: this.breakPointsToggle ? 7 : 5, spaceBetween: 50 }
    };
  }

  moveToSubAccountPage(imagesdata: any) {
    console.log(imagesdata);

    this.router.navigate(["/loan/loan-type"], {
      queryParams: { subClass: imagesdata.basisClass }
    });
    this.customApplyLoan.emit(imagesdata);
  }

  mapUrl(data: any) {
    if (
      data.documents.fileUrl &&
      !data.documents.fileUrl.toLowerCase().includes("https")
    )
      return `${this.baseUrl}${data.documents.fileUrl}`;
    else return `assets/images/Frame 5.svg`;
  }
}
