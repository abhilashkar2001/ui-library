import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { CardModel, Cards } from 'app/shared/models/card.model';
import { environment } from 'environments/environment';
import { GetStatementPopupComponent } from '../../get-statement-popup/get-statement-popup.component';
import { MatDialog } from '@angular/material/dialog';
// import { CardModel, Cards } from "app/@core/models/card.model";

@Component({
  selector: 'app-dashboard-card-preview',
  templateUrl: './dashboard-card-preview.component.html',
  styleUrls: ['./dashboard-card-preview.component.scss'],
})
export class DashboardCardPreviewComponent implements OnInit, OnChanges {
  @Input() title!: string;
  @Input() cardList: Cards | any;
  @Input() forexFilter: boolean | any;
  @Output() selectedCard: EventEmitter<any> = new EventEmitter<any>();
  displayCard: CardModel | any;
  currentIndex = 0;
  baseUrl = environment.microServiceURL;
  showDetails: FormControl<boolean> | any = new FormControl<boolean>(false);
  toggleDetails = false;

  constructor(private dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges | any): void {
    if (changes?.cardList.currentValue?.length > 0) {
      this.displayCard = changes?.cardList?.currentValue[0];
      this.selectedCard?.emit(this.displayCard);
    }
  }

  ngOnInit(): void {
    this.showDetails.valueChanges.subscribe((value: any) => {
      this.handleToggleChange(value);
    });
  }

  get transform(): string {
    return `translateX(-${this.currentIndex * 100}%)`;
  }

  handleToggleChange(value: boolean) {
    if (value) {
      this.toggleDetails = true;
    } else {
      this.toggleDetails = false;
    }
  }

  prev() {
    this.currentIndex =
      this.currentIndex > 0 ? this.currentIndex - 1 : this.cardList.length - 1;
    this.displayCard = this.cardList[this.currentIndex];
    this.selectedCard?.emit(this.displayCard);
  }

  next() {
    this.currentIndex =
      this.currentIndex < this.cardList.length - 1 ? this.currentIndex + 1 : 0;
    this.displayCard = this.cardList[this.currentIndex];
    this.selectedCard?.emit(this.displayCard);
  }

  openGetStatement() {
    this.dialog.open(GetStatementPopupComponent, {
      data: {},
      disableClose: true,
      height: 'auto',
      width: '55%',
      panelClass: ['popup-class-approve'],
    });
  }
}
