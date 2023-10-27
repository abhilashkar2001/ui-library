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
        this.buildCreateFdForm(resp.data[0]);
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
    this.fdApi
      .getOriginationMasterDetails(this.fdDetails.fdRdMasterId)
      .subscribe((data) => {
        if (data.statusCode === 200) {
          const payload = {
            originationModel: details,
            customerInfo: [],
          };
          this.fdApi.saveFdOriginationMaster(payload).subscribe((resp) => {
            if (resp?.statusCode === 200) {
              sessionStorage.setItem(
                "depositOriginationId",
                resp.data.originationModel.originationId
              );
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
        }
      });
  }

  createPayload(event) {
    var customer = [];
    event.value.customer.forEach((element) => {
      const cus = {
        prefix: element.prefix,
        firstName: element.firstName,
        lastName: element.lastName,
        customerId: element?.customerId,
        middleName: "",
        gender: element.gender,
        jointCustomerInfo: [],
        documentId: [],
        isphoneNumVerified: true,
        isEmailVerified: true,
        source: element.source,
        dateOfBirth: moment(element.dateOfBirth).format(),
        nationality: element.nationality,
        contact: {
          mobile: element.mobile,
          email: element.email,
          address: [
            {
              address1: element.address1,
              address2: "",
              residenceType: element.residenceType,
              cityId: element.cityId,
              countryName: element.country,
              pincode: element.zipCode,
              stateName: element.state,
            },
          ],
        },
      };
      customer.push(cus);
    });

    return customer;
  }

  customSavePersonal(event) {
    const customer = this.createPayload(event.personalDetails);
    let fdData = {
      ...this.fdDetails,
    };
    delete fdData.fdRdMasterId;
    this.globalPayload = {
      originationModel: fdData,
      customerInfo: customer,
    };
    this.fdApi.saveFdOriginationMaster(this.globalPayload).subscribe((resp) => {
      if (resp.statusCode == 200 && resp.data) {
        sessionStorage.setItem(
          "customerId",
          resp.data.customerInfo[0].customerId
        );
        this.snack.open(`Personal Details Saved` + " !", "OK", {
          duration: 4000,
          verticalPosition: "top",
          horizontalPosition: "right",
          panelClass: "snackbar-error",
        });
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
  customFormGroupEmit(event) {
    this.steper_Array[1].stepFormControl = event;
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

    var payload = {
      customerId: parseInt(sessionStorage.getItem("customerId")),
      documentInfo: docIds,
    };
    this.depositApi.submitAllDocument(payload).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        this.next();
      }
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
