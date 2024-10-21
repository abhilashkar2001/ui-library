import { Component, OnInit } from "@angular/core";
import SwiperCore, { Navigation } from "swiper";
// install Swiper modules
SwiperCore.use([Navigation]);

@Component({
  selector: "app-swiper-card",
  templateUrl: "./swiper-card.component.html",
  styleUrls: ["./swiper-card.component.scss"]
})
export class SwiperCardComponent implements OnInit {
  slides = [
    {
      imageUrl: "assets/images/earn-reward.png",
      caption: "Caption Text"
    },

    { imageUrl: "assets/images/slide_img2.png", caption: "Caption Two" },
    { imageUrl: "assets/images/loan.png", caption: "Caption Two" },
    {
      imageUrl: "assets/images/account_addvertize.png",
      caption: "Caption Two"
    }
  ];
  currentIndex = 0;

  constructor() {}

  ngOnInit(): void {
    this.showSlides();
  }

  /**
   * here slide images changes after given time
   */
  showSlides() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    }, 3000);
  }

  /**
   * updating current slide index.
   * @param index
   */
  currentSlide(index: number) {
    this.currentIndex = index;
  }

  get transform(): string {
    return `translateX(-${this.currentIndex * 100}%)`;
  }
}
