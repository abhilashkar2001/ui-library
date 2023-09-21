import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "environments/environment";
import { interval } from "rxjs";

@Component({
  selector: "app-carousel",
  templateUrl: "./carousel.component.html",
  styleUrls: ["./carousel.component.scss"],
})
export class CarouselComponent implements OnInit, OnChanges {
  @Input() carowselData: any = {};
  @Input() flow: string;
  @Output() customApplyLoan = new EventEmitter<any>();
  dynamicList: any = [];
  onLoadImagesLen = 4;
  private autoSlideInterval: any;
  selectedIndex: number;
  totalListCount: number;
  carouselArrowDisplay: boolean = false;
  protected baseUrl = environment.microServiceURL;

  constructor(private router: Router) {}

  ngOnChanges() {
    this.dynamicList = this.carowselData;
    if (this.dynamicList && this.dynamicList.length) {
      this.caroselPayload();
    }
    console.log("Carowsel: ", this.dynamicList);
  }

  ngOnInit(): void {
    console.log("Rest: ", this.carowselData);
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
      this.totalListCount
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
  mapUrl(data) {
    if (
      data.documents.fileUrl &&
      !data.documents.fileUrl.toLowerCase().includes("https")
    )
      return `${this.baseUrl}${data.documents.fileUrl}`;
    else return `assets/images/Frame 5.svg`;
  }
}
