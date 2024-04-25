import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { staticRemittanceData } from './remittancestaticdata';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FilterBy } from 'app/shared/helpers/utils';
import { BgSummaryServiceService } from '../bg-summary/bg-summary-service.service';

@Component({
  selector: 'app-remittance-summery',
  templateUrl: './remittance-summery.component.html',
  styleUrls: ['./remittance-summery.component.scss']
})
export class RemittanceSummeryComponent implements OnInit {
  @Input("bgType") bgType: any = "Remittance";
  columns: any = staticRemittanceData.REMITTANCE_SUMMARY;
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
  summaryDetails: any;
  constructor(
      private route: Router,
      private api : BgSummaryServiceService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef) {
    
   }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params)=>{
      this.isSummary = true;
      this.bgType = params.get("type");
      this.maintenanceTitle = this.bgType;
      this.module = this.bgType;
    })

  }

  getDataByPage(event){
    this.getUrl().then((_: any)=>{

    })

  }

  getUrl(){
    return new Promise((resolve , reject)=>{
      if (this.summaryDetails) resolve("summary details found");
      else{
        this.api.getSummaryUrls().subscribe((resp)=>{
          this.summaryDetails = resp.find(
            (e)=>
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
    this.goToRemittance()
  }
  goToRemittance(){
    console.log(this.summaryDetails);
    
    this.route.navigate([`${this.summaryDetails.addNewPath}`],{
      queryParams:{type:this.summaryDetails.name}
    })
  }
  CustomGoBack(data) {
    this.route.navigate([`${this.summaryDetails.backPath}`]);
  }
}
