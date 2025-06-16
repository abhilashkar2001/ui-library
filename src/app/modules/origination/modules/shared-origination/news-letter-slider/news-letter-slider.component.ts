import { Component, ViewChild } from '@angular/core';
import { SwiperComponent } from 'swiper/angular';
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper';
import { CLIENT_DESCRIPTION } from 'app/config/news-letter.constant';

// Install Swiper modules
SwiperCore.use([Autoplay, Pagination, Navigation]);

@Component({
  selector: 'app-news-letter-slider',
  templateUrl: './news-letter-slider.component.html',
  styleUrls: ['./news-letter-slider.component.scss'],
})
export class NewsLetterSliderComponent {
  images = CLIENT_DESCRIPTION;

  @ViewChild('swiperRef', { static: false }) swiper?: SwiperComponent;
  paused = false;

  togglePaused(): void {
    if (!this.swiper) return;

    const autoplay = this.swiper.swiperRef.autoplay;
    if (this.paused) {
      autoplay?.start();
    } else {
      autoplay?.stop();
    }

    this.paused = !this.paused;
  }
}
