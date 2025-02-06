import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterBy } from 'app/shared/helpers/utils';
import { bgConstant } from './bg-summary.constant';
import { BgSummaryServiceService } from './bg-summary-service.service';
import { MatDialog } from '@angular/material/dialog';
import { AddNewPopupComponent } from '../../../../shared-corporate-banking/add-new-popup/add-new-popup.component';

@Component({
  selector: 'app-bg-summary',
  templateUrl: './bg-summary.component.html',
  styleUrls: ['./bg-summary.component.scss'],
})
export class BgSummaryComponent implements OnInit {
  maintenanceTitle: string | any;
  columns: any;
  sort: any;
  size = 5;
  sortOrder: any;
  page = 1;
  pageSize = 5;
  sortValue = '';
  sortDirection = '';
  filterBy: FilterBy | any;
  bgData: object | any;
  staticData: any = {
    data: bgConstant.bgStaticData,
    meta: {
      page: 1,
      size: 5,
      totalElements: 562,
      totalPages: 113,
    },
    statusCode: 200,
    status: 'OK',
  };
  isSummary = true;
  componentName: any;
  summaryDetails: any;
  addNewList = bgConstant.ADDNEW_LIST;
  constructor(
    private route: Router,
    private api: BgSummaryServiceService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(() => {
      this.isSummary = true;
      this.getDataByPage({ page: 1, size: 5 });
    });
  }

  CustomGoBack() {
    this.route.navigate([`${this.summaryDetails.backPath}`]);
  }

  getDataByPage(event: any) {
    this.page = event.page;
    this.pageSize = event.size;
    this.sortDirection = event.direction;
    this.sortValue = event.sort;
    this.filterBy = event.filterBy;
    this.api
      .getSummaryDetails(
        event.filterBy,
        event.page,
        event.size,
        this.summaryDetails.summaryUrl,
      )
      .subscribe((res) => {
        this.bgData = res;
      });
  }

  /**
   * add and edit as per action key.
   * @param event
   */
  openPopUp(event: any) {
    const id = event.element.applicantId || event.element;
    if (id === 'addNew') {
      const dialogRef = this.dialog.open(AddNewPopupComponent, {
        width: '50%',
        disableClose: true,
        panelClass: 'popup-class-approve',
      });
      dialogRef.afterClosed().subscribe(() => {
        this.getBGType();
      });
    } else if (id === 'bulk') {
      return;
    } else if (id === 'template') {
      this.openTemplatePopup();
    } else if (id === 'new') {
      this.getBGType();
    } else {
      this.getBGType(event?.element?.bgMasterId);
    }
  }

  /**
   * template popup to select it.
   */
  openTemplatePopup() {
    const dialogRef = this.dialog.open(AddNewPopupComponent, {
      width: '50%',
      disableClose: true,
      panelClass: 'popup-class-approve',
      data: this.summaryDetails,
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.getBGType(res.templateName);
    });
  }

  /**
   * Note: if templateName is avilable then it should be send by params
   * @param id
   */
  getBGType(id?: number) {
    this.route.navigate([`${this.summaryDetails.addNewPath}`], {
      queryParams: { type: '', id },
    });
  }
}
