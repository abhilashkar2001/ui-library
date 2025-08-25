import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-card-landing',
  templateUrl: './card-landing.component.html',
  styleUrls: ['./card-landing.component.scss'],
})
export class CardLandingComponent {
  features = [
    {
      tag: 'Tap and Pay',
      description:
        'Tap and Pay with your Android Phone for PIN-free Debit Card transactions at supported contactless terminals',
    },
    {
      tag: 'Airport Lounge Accesses',
      description:
        'Get up to 2 complimentary airport lounge accesses per quarter on spends of ₹10,000 in the previous quarter',
    },
    {
      tag: 'Travel Assistance',
      description:
        'Zero Fuel surcharge on transactions done on DTB Bank swipe machines at selected',
    },
    {
      tag: '25% off',
      description: 'Get 25% off on select partner restaurants every weekend',
    },
  ];

  @ViewChild('featuresWrapper', { read: ElementRef })
  featuresWrapper!: ElementRef<HTMLDivElement>;

  private autoScrollInterval: any;
  private isPaused = false;

  ngAfterViewInit() {
    this.startAutoScroll();
  }

  ngOnDestroy() {
    this.clearAutoScroll();
  }

  private clearAutoScroll() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = null;
    }
  }

  startAutoScroll() {
    const scrollStep = 1;
    const scrollDelay = 10;

    this.autoScrollInterval = setInterval(() => {
      if (this.isPaused) return;

      const wrapper = this.featuresWrapper.nativeElement;
      const singleSetWidth = wrapper.scrollWidth / 2;

      if (wrapper.scrollLeft >= singleSetWidth) {
        wrapper.scrollLeft = 0; // reset
      } else {
        wrapper.scrollBy({ left: scrollStep, behavior: 'smooth' });
      }

      setTimeout(() => (window as any).AOS?.refresh?.(), 350);
    }, scrollDelay);
  }

  pauseAutoScroll() {
    this.isPaused = true;
  }

  resumeAutoScroll() {
    this.isPaused = false;
  }

  navigateLeft() {
    this.pauseAutoScroll();
    const wrapper = this.featuresWrapper.nativeElement;
    const singleSetWidth = wrapper.scrollWidth / 2;

    if (wrapper.scrollLeft <= 0) {
      wrapper.scrollTo({ left: singleSetWidth, behavior: 'smooth' });
    } else {
      wrapper.scrollBy({ left: -300, behavior: 'smooth' });
    }
    setTimeout(() => (window as any).AOS?.refresh?.(), 350);
  }

  navigateRight() {
    this.pauseAutoScroll();
    const wrapper = this.featuresWrapper.nativeElement;
    const singleSetWidth = wrapper.scrollWidth / 2;

    if (wrapper.scrollLeft + wrapper.clientWidth >= singleSetWidth) {
      wrapper.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      wrapper.scrollBy({ left: 300, behavior: 'smooth' });
    }
    setTimeout(() => (window as any).AOS?.refresh?.(), 350);
  }
}
