import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FilterBy } from 'app/shared/helpers/utils';
import { FundTransferService } from '../fund-transfer.service';
import { TokenStorageService } from 'app/shared/token-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { NETBANKING } from '../../../net-banking-dashboard/net-banking-dashboard.constant';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

@Component({
  selector: 'app-fund-transfer-summary',
  templateUrl: './fund-transfer-summary.component.html',
  styleUrls: ['./fund-transfer-summary.component.scss'],
})
export class FundTransferSummaryComponent implements OnInit {
  columns: any = NETBANKING.PENDING_SUMMARY;
  sort: any;
  size = 5;
  sortOrder: any;
  page = 1;
  pageSize = 5;
  sortValue = '';
  sortDirection = '';
  filterBy: FilterBy | any;
  module: any;
  summaryData: any;
  staticData: any = {
    // data: PendingForApprovalConstant.STATIC_SUMMARY,
    meta: {
      page: 1,
      size: 5,
      totalElements: 562,
      totalPages: 113,
    },
    statusCode: 200,
    status: 'OK',
  };
  uploadType: any;
  constructor(
    private router: Router,
    private fundTransferService: FundTransferService,
    private tokenStorageService: TokenStorageService,
    public translate: TranslateService,
    private sessionStorageService: SessionStorageService,
  ) {}

  ngOnInit(): void {
    this.uploadType = this.sessionStorageService.getUploadType();
    setTimeout(() => {
      const lang = this.tokenStorageService.getLanguage() ?? 'en';
      this.translate.use(lang);
    }, 300);
  }

  getDataByPage(event: any) {
    this.page = event.page;
    this.pageSize = event.size;
    this.sortDirection = event.direction;
    this.sortValue = event.sort;
    this.filterBy = event.filterBy;
    this.module = event.module;
    this.fundTransferService
      .getSummary(
        event.filterBy,
        event.page,
        event.size,
        this.module,
        this.uploadType,
      )
      .subscribe((res) => {
        this.summaryData = res;
      });
  }

  editRecord() {
    if (this.uploadType == 'SINGLE')
      this.router.navigate(['user/dashboard/fund-transfer/single']);
  }

  openPopUp(event: any) {
    const id = event.element;
    if (id === 'addNew') {
      if (this.uploadType == 'SINGLE')
        this.router.navigate(['user/dashboard/fund-transfer/single']);
      else this.router.navigate(['user/dashboard/fund-transfer/multi']);
    }
  }

  goToTransfer() {
    this.router.navigate(['user/dashboard/fund-transfer/single']);
  }

  CustomGoBack() {
    this.router.navigate(['/user/dashboard']);
  }
}
