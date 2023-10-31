import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { NewDepositService } from "../../new-deposit.service";
import { FormGroup } from "@angular/forms";
import * as moment from "moment";
import { ActivatedRoute } from "@angular/router";
import { CreateRdService } from "./create-rd.service";
import { TokenStorageService } from "app/shared/token-storage.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";

@Component({
  selector: "app-rd-calculator",
  templateUrl: "./rd-calculator.component.html",
  styleUrls: ["./rd-calculator.component.scss"],
})
export class RdCalculatorComponent implements OnInit {
  depositType = "RD";
  selectedStep = 0; // should be 0
  isFixedDepositDetail: boolean = true; // should be true
  isPersonalDetails: boolean = false;
  isBookFd: boolean = false;
  isVerifyNumber: boolean = false;
  isKyc: boolean = false;
  @Input() customBasicForm: FormGroup;
  personalDetailsForm: FormGroup;
  documentDetailsForm: FormGroup;
  kycDetailsForm: FormGroup;
  rdDetailsForm: FormGroup;

  steper_Array = [];
  isLinear: boolean = true;
  cuurrentStep = "create";
  // CONST KEY & VALUES
  REPORT_TITLE = "Recurring Deposit";
  rdDetails: any;
  screenList: any = [];
  docIds: any[] = [];
  processCycleCode: any;
  customerInfo: any[] = [];

  constructor(
    private showSideBar: NewDepositService,
    private cdref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private rdApi: CreateRdService,
    private tokenStore: TokenStorageService,
    private snack: MatSnackBar,
    private openAccountService: OpenAccountService
  ) {}

  ngOnInit(): void {
    this.showSideBar.setToken(true);
    var sessionStep = sessionStorage.getItem("rdStep");
    if (sessionStep) this.selectedStep = parseInt(sessionStep);
    console.log(this.route.snapshot.params);
    var id = this.route.snapshot.params["id"];
    this.processCycleCode = this.route.snapshot.params["processCode"];
    if (id) this.getRdById(parseInt(id));
    // var sessionStep = parseInt(sessionStorage.getItem("selectedStep"));
    //if (sessionStep) this.selectedStep = sessionStep;
    this.getAllRdStep();
    //  this.factory();
  }
  getAllRdStep() {
    this.rdApi.getProcessCycle(this.processCycleCode).subscribe((resp) => {
      this.rdApi
        .getProcessStages(resp.data.processStageList[0].id)
        .subscribe((resp) => {
          this.screenList = resp.data.screens.sort((s1, s2) => {
            return s1.sequence - s2.sequence;
          });
          // this.updateFormGroup();
          //this.updateStep();
          this.factory();
        });
    });
  }
  getRdById(id) {
    this.rdApi.getRdDetails(id).subscribe((resp: any) => {
      if (resp?.statusCode === 200) {
        this.rdDetails = resp.data;
        this.getOriginationMaster(this.rdDetails.originationId);
      }
    });
  }

  getOriginationMaster(id) {
    this.rdApi
      .getOriginationMaster(this.rdDetails[0].originationId)
      .subscribe((data) => {
        if (data.statusCode === 200)
          this.customerInfo = data.data[0].customerInfo;
      });
  }

  factory() {
    this.cuurrentStep = this.screenList[this.selectedStep].screenName;
    console.log(this.cuurrentStep);
  }

  verifyStep(stepVerify) {
    return this.cuurrentStep.toLowerCase().includes(stepVerify) ? true : false;
  }

  stepperSelectionChange(event) {
    this.cuurrentStep = this.screenList[event.selectedIndex].screenName;
    sessionStorage.setItem("loanstep", event.selectedIndex);
    this.selectedStep = event.selectedIndex;
  }

  submitPersonalDetails(event) {
    this.next();
    this.cdref.detectChanges();
  }

  customSaveDocuments(e) {
    var docIds = [];
    console.log(e);
    e.documentDetails.otherDocument.forEach((element) => {
      const docId = {
        docIds: element.docIds,
      };
      docIds.push(docId);
    });
    this.docIds = docIds;
    var id = sessionStorage.getItem("customerId");

    //this.rdApi.getCustomerById(parseInt(id)).subscribe((resp) => {
    this.saveCustomerInfo(this.customerInfo, docIds);
    // });

    // // this.depositApi.submitAllDocument(payload).subscribe((resp) => {
    // //   if (resp?.statusCode === 200) {
    // //     // this.next();
    // //   }
    // // });
    // console.log(docIds);
  }
  saveCustomerInfo(resp, docIds) {
    var custResp: any = resp;
    custResp.forEach((item, i) => {
      custResp[i].documentId = [];
      if (item.primaryCustomer === true) custResp[i].documentId = docIds;
      delete custResp[i].biometricInfo;
      delete custResp[i].documnentsInfo;
    });
    let rdData = this.rdDetails[0];
    delete rdData.fdRdMassterId;
    console.log(rdData);
    rdData = {
      ...rdData,
    };
    const payload = {
      originationModel: rdData,
      customerInfo: custResp,
    };
    this.openAccountService.setData(payload.customerInfo[0]);
    this.rdApi.saveRdOriginationMaster(payload).subscribe((resp) => {
      sessionStorage.setItem(
        "depositOriginationId",
        resp.data.originationModel.originationId
      );
      this.next();
    });
  }

  customSaveRD(event) {
    this.next();
    this.cdref.detectChanges();
  }

  customSaveVerify(e) {
    this.next();
  }
  goBack() {
    const num = this.selectedStep - 1;
    this.cuurrentStep = this.screenList[num].screenName;
    setTimeout(() => {
      this.selectedStep = num;
    }, 200);
  }

  next() {
    const num = this.selectedStep + 1;
    this.selectedStep = num;
    sessionStorage.setItem("rdStep", String(this.selectedStep));
    this.factory();
    // for scrolling ssequenceebar and get current state.
    // const el = document.querySelector(".mat-step-label-selected");
    // el.scrollIntoView();
  }

  customSaveCreate(event) {
    sessionStorage.setItem("holderType", event.rdData.ownership);
    let jk = {
      ...this.rdDetails[0],
      ...event.rdData,
      maturityDate: moment(event.rdData.maturityDate).format("YYYY-MMM-DD"),
    };
    sessionStorage.setItem("originationId", this.rdDetails[0].originationId);
    this.rdApi
      .getOriginationMaster(this.rdDetails[0].originationId)
      .subscribe((data) => {
        if (data.statusCode === 200) {
          // this.customerInfo=data.data[0].customerInfo
          const payload = {
            originationModel: jk,
            customerInfo: this.createPayload(data.data[0].customerInfo),
          };
          this.rdApi.saveRdOriginationMaster(payload).subscribe((resp) => {
            this.snack.open(`Recurring Deposit Details Saved`, "!", {
              duration: 4000,
              verticalPosition: "top",
              horizontalPosition: "right",
              panelClass: "snackbar-error",
            });
            this.next();
          });
        }
      });
    // this.updateSelectedIndex();
    // this.isFixedDepositDetail = false;
    // this.isVerifyNumber = true;
  }

  updateSelectedIndex() {
    // this.selectedStep = this.selectedStep + 1;
  }

  customFormGroup(e) {
    this.personalDetailsForm = e;
  }
  customDocumentForm(event) {
    console.log(event);
    this.documentDetailsForm = event;
  }

  rdForm(event) {
    console.log(event);
    this.rdDetailsForm = event;
  }
  // for verify number
  customFormGroupEmit(event) {
    this.steper_Array[1].stepFormControl = event;
  }

  customkycFormGroupEmit(event) {
    this.steper_Array[4].stepFormControl = event;
  }
  customrdFormGroupEmit(event) {
    this.steper_Array[5].stepFormControl = event;
  }

  customSavePersonal(event) {
    console.log(event);
    let rdData = this.rdDetails[0];
    delete rdData.fdRdMasterId;
    console.log(rdData);
    rdData = {
      ...rdData,
    };

    const customer = this.createPayload(event.personalDetails.value.customer);
    const payload = {
      originationModel: rdData,
      customerInfo: customer,
    };
    console.log(payload);
    this.rdApi.saveRdOriginationMaster(payload).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        resp.data?.customerInfo?.forEach((item, i) => {
          if (item.primaryCustomer)
            sessionStorage.setItem("customerId", item.customerId);
        });
        this.snack.open(`Personal Details Saved` + " !", "OK", {
          duration: 4000,
          verticalPosition: "top",
          horizontalPosition: "right",
          panelClass: "snackbar-error",
        });
        this.customerInfo = resp.data?.customerInfo;
        this.next();
      }
    });
  }
  createPayload(event) {
    var customer = [];
    event.forEach((element, i) => {
      console.log(element);
      var docIds = [];
      if (element?.documentId) {
        docIds.push(element.documentId);
      } else {
        element?.documnentsInfo?.documents.forEach((item) => {
          let docItemId = [];
          item.docs.forEach((docItem) => {
            docItemId.push(docItem.documentId);
          });
          const docId = {
            docIds: docItemId,
          };
          docIds.push(docId);
        });
      }
      console.log(docIds);
      const cus = {
        prefix: element.prefix,
        firstName: element.firstName,
        lastName: element.lastName,
        customerId: element?.customerId,
        middleName: "",
        gender: element.gender,
        jointCustomerInfo: [],
        documentId: element.primaryCustomer ? docIds : [],
        isphoneNumVerified: true,
        isEmailVerified: true,
        primaryCustomer: element.primaryCustomer ?? false,
        source: element.source,
        dateOfBirth: moment(element.dateOfBirth).format(),
        nationality: element.nationality,
        contact: {
          mobile: element.mobile,
          email: element.email,
          address: [
            {
              address1:
                element?.contact?.address[0].address1 ?? element.address1,
              address2: "",
              residenceType:
                element?.contact?.address[0].residenceType ??
                element.residenceType,
              cityId: element?.contact?.address[0].cityId ?? element.cityId,
              countryName:
                element?.contact?.address[0].countryName ?? element.country,
              pincode: element?.contact?.address[0].pincode ?? element.zipCode,
              stateName:
                element?.contact?.address[0].stateName ?? element.state,
            },
          ],
        },
      };
      customer.push(cus);
    });

    return customer;
  }
}
