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
import { ImageDialogComponent } from "app/shared/components/image-dialog/image-dialog.component";
import { SavingsSubmitDialogComponent } from "app/shared/components/savings-submit-dialog/savings-submit-dialog.component";
import { LoanService } from "app/shared/services/loan/loan.service";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";
import { TokenStorageService } from "app/shared/token-storage.service";
import { environment } from "environments/environment";

@Component({
  selector: "app-loan-summary",
  templateUrl: "./loan-summary.component.html",
  styleUrls: ["./loan-summary.component.scss"],
})
export class LoanSummaryComponent implements OnInit {
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Output() onCustomSubmit: EventEmitter<any> = new EventEmitter();
  dialogsaveRef!: MatDialogRef<SavingsSubmitDialogComponent>;
  @Input("updateParentModel") updateParentModel: (value: Partial<any>) => void;
  stepperTitle: any;
  loanSummaryDetails: any;
  @Input() loanSummary;
  endPoints = environment.microServiceURL;
  currencySymboll = "₹";
  otherUserInfo: any;
  personalDetails: any;
  checkListDoc: any[] = [];

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private loanService: LoanService,
    private openAccountService: OpenAccountService,
    private tokenStore: TokenStorageService
  ) {}

  ngOnInit(): void {
    // this.getLoanSummary();
    this.otherUserInfo = this.tokenStore.getUserOtherInfo();
    // this.loanSummaryDetails = this.loanSummary;
    this.getLoanSummary().then((resp) => {
      this.getOriginationMasterData();
      this.getCheckListDoc();
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.loanSummaryDetails = changes.loanSummary.currentValue;
  }
  getCheckListDoc() {
    var originationId = sessionStorage.getItem("originationId");
    this.loanService.getSavedChecklist(originationId).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        this.checkListDoc = resp.data;
      }
    });
  }

  getLoanSummary() {
    return new Promise((resolve, reject) => {
      var originationId = sessionStorage.getItem("originationId");
      this.loanService
        .getLoanSummary(originationId)
        .subscribe((response: any) => {
          this.loanSummaryDetails = response.data;
          resolve("");
        });
    });
  }

  getOriginationMasterData() {
    var originationId = sessionStorage.getItem("originationId");
    this.loanService
      .getOriginationMaster(originationId)
      .subscribe((resp: any) => {
        if (resp?.statusCode == 200 && resp?.data) {
          this.personalDetails = resp?.data?.[0]?.customerInfo;
        }
      });
  }

  onVerify() {
    this.updateParentModel({ updateMasterSave: false });
    this.onCustomSubmit.emit();
    this.openAccountService.setData(this.loanSummaryDetails);
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

  checkDisbursementType() {
    if (
      this.loanSummaryDetails?.disbursementDetails?.disbursementType != null &&
      this.loanSummaryDetails?.disbursementDetails?.disbursementType
        ?.toLowerCase()
        ?.includes("account")
    )
      return true;
    else return false;
  }

  viewFiles(imageUrl: any, imageName: any): void {
    console.log(imageName);
    const dialogRef = this.dialog.open(ImageDialogComponent, {
      data: {
        imageUrl,
        imageName: imageName.fileName,
      },
      width: "900px",
      height: "560px",
      panelClass: "imageViewDialog",
    });
  }
}
