import { Component, OnInit, ViewChild } from '@angular/core';
import { tabsClass } from 'app/modules/net-banking/tabs.model';
import { Webhost } from 'app/shared/directives/appHost.directive';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-generic-bg-component',
  templateUrl: './generic-bg-component.component.html',
  styleUrls: ['./generic-bg-component.component.scss']
})
export class GenericBgComponentComponent implements OnInit {
  tabs:any 
  account$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  currentStep$: BehaviorSubject<any> = new BehaviorSubject(null);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  @ViewChild(Webhost, { static: true })
  host!: Webhost;
  componentRef: any;
  bgType:any
  constructor() {this.tabs = tabsClass.Bg_Issuance;
  this.bgType = this.tabs[0].type }

  ngOnInit(): void {
    this.componentRef = null;
    this.currentStep$.next(this.tabs[0]);
    this.createComponentView()
  }
  createComponentView(){
    const view = this.host.viewContainerRef;
    view.clear();
    if(this.currentStep$.value?.componrnt){
     this.componentRef =  view.createComponent(
      this.currentStep$.value.componrnt
     )
     this.componentRef.instance.updateParentModel = this.updateAccount;
     this.componentRef.instance.amendmentType = this.currentStep$.value?.type;
    }
  }
  navigatetotab(tab){
    this.currentStep$.next(tab);
    this.createComponentView();
  }
  
  updateAccount = (
    part: Partial<any>,
    isFormValid: boolean,
  ) => {
    const currentAccount = this.account$.value;
    const updatedAccount = { ...currentAccount, ...part };
    this.account$.next(updatedAccount);
    this.isCurrentFormValid$.next(isFormValid);
  };

}
