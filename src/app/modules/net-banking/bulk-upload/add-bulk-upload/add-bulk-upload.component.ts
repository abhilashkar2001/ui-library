import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { BulkUploadConstant } from "./bulk.upload.constant";
import { ActivatedRoute, Router } from "@angular/router";
import { BulkUploadServiceService } from "../bulk-upload-service.service";
import { MatDialog } from "@angular/material/dialog";
import { AllInOnePopupComponent } from "app/shared/components/all-in-one-popup/all-in-one-popup.component";
import { SuccessPopupComponent } from "app/shared/components/success-popup/success-popup.component";

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
  auditLogObject = {
    kioskId: 319857,
    kioskSystemCode: "12347",
    kioskSystemName: "Raghul",
    passcode: "$2a$10$32778233278.wzJkTsLLhEahxpy",
    logoutCode: "$2a$10$UCTj/AjY5X4AA2k9bLyl5OdaMAloO.O5bWrty6uPEMpeQo00rbCra",
    kioskSystemEnable: true,
    entityCode: "SN1",
    bankCode: "HSB",
    branchCode: "HS1",
    branchName: "HSB",
    bankName: "hsb",
    kioskStatus: null,
    countryCode: "INR",
    countryTelIsdCode: 91,
    mobileLength: 10,
    oneTimeAuth: "Y",
    recordStatus: "OPEN",
    authStatus: "UNAUTHORIZED",
    created: "2024-02-26 17:45:07",
    createdBy: "PREMCREATOR",
    authBy: null,
    authorizedDate: null,
    lastUpdated: "2024-02-28 10:31:03",
    empId: null,
    lastUpdatedBy: "PREMAPP",
    version: 3,
    contact: [
      {
        contactId: 328182,
        telephone: null,
        mobile: "8778588300",
        mobtCode: "",
        email: null,
        whatsappNo: null,
        waptCode: null,
        alternativeNumber: null,
        altCode: null,
        fax: null,
        residencePhone: null,
        officePhone: null,
        address: [],
      },
    ],
    email: null,
    mobileNo: "8778588300",
    mobtCode: "",
  };
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
  // BulkUploadConstant.staticData;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: BulkUploadServiceService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isEdit = true;
    this.bulkId = this.route.snapshot.params["id"];
    if (this.bulkId != "addNew") {
      this.getTransactionLevelStatus();
    }
  }

  getTransactionLevelStatus() {
    this.api.getLevelApprovalStatus(this.bulkId).subscribe((resp) => {
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
      this.bulkUploadDetails = resp;
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
      if (resp) {
        const obj = {
          excelId: this.bulkId,
          remarks: resp,
          status: this.actionType === "Authorize" ? "APPROVED" : "REJECTED",
        };
        this.api.updateRemark(obj).subscribe((resp) => {
          if (resp?.statusCode === 200) this.openConfirmationPopup();
        });
      }
    });
  }

  openConfirmationPopup() {
    const dialogRef = this.dialog.open(AllInOnePopupComponent, {
      data: {
        remark: true,
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
            if (resp?.statusCode === 200) this.openSuccessDialog(resp);
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
    this.router.navigate(["user/dashboard"]);
  }

  processTransaction(event) {
    this.transactionDetails = event;
  }

  customSaveBulkUpload(event) {
    this.bulkId = event;
    this.router.navigate(["user/dashboard/bulk-upload", event]);
    // this.bulkId = event;
  }
}
