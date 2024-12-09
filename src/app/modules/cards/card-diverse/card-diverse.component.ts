import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from "@angular/core";
import KeenSlider from "keen-slider";

@Component({
  selector: "app-card-diverse",
  templateUrl: "./card-diverse.component.html",
  styleUrls: ["./card-diverse.component.scss"]
})
export class CardDiverseComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("sliderRef") sliderRef: ElementRef<HTMLElement> | any;
  slider: any;
  interval: any = 0;
  initialCount: number = 0;

  carowselData: any = [
    {
      image: "/assets/images/bluecard.png",
      header: "Debit Card",
      content:
        "Experience the world of Icon Credit Card, a world so delightful, it reflects your vibrant and charming personality. Specifically designed to suit all your lifestyle needs, it offers an array of travel, golf, movie, dining and premium lifestyle privileges that lift you up to an advanced level of luxury and convenience. Apply online for your credit card today."
    },
    {
      image: "/assets/images/shadow-debit-card.png",
      header: "Credit Card",
      content:
        "The borrower submits a loan application to the bank, either in person, online, or through other channels. The application includes personal and financial information, such as income, employment history, credit score, and the purpose of the loan."
    },
    {
      image: "/assets/images/bluecard.png",
      header: "ATM Card",
      content: "ATM Card testing words"
    },
    {
      image: "/assets/images/shadow-debit-card.png",
      header: "Shoping Card",
      content:
        "Shoping Card The borrower submits a loan application to the bank, either in person, online, or through other channels. The application includes personal and financial information, such as income, employment history, credit score, and the purpose of the loan."
    },
    {
      image: "/assets/images/bluecard.png",
      header: "VISA Card",
      content:
        "VISA Card Experience the world of Icon Credit Card, a world so delightful, it reflects your vibrant and charming personality. Specifically designed to suit all your lifestyle needs, it offers an array of travel, golf, movie, dining and premium lifestyle privileges that lift you up to an advanced level of luxury and convenience. Apply online for your credit card today."
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.slider = new KeenSlider(this.sliderRef.nativeElement, {
      loop: true,
      mode: "free",
      slides: {
        origin: "center",
        perView: 2,
        spacing: 10
      },
      vertical: true
    });
  }

  onNext() {
    if (
      this.carowselData &&
      this.carowselData.length - 1 !== this.initialCount
    ) {
      this.initialCount = this.initialCount + 1;
    } else {
      this.initialCount = 0;
    }
    this.slider.next();
  }

  onPrevious() {
    if (this.carowselData && this.initialCount === 0) {
      this.initialCount = this.carowselData.length - 1;
    } else {
      this.initialCount = this.initialCount - 1;
    }
    this.slider.prev();
  }

  ngOnDestroy() {
    if (this.slider) this.slider.destroy();
  }
}
