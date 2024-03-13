import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { tabsClass } from "app/modules/net-banking/tabs.model";
import { AddNewPopupComponent } from "app/shared/components/add-new-popup/add-new-popup.component";
import { Webhost } from "app/shared/directives/appHost.directive";
import { BehaviorSubject } from "rxjs";
import { GenericBgServiceService } from "./generic-bg-service.service";

@Component({
  selector: "app-generic-bg-component",
  templateUrl: "./generic-bg-component.component.html",
  styleUrls: ["./generic-bg-component.component.scss"],
})
export class GenericBgComponentComponent implements OnInit {
  @Input("componentName") componentName = "";
  tabs: any;
  account$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  currentStep$: BehaviorSubject<any> = new BehaviorSubject(null);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  @ViewChild(Webhost, { static: true })
  host!: Webhost;
  componentRef: any;
  bgType: any;
  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private api: GenericBgServiceService,
    private cdr: ChangeDetectorRef
  ) {
    // console.log(this.componentName);
    // this.tabs = tabsClass[this.componentName];
    // this.bgType = this.tabs[0].type;
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params: any) => {
      this.componentName = params.get("type");
      this.getTabClassData().then((resp) => {
        this.tabs = resp;
        this.bgType = this.tabs[0].type;
        this.componentRef = null;
        this.currentStep$.next(this.tabs[0]);
        this.createComponentView();
      });
    });
  }

  getTabClassData() {
    return new Promise((resolve, reject) => {
      switch (this.componentName) {
        case "Bg_Issuance":
          resolve(tabsClass.Bg_Issuance);
          break;
        case "Bg_Amendment":
          resolve(tabsClass.Bg_Amendment);
          break;
        case "Bg_PhysicalAmendment":
          resolve(tabsClass.Bg_PhysicalAmendment);
          break;
        default:
          break;
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
      this.componentRef.instance.updateParentModel = this.updateAccount;
      this.componentRef.instance.amendmentType = this.currentStep$.value?.type;
    }
  }
  navigatetotab(tab) {
    this.currentStep$.next(tab);
    this.createComponentView();
  }

  updateAccount = (part: Partial<any>, isFormValid: boolean) => {
    const currentAccount = this.account$.value;
    const updatedAccount = { ...currentAccount, ...part };
    this.account$.next(updatedAccount);
    this.isCurrentFormValid$.next(isFormValid);
  };

  saveTemplet(event) {
    const dialogRef = this.dialog.open(AddNewPopupComponent, {
      data: {
        isSaveTemplate: true,
      },
      width: "750px",
      disableClose: true,
      panelClass: "popup-dialog-class",
    });
    dialogRef.afterClosed().subscribe((resp) => {
      this.saveTemplate(resp.templateName);
    });
  }

  saveTemplate(templateName) {
    const payload = {
      applicantModel: {
        ...this.account$.value.applicantInfo,
        saveTemplate: true,
        templateName: templateName,
      },
      bgInfoModel: this.account$.value?.benificiaryDetails ?? null,
      otherInfoModel: this.account$.value?.otherInfoModel ?? null,
      attachmentModel: this.account$.value?.attachMentModel ?? null,
    };
    this.api.saveTemplate(payload).subscribe((resp) => { });
  }

  updateRecord(event) {
    console.log(event, "........");
  }
}
