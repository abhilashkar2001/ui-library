import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NewDepositService } from "../../../new-deposit.service";
import { FdCalculatorServiceService } from "../fd-calculator-service.service";
import * as moment from "moment";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TokenStorageService } from "app/shared/token-storage.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-fixed-deposit-details",
  templateUrl: "./fixed-deposit-details.component.html",
  styleUrls: ["./fixed-deposit-details.component.scss"],
})
export class FixedDepositDetailsComponent implements OnInit {
  REPORT_TITLE = "Fixed Deposit";
  createFdForm: FormGroup;
  personalDetailsForm: FormGroup;
  customVerifyNumber: FormGroup;
  isFixedDepositDetail: boolean = false; // should be true
  isPersonalDetails: boolean = false;
  isBookFd: boolean = false;
  isVerifyNumber: boolean = false;
  @ViewChild("stepper") stepper;
  selectedStep: number = 0;
  customBasicForm: any;
  isLinear = true;
  steper_Array: any[] = [];
  cuurrentStep = "Create FD";
  fdTypes: any;
  basisId: any;
  holderType: any;
  currentUserBranch: any;
  globalPayload: any;
  screenList: any = [];
  fdRdMasterId: any;
  fdDetails: any;
  customerInfo = [];
  existingCustomer: any;
  isEnabledEdit: boolean = false;
  saveTheEdit: boolean = false;
  docIds: any[] = [];
  staticData = {
    TYPESOFCUSTOMER: [],
    INTERESTPAYOUT: [],
    OWNERSHIP: [],
    PAYMENTTYPE: [],
  };
  typesOfCustomer: any[] = [];
  interestPayout: any[] = [];
  ownership: any[] = [];
  paymentType: any[] = [];
  constructor(
    private fb: FormBuilder,
    private depositApi: NewDepositService,
    private fdApi: FdCalculatorServiceService,
    private snack: MatSnackBar,
    private cdref: ChangeDetectorRef,
    private newDepositeService: NewDepositService,
    private tokenStorageService: TokenStorageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getGenericDetails();
    this.newDepositeService.setToken(true);
    this.currentUserBranch = this.tokenStorageService.getUser().branchCode;
    let sessionStep = sessionStorage.getItem("fdStep");
    if (sessionStep) this.selectedStep = parseInt(sessionStep);
    let id = this.route.snapshot.params["id"];
    if (id) this.dataByMasterId(parseInt(id));
    else this.buildCreateFdForm();
    let processCycleCode = this.route.snapshot.params["code"];
    if (processCycleCode) this.getAllFdStep(processCycleCode);
  }

  getGenericDetails() {
    this.newDepositeService
      .genericValue("website", Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.typesOfCustomer = resp.data["TYPESOFCUSTOMER"];
          this.interestPayout = resp.data["INTERESTPAYOUT"];
          this.ownership = resp.data["OWNERSHIP"];
          this.paymentType = resp.data["PAYMENTTYPE"];
        }
      });
  }

  getAllFdStep(processCycleCode) {
    this.fdApi.getProcessCycle(processCycleCode).subscribe((resp) => {
      sessionStorage.setItem("currentStage", resp.data.processStageList[0].id);
      this.fdApi
        .getProcessStages(resp.data.processStageList[0].id)
        .subscribe((resp) => {
          this.screenList = resp.data.screens.sort((s1, s2) => {
            return s1.sequence - s2.sequence;
          });
          this.factory();
        });
    });
  }

  dataByMasterId(fdMasterId) {
    this.fdApi.getOriginationMasterDetails(fdMasterId).subscribe((resp) => {
      if (resp.statusCode === 200) {
        this.fdDetails = resp.data[0];
        this.getOriginationMaster();
        this.buildCreateFdForm(resp.data[0]);
      }
    });
  }
  getOriginationMaster() {
    this.fdApi
      .getOriginationMaster(this.fdDetails.originationId)
      .subscribe((data) => {
        if (data.statusCode === 200) {
          this.customerInfo = data.data[0].customerInfo;
        }
      });
  }

  stepperSelectionChange(event) {
    this.cuurrentStep = this.screenList[event.selectedIndex].screenName;
    this.selectedStep = event.selectedIndex;
  }

  customSelectionChange(event) {
    console.log(event);
  }

  buildCreateFdForm(data?) {
    this.createFdForm = this.fb.group({
      amount: [data ? data?.amount : "", Validators.required],
      maturityDate: [
        data ? new Date(data.maturityDate) : "",
        Validators.required,
      ],
      intrestRate: [data ? data?.intrestRate : "", Validators.required],
      tenureYear: [data ? data?.tenureYear : ""],
      tenureMonth: [data ? data?.tenureMonth : ""],
      tenureDays: [data ? data?.tenureDays : ""],
      ownership: [data ? data?.ownership : "", Validators.required],
      maturityAmount: [data ? data?.maturityAmount : "", Validators.required],
      typeOfCustomer: [data ? data?.typeOfCustomer : "", Validators.required],
      intrestPayout: [data ? data?.intrestPayout : "", Validators.required],
      paymentType: [data ? data?.paymentType : "", Validators.required],
      autoRenew: [data ? data.autoRenew : false],
      fdRdMasterId: data && data.fdRdMasterId,
      basisDetailsId: data && data.basisDetailsId,
    });
    this.customBasicForm = this.createFdForm;
  }
  cancel() {
    window.close();
  }
  editRecord() {
    this.isEnabledEdit = true;
    this.saveTheEdit = true;
  }

  submitCreateFd() {
    delete this.fdDetails.intrestRate;
    delete this.fdDetails.amount;
    delete this.fdDetails.maturityDate;
    delete this.fdDetails.tenureDays;
    delete this.fdDetails.tenureMonth;
    delete this.fdDetails.tenureYear;
    delete this.fdDetails.ownership;

    let details = {
      ...this.fdDetails,
      ...this.createFdForm.value,
      maturityDate: moment(this.createFdForm.value.maturityDate).format(
        "DD-MMM-YYYY"
      ),
    };
    sessionStorage.setItem("originationId", this.fdDetails.originationId);
    const payload = {
      originationModel: details,
      customerInfo: this.createPayload(this.customerInfo),
    };
    this.fdApi.saveFdOriginationMaster(payload).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        sessionStorage.setItem(
          "fdRdMasterId",
          resp.data.fdRdMasterModel.fdRdMasterId
        );
        this.snack.open(`Fixed Deposit Details Saved`, "!", {
          duration: 4000,
          verticalPosition: "top",
          horizontalPosition: "right",
          panelClass: "snackbar-error",
        });
        this.next();
        this.isFixedDepositDetail = false;
        this.isVerifyNumber = true;
      }
    });

    // });
  }

  createPayload(event) {
    var customer = [];
    event.forEach((element, i) => {
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

  customSavePersonal(event) {
    let fdData = {
      ...this.fdDetails,
    };
    delete fdData.fdRdMasterId;
    const customer = this.createPayload(event.personalDetails.value.customer);
    this.globalPayload = {
      originationModel: fdData,
      customerInfo: customer,
    };
    this.fdApi.saveFdOriginationMaster(this.globalPayload).subscribe((resp) => {
      if (resp.statusCode == 200 && resp.data) {
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

  customSaveVerify(e) {
    const num = this.selectedStep + 1;
    this.selectedStep = num;
    this.factory();
    this.isVerifyNumber = false;
    this.isPersonalDetails = true;
    this.cdref.detectChanges();
  }

  goBack() {
    const num = this.selectedStep - 1;
    this.selectedStep = num;
    sessionStorage.setItem("fdStep", String(this.selectedStep));
    this.factory();
  }
  next() {
    const num = this.selectedStep + 1;
    this.selectedStep = num;
    sessionStorage.setItem("fdStep", String(this.selectedStep));
    this.factory();
  }
  customFormGroup(e) {
    this.personalDetailsForm = e;
  }

  onHolderTypeChange(e) {
    sessionStorage.setItem("holderType", e);
    this.holderType = e;
  }
  onPaymentTypeChange(e) {
    sessionStorage.setItem("paymentType", e);
  }

  factory() {
    this.cuurrentStep = this.screenList[this.selectedStep].screenName;
  }

  verifyStep(stepVerify) {
    return this.cuurrentStep.toLowerCase().includes(stepVerify) ? true : false;
  }

  customSaveDocuments(e) {
    var docIds = [];
    e.documentDetails.otherDocument.forEach((element) => {
      const docId = {
        docIds: element.docIds,
      };
      docIds.push(docId);
    });
    this.docIds = docIds;
    this.saveCustomerInfo(this.customerInfo, this.docIds);
  }
  saveCustomerInfo(resp, docIds) {
    var custResp: any = resp;
    custResp.forEach((item, i) => {
      custResp[i].documentId = [];
      if (item.primaryCustomer === true) custResp[i].documentId = docIds;
      delete custResp[i].biometricInfo;
      delete custResp[i].documnentsInfo;
    });
    let fdData = this.fdDetails;
    delete fdData.fdRdMassterId;
    fdData = {
      ...fdData,
    };
    const payload = {
      originationModel: fdData,
      customerInfo: custResp,
    };
    this.fdApi.saveFdOriginationMaster(payload).subscribe((resp) => {
      sessionStorage.setItem(
        "depositOriginationId",
        resp.data.originationModel.originationId
      );
      this.next();
    });
  }

  customDocumentForm(e) {}

  submitDocument() {}

  customExistingData(event) {
    if (event) {
      this.existingCustomer = event;
    }
  }
}
