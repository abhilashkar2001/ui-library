import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { BulkUploadConstant } from "app/modules/net-banking/bulk-upload/add-bulk-upload/bulk.upload.constant";
import { BulkUploadServiceService } from "app/modules/net-banking/bulk-upload/bulk-upload-service.service";
import { AllInOnePopupComponent } from "app/shared/components/all-in-one-popup/all-in-one-popup.component";
import { SuccessPopupComponent } from "app/shared/components/success-popup/success-popup.component";
import { CommonService } from "app/shared/services/common-service/common.service";
import { TokenStorageService } from "app/shared/token-storage.service";
import { BeneficiaryService } from "../beneficiary.service";

@Component({
  selector: "app-beneficiary-bulk-upload",
  templateUrl: "./beneficiary-bulk-upload.component.html",
  styleUrls: ["./beneficiary-bulk-upload.component.scss"],
})
export class BeneficiaryBulkUploadComponent implements OnInit {
  public approvalForm: FormGroup;
  isEdit = false;

  approvalList = [];

  columns = BulkUploadConstant.GENERIC_COLUMNS;
  staticData = {
    data: BulkUploadConstant.staticData,
    meta: {
      page: 1,
      size: 5,
      totalElements: 562,
      totalPages: 113,
    },
    statusCode: 200,
    status: "OK",
  };
  auditLogObject: any = {};
  bulkId: any;
  transactionDetails: any;
  templateFileList: any = [];
  bulkUploadDetails: any;
  page: any;
  pageSize: any;
  filterBy: any;

  pendingLevel = {
    action: "PENDING",
    userDetais: {},
  };
  actionType: any;
  transactionIds: any[] = [];
  currentUser: any;
  otp: any;
  referenceNo: any;
  remarks: string = "";
  isTransactionActionDone: boolean = false;
  bulkUploadType: any = "Bulk Upload";
  // BulkUploadConstant.staticData;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: BulkUploadServiceService,
    private dialog: MatDialog,
    private tokenStorage: TokenStorageService,
    private commonService: CommonService,
    private benificiaryService: BeneficiaryService
  ) {}

  ngOnInit(): void {
    console.log();
    this.currentUser = this.tokenStorage.getUser();
    this.isEdit = true;
    this.referenceNo = this.route.snapshot.params["id"];
    console.log(this.referenceNo, "this.bulkId");
    if (this.bulkId != "addNew") {
      // this.getTransactionLevelStatus();
      // this.tansactionAction();
    }
  }

  // tansactionAction() {
  //   this.api.getBulkUploadRecords(this.bulkId).subscribe((resp) => {
  //     const data = resp.data[0].corpFundDetails;
  //     this.isTransactionActionDone =
  //       data.every((item) => item.uploadstatus === "APPROVED") ||
  //       data.every((item) => item.uploadstatus === "REJECTED");
  //   });
  // }

  // getTransactionLevelStatus() {
  //   this.api.getLevelApprovalStatus(this.bulkId).subscribe((resp) => {
  //     if (resp?.statusCode === 200) {
  //       this.approvalList = resp.data;
  //       if (this.approvalList?.length === 1) {
  //         this.approvalList.push(this.pendingLevel);
  //       }
  //     }
  //   });
  // }

  getBulkUploadDetailsById(filter) {
    this.benificiaryService
      .getBulkUploadRecords(this.referenceNo, filter)
      .subscribe((resp) => {
        if (resp?.statusCode === 200) {
          this.bulkUploadDetails = resp;
          this.auditLogObject = resp.data[0];
        }
      });
  }

  getDataByPage(filters) {
    this.page = filters?.page || 1;
    this.pageSize = filters?.size || 5;
    this.filterBy = filters.filterBy;
    this.getBulkUploadDetailsById(filters);
  }

  customUpdateRecord(event) {
    console.log(event, "button action", this.transactionDetails);
    this.actionType = event.operation;
    this.transactionIds = [];
    this.transactionDetails.forEach((transaction) => {
      this.transactionIds.push({
        ids: transaction.multiJournalId,
        status: event.operation === "Authorize" ? "APPROVED" : "REJECTED",
      });
    });

    this.openRemark();
  }

  openRemark() {
    const dialogRef = this.dialog.open(AllInOnePopupComponent, {
      data: {
        recordStatus: "Approved",
      },
      width: "750px",
      disableClose: true,
      panelClass: "popup-dialog-class",
    });
    dialogRef.afterClosed().subscribe((resp) => {
      this.remarks = resp;
      if (resp) this.openConfirmationPopup();
    });
  }

  openConfirmationPopup() {
    this.commonService
      .generateOTP(this.currentUser.mobile)
      .subscribe((resp: any) => {
        this.otp = resp?.data;
      });
    const dialogRef = this.dialog.open(AllInOnePopupComponent, {
      data: {
        remark: true,
        mobile: this.currentUser.mobile,
      },
      width: "750px",
      disableClose: true,
      panelClass: "popup-dialog-class",
    });
    dialogRef.afterClosed().subscribe((resp) => {
      if (resp) {
        this.api
          .processBulkTransaction(this.transactionIds)
          .subscribe((resp) => {
            if (resp?.statusCode === 200) {
              if (resp) {
                const obj = {
                  excelId: this.bulkId,
                  remarks: this.remarks,
                  status:
                    this.actionType === "Authorize" ? "APPROVED" : "REJECTED",
                };
                this.api.updateRemark(obj).subscribe((response) => {
                  if (response?.statusCode === 200)
                    this.openSuccessDialog(resp);
                });
              }
            }
          });
      }
    });
  }

  openSuccessDialog(resp) {
    const dialogRefrence = this.dialog.open(SuccessPopupComponent, {
      data: {
        // referenceNo: this.data.referenceNo,
        isNetBanking: true,
        actionType: this.actionType,
        refrenceNo: resp.data,
        route: "pending-for-approval",
      },
      width: "750px",
      disableClose: true,
      panelClass: "popup-dialog-class",
      backdropClass: "bdrop",
    });
    dialogRefrence.afterClosed().subscribe((res) => {
      console.log("........");
    });
  }

  goBack() {
    console.log("/////////");
    this.router.navigate(["user/dashboard/trade/bulk-upload"]);
  }

  processTransaction(event) {
    this.transactionDetails = event;
  }

  customSaveBulkUpload(event) {
    this.commonService
      .generateOTP(this.currentUser.mobile)
      .subscribe((resp: any) => {
        this.otp = resp?.data;
        this.callAllInOnePopup(event);
      });
  }

  callAllInOnePopup(event) {
    const dialogRef = this.dialog.open(AllInOnePopupComponent, {
      data: {
        remark: true,
        mobile: this.currentUser.mobile,
      },
      width: "750px",
      disableClose: true,
      panelClass: "popup-dialog-class",
    });
    dialogRef.afterClosed().subscribe((resp) => {
      if (resp) {
        this.benificiaryService
          .uploadBenificiaryExcel(event.formData)
          .subscribe((res: any) => {
            if (res?.statusCode === 200) {
              this.callSuccessPopup(res);
            }
          });
      }
    });
  }

  callSuccessPopup(res) {
    const dialogRef = this.dialog.open(SuccessPopupComponent, {
      data: {
        refrenceNo: res?.data?.reffNo,
        isNetBanking: true,
        route: "trade/bulk-upload",
      },
      width: "750px",
      disableClose: true,
      panelClass: "popup-dialog-class",
      backdropClass: "bdrop",
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.bulkId = res?.data?.id;
      this.referenceNo = res?.data?.reffNo;
      this.router.navigate(["user/dashboard/trade/bulk-upload", this.bulkId]);
    });
  }

  DownloadBulkUpload(event) {
    this.benificiaryService
      .downloadBenificiaryTemplate()
      .subscribe((blob: any) => {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "Upload.csv";
        link.click();
      });
  }

  downloadRecord() {
    console.log("..........");
    this.api.downloadBulkUpload(this.bulkId).subscribe((data) => {
      let blob = new Blob([data], { type: "application/octet-stream" });

      var downloadURL = window.URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = downloadURL;
      link.download = "report.xlsx";
      link.click();
    });
  }
}
