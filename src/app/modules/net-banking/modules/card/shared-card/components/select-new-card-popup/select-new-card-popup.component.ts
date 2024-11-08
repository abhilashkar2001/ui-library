import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatLegacyDialogRef as MatDialogRef } from "@angular/material/legacy-dialog";
import { CreditCardStore } from "../../../credit-card/credit-card.store";

@Component({
  selector: "app-select-new-card-popup",
  templateUrl: "./select-new-card-popup.component.html",
  styleUrls: ["./select-new-card-popup.component.scss"],
})
export class SelectNewCardPopupComponent implements OnInit {
  @ViewChild("widgetsContent", { static: true }) widgetsContent: ElementRef;
  cardList = CreditCardStore.cardList;
  currentIndex: number = 0;
  direction: string = ""; // To handle the transition direction
  selectedCard = this.cardList[this.currentIndex];

  constructor(private dialogRef: MatDialogRef<SelectNewCardPopupComponent>) {}

  ngOnInit(): void {}

  close() {
    this.dialogRef.close();
  }

  selectCard(index: number) {
    this.currentIndex = index;
    this.selectedCard = this.cardList[index];
  }

  prev() {
    this.direction = "down";
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.cardList.length - 1;
    }
    this.selectedCard = this.cardList[this.currentIndex];
    this.widgetsContent.nativeElement.scrollTop -= 345;
  }

  next() {
    this.direction = "up";
    if (this.currentIndex < this.cardList.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    this.selectedCard = this.cardList[this.currentIndex];
    this.widgetsContent.nativeElement.scrollTop += 345;
  }

  applyCard() {
    this.dialogRef.close({ upgradeCardDetails: true, card: this.selectedCard });
  }
}
