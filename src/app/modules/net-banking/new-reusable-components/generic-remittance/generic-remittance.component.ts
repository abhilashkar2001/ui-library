import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Webhost } from 'app/shared/directives/appHost.directive';
import { BehaviorSubject } from 'rxjs';
import { tabsClass } from "app/modules/net-banking/tabs.model";

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
  bgType: any;
  constructor(  private route: ActivatedRoute,
    private dialog: MatDialog,) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params)=>{
      this.componentName = params.get("type");
      for (const key in tabsClass){
        if (
          key.replace("_", "").replace(" ", "").toLowerCase() ===
          this.componentName.split(" ").join("").toLowerCase()
        ){
          this.tabs = tabsClass[key];
          this.bgType = this.tabs[0].type;
          this.componentRef = null;
          this.currentStep$.next(this.tabs[0]);
          this.createComponentView()
        }
      }
    })
  }

  createComponentView() {
    const view = this.host.viewContainerRef;
    view.clear();
    if (this.currentStep$.value?.componrnt) {
      this.componentRef = view.createComponent(
        this.currentStep$.value.componrnt
      );
      this.componentRef.instance.bgType = this.bgType;
      this.currentStep$.subscribe((resp) => {
        if (resp?.isHideFilter) {
          this.componentRef.instance.isHideFilter = resp.isHideFilter;
          this.componentRef.instance.isHideButton = resp.isHideButton;
          this.componentRef.instance.screenName = resp.title;
        }
      });

      this.shareTradeDetails.subscribe((resp) => {
        this.componentRef.instance.tradeDetails = resp;
      });
      this.componentRef.instance.updateParentModel = this.updateAccount;
      this.componentRef.instance.amendmentType = this.currentStep$.value?.type;
    }
  }
  navigatetotab(tab) {
    this.trackRecord();
    this.currentStep$.next(tab);
    this.createComponentView();
  }
  trackRecord() {
    this.tradeDetails.next(this.account$.value);
  }

  updateAccount = (part: Partial<any>, isFormValid: boolean) => {
    const currentAccount = this.account$.value;
    const updatedAccount = { ...currentAccount, ...part };
    this.account$.next(updatedAccount);
    this.isCurrentFormValid$.next(isFormValid);
  };

  saveTemplet(event) {
    
  }
  updateRecord(event) {
    console.log(event, "........");
  }

}
