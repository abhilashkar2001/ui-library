import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Webhost } from 'app/shared/directives/appHost.directive';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-generic-remittance',
  templateUrl: './generic-remittance.component.html',
  styleUrls: ['./generic-remittance.component.scss']
})
export class GenericRemittanceComponent implements OnInit {
  @Input("componentName") componentName = "";
  tabs: any;
  account$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  tradeDetails: BehaviorSubject<any> = new BehaviorSubject<any>({});
  shareTradeDetails = this.tradeDetails.asObservable();
  currentStep$: BehaviorSubject<any> = new BehaviorSubject(null);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  @ViewChild(Webhost, { static: true })
  host!: Webhost;
  componentRef: any;
  screen_type:"Remittance";
  constructor(  private route: ActivatedRoute,
    private dialog: MatDialog,) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params)=>{
      this.componentName = params.get("type");

    })
  }

  saveTemplet(event) {
    // const dialogRef = this.dialog.open(AddNewPopupComponent, {
    //   data: {
    //     isSaveTemplate: true,
    //   },
    //   width: "750px",
    //   disableClose: true,
    //   panelClass: "popup-dialog-class",
    // });
    // dialogRef.afterClosed().subscribe((resp) => {
    //   this.saveTemplate(resp.templateName);
    // });
  }
  updateRecord(event) {
    console.log(event, "........");
  }

}
