import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FilterBy } from 'app/shared/helpers/utils';
import { BulkUploadServiceService } from './bulk-upload-service.service';
import { BulkUploadConstant } from '../add-bulk-upload/bulk.upload.constant';
import { InternetBankingService } from 'app/shared/services/internet-banking.service';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss'],
})
export class BulkUploadComponent {
  columns: any = BulkUploadConstant.UPLOAD_SUMMARY;
  sort: any;
  size = 5;
  sortOrder: any;
  page = 1;
  pageSize = 5;
  sortValue = '';
  sortDirection = '';
  filterBy: FilterBy | any;
  module: any;
  bulkUploadData: any;
  staticData: any = {
    data: BulkUploadConstant.STATIC_SUMMARY,
    meta: {
      page: 1,
      size: 5,
      totalElements: 562,
      totalPages: 113,
    },
    statusCode: 200,
    status: 'OK',
  };

  constructor(
    private route: Router,
    private bulkService: InternetBankingService,
    private bulkuploadService: BulkUploadServiceService,
  ) {}

  customGoBack() {
    this.route.navigate(['/user/dashboard']);
  }

  navigateToBulkUpload(id: any) {
    this.route.navigate(['user/dashboard/fund-transfer/bulk-upload', id]);
  }

  customEditForm(event: any) {
    console.log(event);

    this.navigateToBulkUpload(event?.element?.id || 'addNew');
  }

  getDataByPage(event: any) {
    this.page = event.page;
    this.pageSize = event.size;
    this.sortDirection = event.direction;
    this.sortValue = event.sort;
    this.filterBy = event.filterBy;
    this.module = event.module;
    this.bulkService
      .getSummary(
        event.filterBy,
        event.page,
        event.size,
        this.sortValue,
        event.direction,
        this.module,
      )
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
