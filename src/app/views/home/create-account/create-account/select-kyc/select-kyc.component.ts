import { Location } from "@angular/common";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { SavingsSubmitDialogComponent } from "app/shared/components/savings-submit-dialog/savings-submit-dialog.component";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";

@Component({
  selector: "app-select-kyc",
  templateUrl: "./select-kyc.component.html",
  styleUrls: ["./select-kyc.component.scss"],
})
export class SelectKycComponent implements OnInit {
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  showKyc: boolean = true;
  dialogsaveRef!: MatDialogRef<SavingsSubmitDialogComponent>;
  accountHeader: string;

  constructor(
    private _location: Location,
    private dialog: MatDialog,
    private activateRoute: ActivatedRoute,
    private apiService: OpenAccountService
  ) {
    this.accountHeader = this.activateRoute.snapshot["queryParams"]["title"];
  }

  ngOnInit(): void {}

  onVerify(event = null) {
    this.dialogsaveRef = this.dialog.open(SavingsSubmitDialogComponent, {
      data: {
        applicationNo: 746764326432,
      },
      width: "885px",
      height: "676px",
      disableClose: true,
      panelClass: "popup-dialog-class",
      backdropClass: "bdrop",
    });
    this.dialogsaveRef.componentInstance.submitClicked.subscribe((result) => {
      //this.goBack();
    });
    // this.router.navigate([''])
  }

  onBack() {
    this.onBackEvent.emit();
  }

  onSubmit(event: any) {
    this.apiService.uploadMultipleDocument(event).subscribe((resp: any) => {
      console.log(resp);
      this.onVerify();
    });
  }
  customSaveDocuments(e) {
    var docIds = [];
    e.documentDetails.otherDocument.forEach((element) => {
      const docId = {
        docIds: element.docIds,
      };
      docIds.push(docId);
    });

    var payload = {
      customerId: parseInt(localStorage.getItem("customerId")),
      documentInfo: docIds,
    };
    this.apiService.uploadMultipleDocument(payload).subscribe((resp) => {
      if (resp?.statusCode === 200) {
      }
    });
    console.log(docIds);
  }
}
