import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { staticRemittanceData } from './remittancestaticdata';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FilterBy } from 'app/shared/helpers/utils';

@Component({
  selector: 'app-remittance-summery',
  templateUrl: './remittance-summery.component.html',
  styleUrls: ['./remittance-summery.component.scss']
})
export class RemittanceSummeryComponent implements OnInit {
  @Input("bgType") bgType: any = "Remittance";
  columns: any;
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
    data: staticRemittanceData.staticdata,
    meta: {
      page: 1,
      size: 5,
      totalElements: 562,
      totalPages: 113,
    },
    statusCode: 200,
    status: "OK",
  };
  addNewList = staticRemittanceData.ADDNEW_LIST;
  constructor(private summeryClm: staticRemittanceData,
      private route: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef) {
    
   }

  ngOnInit(): void {
    this.columns = this.summeryClm.REMITTANCE_SUMMARY;
    this.activatedRoute.queryParamMap.subscribe((params)=>{
      this.isSummary = true;
      this.bgType = params.get("type");
      this.maintenanceTitle = this.bgType;
      this.module = this.bgType;
    })

  }

  getDataByPage(event){

  }
  
  /**
   * add and edit as per action key.
   * @param event
   */
  openPopUp(event) {
    // const id = event.element.applicantId || event.element;
    // if (id === "addNew") {
    //   const dialogRef = this.dialog.open(AddNewPopupComponent, {
    //     width: "50%",
    //     disableClose: true,
    //     panelClass: "dialog-class",
    //   });
    //   dialogRef.afterClosed().subscribe((res) => {
    //     this.getBGType();
    //   });
    // } else if (id === "bulk") {
    // } else if (id === "template") {
    //   this.openTemplatePopup();
    // } else if (id === "new") {
    //   this.getBGType();
    // } else {
    //   console.log("having a id");
    // }
  }
  CustomGoBack(data) {
    // this.route.navigate([`${this.summaryDetails.backPath}`]);
  }
}
