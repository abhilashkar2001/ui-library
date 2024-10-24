import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { BulkUploadConstant } from "./bulk.upload.constant";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { AllInOnePopupComponent } from "app/shared/components/all-in-one-popup/all-in-one-popup.component";
import { SuccessPopupComponent } from "app/shared/components/success-popup/success-popup.component";
import { TokenStorageService } from "app/shared/token-storage.service";
import { CommonService } from "app/shared/services/common-service/common.service";
import { CustomSuccessPopupComponent } from "app/shared/components/custom-success-popup/custom-success-popup.component";
import { BulkUploadServiceService } from "../bulk-upload/bulk-upload-service.service";

@Component({
  selector: "app-add-bulk-upload",
  templateUrl: "./add-bulk-upload.component.html",
  styleUrls: ["./add-bulk-upload.component.scss"],
})
export class AddBulkUploadComponent implements OnInit {
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
  // BulkUploadConstant.staticData;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: BulkUploadServiceService,
    private dialog: MatDialog,
    private tokenStorage: TokenStorageService,
    private commonService: CommonService,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.tokenStorage.getUser();
    this.isEdit = true;
    this.bulkId = this.route.snapshot.params["id"];
    if (this.bulkId != "addNew") {
      this.getTransactionLevelStatus();
      // for Demo purpose adding, need to handle from backend
      this.tansactionAction();
    }
  }

  tansactionAction() {
    this.api.getBulkUploadRecords(this.bulkId).subscribe((resp) => {
      const data = resp.data[0].corpFundDetails;
      this.isTransactionActionDone =
        data?.every((item) => item?.uploadstatus === "APPROVED") ||
        data?.every((item) => item?.uploadstatus === "REJECTED");
    });
  }

  getTransactionLevelStatus() {
    this.api
      .getLevelApprovalStatus(this.bulkId, "IcCorpFundTransferMaster")
      .subscribe((resp) => {
        if (resp?.statusCode === 200) {
          this.approvalList = resp.data;
          if (this.approvalList?.length === 1) {
            this.approvalList.push(this.pendingLevel);
          }
        }
      });
  }

  getBulkUploadDetailsById(filter) {
    this.api.getBulkUploadRecords(this.bulkId, filter).subscribe((resp) => {
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
        ids: transaction.id,
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
      .generateOTP(this.tokenStorage.getUser()?.mobile)
      .subscribe((resp: any) => {
        this.otp = resp?.data;

        const dialogRef = this.dialog.open(AllInOnePopupComponent, {
          data: {
            remark: true,
            mobile: this.tokenStorageService.getUser()?.mobile,
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
                        this.actionType === "Authorize"
                          ? "APPROVED"
                          : "REJECTED",
                    };
                    this.api.updateRemark(obj).subscribe((response) => {
                      if (response?.statusCode === 200)
                        // this.openSuccessDialog(resp);
                        this.callSuccessPopup(this.actionType, {
                          ...response?.data,
                          reffNo: resp?.data,
                        });
                    });
                  }
                }
              });
          }
        });
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
    this.router.navigate(["/user/dashboard/fund-transfer/bulk-upload"]);
  }

  processTransaction(event) {
    this.transactionDetails = event;
  }

  customSaveBulkUpload(event) {
    this.commonService
      .generateOTP(this.tokenStorage.getUser()?.mobile)
      .subscribe((resp: any) => {
        this.otp = resp?.data;
        this.callAllInOnePopup(event);
      });
  }

  callAllInOnePopup(event) {
    const dialogRef = this.dialog.open(AllInOnePopupComponent, {
      data: {
        remark: true,
        mobile: this.tokenStorageService.getUser()?.mobile,
      },
      width: "750px",
      disableClose: true,
      panelClass: "popup-dialog-class",
    });
    dialogRef.afterClosed().subscribe((resp) => {
      if (resp) {
        this.api
          .uploadExcel(
            event.formData,
            event.userName,
            event.productType,
            event.corpCustomerId,
            event.processingDatee
          )
          .subscribe((res: any) => {
            if (res?.statusCode === 200) {
              this.callSuccessPopup("success", res?.data);
            } else this.callSuccessPopup("failed");
          });
      }
    });
  }

  callSuccessPopup(res, reffNo?) {
    console.log(res);
    let data;
    data =
      res == "success"
        ? { msg: "Uploaded Successfully", status: true, reffNo: reffNo?.reffNo }
        : res == "failed"
          ? { msg: "Uploaded Failed", status: false }
          : "";
    data =
      res == "Authorize"
        ? {
            msg: "Approved Successfully",
            status: true,
            reffNo: reffNo?.reffNo,
          }
        : res == "Reject"
          ? { msg: "Rejected Successfully", status: "rejected" }
          : data;
    let dialogRef = this.dialog.open(CustomSuccessPopupComponent, {
      data: data,
      width: "40%",
      disableClose: true,
      panelClass: "popup-class",
      backdropClass: "bdrop",
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result == "Done") {
        this.goBack();
      }
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

  DownloadBulkUpload(event) {
    this.api.downloadTemplate().subscribe((blob: any) => {
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "Upload.csv";
      link.click();
    });
  }
}
