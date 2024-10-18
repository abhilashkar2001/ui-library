import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { CardModel, Cards } from "app/shared/models/card.model";
// import { CardModel, Cards } from "app/@core/models/card.model";

@Component({
  selector: "app-dashboard-card-preview",
  templateUrl: "./dashboard-card-preview.component.html",
  styleUrls: ["./dashboard-card-preview.component.scss"],
})
export class DashboardCardPreviewComponent implements OnInit, OnChanges {
  @Input() title!: string;
  @Input() cardList: Cards;
  @Input("forexFilter") forexFilter: boolean;

  displayCard: CardModel;
  currentIndex: number = 0;

  autoPay: FormControl<boolean> = new FormControl<boolean>(false);

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.cardList.currentValue?.length > 0) {
      this.displayCard = changes?.cardList?.currentValue[0];
    }
  }

  ngOnInit(): void {}

  get transform(): string {
    return `translateX(-${this.currentIndex * 100}%)`;
  }

  prev() {
    this.currentIndex =
      this.currentIndex > 0 ? this.currentIndex - 1 : this.cardList.length - 1;
    this.displayCard = this.cardList[this.currentIndex];
  }

  next() {
    this.currentIndex =
      this.currentIndex < this.cardList.length - 1 ? this.currentIndex + 1 : 0;
    this.displayCard = this.cardList[this.currentIndex];
  }
}
