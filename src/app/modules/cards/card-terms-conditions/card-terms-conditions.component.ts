import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { SavingsSubmitDialogComponent } from "app/shared/components/savings-submit-dialog/savings-submit-dialog.component";

@Component({
  selector: "app-card-terms-conditions",
  templateUrl: "./card-terms-conditions.component.html",
  styleUrls: ["./card-terms-conditions.component.scss"],
})
export class CardTermsConditionsComponent implements OnInit {
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Output() onConfirmEvent: EventEmitter<any> = new EventEmitter();

  dialogsaveRef!: MatDialogRef<SavingsSubmitDialogComponent>;
  stepperTitle: any;

  constructor(
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onConfirm() {
    this.dialogsaveRef = this.dialog.open(SavingsSubmitDialogComponent, {
      data: {
        applicationNo: 746764326432,
        flow: "cards",
      },
      width: "885px",
      height: "676px",
      disableClose: true,
      panelClass: "popup-dialog-class",
      backdropClass: "bdrop",
    });
    this.dialogsaveRef.componentInstance.submitClicked.subscribe((result) => {
      this.router.navigate(["/cards"]);
    });
  }

  onBack() {
    this.onBackEvent.emit();
  }
}
