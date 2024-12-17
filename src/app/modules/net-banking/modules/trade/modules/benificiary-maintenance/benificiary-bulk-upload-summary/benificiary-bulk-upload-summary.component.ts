import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BeneficiaryBulkUploadConstant } from '../beneficiary-bulk-upload/benificiary-bulk-upload.constant';
import { BeneficiaryService } from '../beneficiary-summary/beneficiary.service';
import { BulkUploadServiceService } from 'app/modules/net-banking/modules/dashboard/modules/fund-transfer/bulk-upload/bulk-upload-service.service';

@Component({
  selector: 'app-benificiary-bulk-upload-summary',
  templateUrl: './benificiary-bulk-upload-summary.component.html',
  styleUrls: ['./benificiary-bulk-upload-summary.component.scss'],
})
export class BenificiaryBulkUploadSummaryComponent {
  columns: any = BeneficiaryBulkUploadConstant.UPLOAD_SUMMARY;
  sort: any;
  size = 5;
  sortOrder: any;
  page = 1;
  pageSize = 5;
  sortValue = '';
  sortDirection = '';
  filterBy: any;
  module: any;
  bulkUploadData: any;
  staticData: any = {
    data: BeneficiaryBulkUploadConstant.STATIC_SUMMARY,
    meta: {
      page: 1,
      size: 5,
      totalElements: 562,
      totalPages: 113,
    },
    statusCode: 200,
    status: 'OK',
  };
  bulkUploadType: any;

  constructor(
    private route: Router,
    private bulkuploadService: BulkUploadServiceService,
    private benificiaryService: BeneficiaryService,
  ) {}

  customGoBack() {
    this.route.navigate(['/user/dashboard']);
  }

  navigateToBulkUpload(id: any) {
    this.route.navigate(['user/dashboard/trade/bulk-upload', id]);
  }

  bulkUpload() {
    this.navigateToBulkUpload('addNew');
  }
  editRecord(element: any) {
    this.navigateToBulkUpload(element.element.refNumber);
  }
  getDataByPage(event: any) {
    this.page = event.page;
    this.pageSize = event.size;
    this.sortDirection = event.direction;
    this.sortValue = event.sort;
    this.filterBy = event.filterBy;
    this.module = event.module;
    this.benificiaryService
      .getSummary(event.filterBy, event.page, event.size)
      .subscribe((res) => {
        this.bulkUploadData = res;
      });
  }

  customDownloadRecord() {
    this.bulkuploadService
      .downloadBulkuploadParentSummary()
      .subscribe((data) => {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const downloadURL = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'report.xlsx';
        link.click();
      });
  }
}
