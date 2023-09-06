import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { SavingsSubmitDialogComponent } from "app/shared/components/savings-submit-dialog/savings-submit-dialog.component";
import { LoanService } from "app/shared/services/loan/loan.service";

@Component({
  selector: "app-loan-summary",
  templateUrl: "./loan-summary.component.html",
  styleUrls: ["./loan-summary.component.scss"],
})
export class LoanSummaryComponent implements OnInit {
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Output() onConfirmEvent: EventEmitter<any> = new EventEmitter();
  dialogsaveRef!: MatDialogRef<SavingsSubmitDialogComponent>;
  stepperTitle: any;
  loanSummaryDetails: any;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private loanService: LoanService
  ) {}

  ngOnInit(): void {
    this.getLoanSummary();
  }

  getLoanSummary() {
    this.loanService.getLoanSummary(12334567).subscribe(
      (response: any) => {
        this.loanSummaryDetails = response.data;
        console.log("Loan Summary Response: ", response);
      },
      (error: any) => {
        console.log("Loan Summary API Failed", error);
      }
    );
  }

  onVerify() {
    this.dialogsaveRef = this.dialog.open(SavingsSubmitDialogComponent, {
      data: {
        applicationNo: 746764326432,
        flow: "loans",
      },
      width: "885px",
      height: "676px",
      disableClose: true,
      panelClass: "popup-dialog-class",
      backdropClass: "bdrop",
    });
    this.dialogsaveRef.componentInstance.submitClicked.subscribe((result) => {
      this.router.navigate(["/"]);
    });
  }

  onBack() {
    this.onBackEvent.emit();
  }
}
