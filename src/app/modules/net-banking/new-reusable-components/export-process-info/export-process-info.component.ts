import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Webhost } from "app/shared/directives/appHost.directive";
import { BehaviorSubject } from "rxjs";
import { tabsClass } from "../../tabs.model";

@Component({
  selector: "app-export-process-info",
  templateUrl: "./export-process-info.component.html",
  styleUrls: ["./export-process-info.component.scss"],
})
export class ExportProcessInfoComponent implements OnInit {
  screen_type = "Pre-shipment Loan Process";
  @Input("componentName") componentName = "";
  tabs: any;
  componentRef: any;
  bgType: any;
  currentStep$: BehaviorSubject<any> = new BehaviorSubject(null);

  @ViewChild(Webhost, { static: true })
  host!: Webhost;
  account$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  tradeDetails: BehaviorSubject<any> = new BehaviorSubject<any>({});
  shareTradeDetails = this.tradeDetails.asObservable();
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.componentName = params.get("type");
      for (const key in tabsClass) {
        if (
          key.replace("_", "").replace(" ", "").toLowerCase() ===
          this.componentName.split(" ").join("").toLowerCase()
        ) {
          this.tabs = tabsClass[key];
          this.bgType = this.tabs[0].type;
          this.componentRef = null;
          this.currentStep$.next(this.tabs[0]);
          this.createComponentView();
        }
      }
    });
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

  updateAccount = (part: Partial<any>, isFormValid: boolean) => {
    const currentAccount = this.account$.value;
    const updatedAccount = { ...currentAccount, ...part };
    this.account$.next(updatedAccount);
    this.isCurrentFormValid$.next(isFormValid);
  };
  navigatetotab(tab) {
    this.trackRecord();
    this.currentStep$.next(tab);
    this.createComponentView();
  }
  trackRecord() {
    this.tradeDetails.next(this.account$.value);
  }
}
