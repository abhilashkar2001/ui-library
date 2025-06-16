import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ENVIRONMENT, IEnvironment, TokenStorageService } from '@onerumango/utils';
import SwiperCore, { Navigation } from 'swiper';

SwiperCore.use([Navigation]);

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselComponent implements OnInit, OnChanges {
  @Input() carowselData: any = {};
  @Input() flow: string | any;
  @Output() customApplyLoan = new EventEmitter<any>();
  @Input() businessSuiteName: any = '';

  dynamicList: any = [];
  baseUrl: string;
  backgroundStyles: { [key: number]: { 'background-image': string } } = {};

  swiperConfig: any = {
    spaceBetween: 20,
    breakpoints: {
      768: { slidesPerView: 6 },
      576: { slidesPerView: 0 },
    },
  };

  constructor(
    @Inject(ENVIRONMENT) private env: IEnvironment,
    private tokenStorageService: TokenStorageService,
    private cdRef: ChangeDetectorRef,
  ) {
    this.baseUrl = this.env.microServiceURL;
  }

  ngOnInit(): void {
    this.dynamicList = this.carowselData;
    this.computeBackgroundImages();
    setTimeout(() => {
      this.updateSwiperNavigationIcons(); // Set custom icons after Swiper is initialized
    }, 500);
  }

  updateSwiperNavigationIcons(): void {
    const nextIcon = document.querySelector('.swiper-button-next');
    const prevIcon = document.querySelector('.swiper-button-prev');

    if (nextIcon && prevIcon) {
      nextIcon.innerHTML = `<img src="assets/images/next_icon.svg" />`;
      prevIcon.innerHTML = `<img src="assets/images/prev_icon.svg" />`;
    }
  }

  ngOnChanges(): void {
    this.dynamicList = this.carowselData;
    this.computeBackgroundImages();
  }

  computeBackgroundImages(): void {
    this.backgroundStyles = {}; // Reset old values

    this.dynamicList.forEach((data: any, index: number) => {
      if (data?.documents?.fileUrl) {
        let url = data.documents.fileUrl.startsWith('http')
          ? data.documents.fileUrl
          : `${this.baseUrl}${data.documents.fileUrl}`;

        // Convert API image to Blob URL
        this.convertToBlobUrl(url, index);
      } else {
        this.backgroundStyles[index] = {
          'background-image': 'url(assets/images/default_fallback_img.svg)',
        }; // Fallback
        this.cdRef.detectChanges();
      }
    });
  }

  convertToBlobUrl(imageUrl: string, index: number): void {
    // Fetch the Bearer token from localStorage (or another secure storage)
    const authToken = this.tokenStorageService.getToken();

    fetch(imageUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        this.backgroundStyles[index] = {
          'background-image': `url(${blobUrl})`,
        };
        this.cdRef.markForCheck();
      })
      .catch((_error) => {
        this.backgroundStyles[index] = {
          'background-image': 'url(assets/images/Frame 5.svg)',
        };
        this.cdRef.markForCheck();
      });
  }

  moveToSubAccountPage(basisClass: string): void {
    this.customApplyLoan.emit(basisClass);
  }
}
