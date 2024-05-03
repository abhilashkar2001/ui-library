import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { staticBuyerCreditData } from './buyerCreditStaticdata';
import { FilterBy } from 'app/shared/helpers/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BgSummaryServiceService } from '../bg-summary/bg-summary-service.service';

@Component({
  selector: 'app-buyers-credit-summary',
  templateUrl: './buyers-credit-summary.component.html',
  styleUrls: ['./buyers-credit-summary.component.scss']
})
export class BuyersCreditSummaryComponent implements OnInit {
  @Input("bgType") bgType: any = "BuyerCredit";
  columns: any = staticBuyerCreditData.BUYER_CREDIT_SUMMARY;
  isSummary: boolean;
  maintenanceTitle: any;
  module: any;
  sort: any;
  size: number = 5;
  sortOrder: any;
  page: number = 1;
  pageSize: number = 5;
  sortValue = "";
  sortDirection = "";
  filterBy: FilterBy;
  bgData: Object;
  staticData: any = {
    data: staticBuyerCreditData.staticdata,
    meta: {
      page: 1,
      size: 5,
      totalElements: 562,
      totalPages: 113,
    },
    statusCode: 200,
    status: "OK",
  };
  addNewList = staticBuyerCreditData.ADDNEW_LIST;
  summaryDetails: any;
  constructor(
    private route: Router,
    private api: BgSummaryServiceService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.isSummary = true;
      this.bgType = params.get("type");
      this.maintenanceTitle = this.bgType;
      this.module = this.bgType;
    })

  }

  getDataByPage(event) {
    this.getUrl().then((_: any) => {

    })

  }

  getUrl() {
    return new Promise((resolve, reject) => {
      if (this.summaryDetails) resolve("summary details found");
      else {
        this.api.getSummaryUrls().subscribe((resp) => {
          this.summaryDetails = resp.find(
            (e) =>
              e.name.toLowerCase() == this.bgType.toLowerCase()
          )
          resolve("summary details found");
        })
      }
    })
  }

  /**
   * add and edit as per action key.
   * @param event
   */
  openPopUp(event) {
    this.goToBuyerCredit()
  }
  goToBuyerCredit() {
    this.route.navigate([`${this.summaryDetails.addNewPath}`], {
      queryParams: { type: this.summaryDetails.name }
    })
  }
  CustomGoBack(data) {
    this.route.navigate([`${this.summaryDetails.backPath}`]);
  }
}
