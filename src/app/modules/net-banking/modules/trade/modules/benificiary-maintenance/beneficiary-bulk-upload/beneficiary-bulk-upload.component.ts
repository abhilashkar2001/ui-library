import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SuccessPopupComponent } from 'app/shared/components/success-popup/success-popup.component';
import { CommonService } from 'app/shared/services/common-service/common.service';
import { BeneficiaryService } from '../beneficiary-summary/beneficiary.service';
import { BulkUploadConstant } from 'app/modules/net-banking/modules/dashboard/modules/fund-transfer/add-bulk-upload/bulk.upload.constant';
import { BulkUploadServiceService } from 'app/modules/net-banking/modules/dashboard/modules/fund-transfer/bulk-upload/bulk-upload-service.service';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { selectUser } from '@onerumango/utils';
import { Observable, Subscription } from 'rxjs';
import { User } from '@onerumango/utils';
import { AllInOnePopupComponent } from '../../../../shared-corporate-banking/all-in-one-popup/all-in-one-popup.component';
import { CustomSuccessPopupComponent } from '../../../../shared-corporate-banking/custom-success-popup/custom-success-popup.component';

@Component({
  selector: 'app-beneficiary-bulk-upload',
  templateUrl: './beneficiary-bulk-upload.component.html',
  styleUrls: ['./beneficiary-bulk-upload.component.scss'],
})
export class BeneficiaryBulkUploadComponent implements OnInit, OnDestroy {
  isEdit = false;

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
    status: 'OK',
  };
  auditLogObject: any = {};
  bulkId: any;
  transactionDetails: any;
  bulkUploadDetails: any;
  page: any;
  pageSize: any;
  filterBy: any;

  actionType: any;
  transactionIds: any[] = [];
  currentUser: any;
  otp: any;
  referenceNo: any;
  remarks = '';
  userProfile$: Observable<User | null>;
  subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: BulkUploadServiceService,
    private dialog: MatDialog,
    private commonService: CommonService,
    private benificiaryService: BeneficiaryService,
    private store: Store,
  ) {
    this.userProfile$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.isEdit = true;
    this.referenceNo = this.route.snapshot.params['id'];
  }

  loadUserProfile() {
    const loadUserProfileSub = this.userProfile$.subscribe((result) => {
      if (result) {
        this.currentUser = result;
      }
    });
    this.subscriptions.push(loadUserProfileSub);
  }

  getBulkUploadDetailsById(filter: any) {
    this.benificiaryService
      .getBulkUploadRecords(this.referenceNo, filter)
      .subscribe((resp) => {
        if (resp?.statusCode === 200) {
          this.bulkUploadDetails = resp;
          this.auditLogObject = resp.data[0];
        }
      });
  }

  getDataByPage(filters: any) {
    this.page = filters?.page || 1;
    this.pageSize = filters?.size || 5;
    this.filterBy = filters.filterBy;
    this.getBulkUploadDetailsById(filters);
  }

  openRemark() {
    const dialogRef = this.dialog.open(AllInOnePopupComponent, {
      data: {
        recordStatus: 'Approved',
      },
      width: '750px',
      disableClose: true,
      panelClass: 'popup-dialog-class',
    });
    dialogRef.afterClosed().subscribe((resp) => {
      this.remarks = resp;
      if (resp) this.openConfirmationPopup();
    });
  }

  openConfirmationPopup() {
    this.commonService
      .generateOTP(this.currentUser?.mobile)
      .subscribe((resp: any) => {
        this.otp = resp?.data;
      });
    const dialogRef = this.dialog.open(AllInOnePopupComponent, {
      data: {
        remark: true,
        mobile: this.currentUser?.mobile,
      },
      width: '750px',
      disableClose: true,
      panelClass: 'popup-dialog-class',
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
                    this.actionType === 'Authorize' ? 'APPROVED' : 'REJECTED',
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

  openSuccessDialog(resp: any) {
    this.dialog.open(SuccessPopupComponent, {
      data: {
        // referenceNo: this.data.referenceNo,
        isNetBanking: true,
        actionType: this.actionType,
        refrenceNo: resp.data,
        route: 'pending-for-approval',
      },
      width: '750px',
      disableClose: true,
      panelClass: 'popup-dialog-class',
      backdropClass: 'bdrop',
    });
  }

  goBack() {
    console.log('/////////');
    this.router.navigate(['/user/trade/beneficiary']);
  }

  customSaveBulkUpload(event: any) {
    this.commonService
      .generateOTP(this.currentUser?.mobile)
      .subscribe((resp: any) => {
        this.otp = resp?.data;
        this.callAllInOnePopup(event);
      });
  }

  callAllInOnePopup(event: any) {
    const dialogRef = this.dialog.open(AllInOnePopupComponent, {
      data: {
        remark: true,
        mobile: this.currentUser.mobile,
      },
      width: '750px',
      disableClose: true,
      panelClass: 'popup-dialog-class',
    });
    dialogRef.afterClosed().subscribe((resp) => {
      if (resp) {
        this.benificiaryService
          .uploadBenificiaryExcel(event.formData)
          .subscribe((res: any) => {
            if (res?.statusCode === 200) {
              this.callSuccessPopup('success', res?.data);
            } else this.callSuccessPopup('failed');
          });
      }
    });
  }

  callSuccessPopup(res: any, reffNo?: any) {
    const data =
      res == 'success'
        ? { msg: 'Uploaded Successfully', status: true, reffNo: reffNo?.reffNo }
        : { msg: 'Uploaded Failed', status: false };
    const dialogRef = this.dialog.open(CustomSuccessPopupComponent, {
      data: data,
      width: '40%',
      disableClose: true,
      panelClass: 'popup-class',
      backdropClass: 'bdrop',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result == 'Done') {
        this.goBack();
      }
    });
  }

  DownloadBulkUpload() {
    this.benificiaryService
      .downloadBenificiaryTemplate()
      .subscribe((blob: any) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'Upload.csv';
        link.click();
      });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscribe) => subscribe.unsubscribe());
  }
}
