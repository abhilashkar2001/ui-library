import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { SavingsSubmitDialogComponent } from "app/shared/components/savings-submit-dialog/savings-submit-dialog.component";
import { LoanService } from "app/shared/services/loan/loan.service";
import { environment } from "environments/environment";

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
  @Input() loanSummary;
  endPoints = environment.microServiceURL;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private loanService: LoanService
  ) {}

  ngOnInit(): void {
    // this.getLoanSummary();
    this.loanSummaryDetails = this.loanSummary;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.loanSummaryDetails = changes.loanSummary.currentValue;
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
    this.onConfirmEvent.emit();
  }

  onBack() {
    this.onBackEvent.emit();
  }
  getFileUrl(url) {
    if (url.includes("https")) {
      return "assets/images/account-img1.png";
    } else {
      return `${this.endPoints}${url}`;
    }
  }
}
