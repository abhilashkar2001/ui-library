import { Component } from '@angular/core';
import { PendingForApprovalConstant } from './pending-for-approval.constant';
import { Router } from '@angular/router';
import { FilterBy } from 'app/shared/helpers/utils';
import { InternetBankingService } from 'app/shared/services/internet-banking.service';

@Component({
  selector: 'app-pending-for-approval',
  templateUrl: './pending-for-approval.component.html',
  styleUrls: ['./pending-for-approval.component.scss'],
})
export class PendingForApprovalComponent {
  columns: any = PendingForApprovalConstant.PENDING_SUMMARY;
  sort: any;
  size = 5;
  sortOrder: any;
  page = 1;
  pageSize = 5;
  sortValue = '';
  sortDirection = '';
  filterBy: FilterBy | any;
  module: any;
  pendingForApprovalUpdatedData: any;
  staticData: any = {
    data: PendingForApprovalConstant.STATIC_SUMMARY,
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
  ) {}

  CustomGoBack() {
    this.route.navigate(['/user/dashboard']);
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
        this.pendingForApprovalUpdatedData = res;
      });
  }

  editRecord(element: any) {
    console.log(element, '..........');
    this.route.navigate([
      'user/dashboard/fund-transfer/bulk-upload',
      element.element.id,
    ]);
  }
}
