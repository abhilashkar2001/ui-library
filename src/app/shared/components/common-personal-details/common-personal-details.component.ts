import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatAccordion, MatExpansionPanel } from "@angular/material/expansion";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PersonalDetailsService } from "app/modules/loans/personal-details/personal-details.service";
import { NewDepositService } from "app/modules/new-deposit/new-deposit.service";
import { CreateRdService } from "app/modules/new-deposit/new-deposit/rd-calculator/create-rd.service";
import { LoanService } from "app/shared/services/loan/loan.service";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";
import * as moment from "moment";

import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { ReusablePincodePopupComponent } from "../reusable-pincode-popup/reusable-pincode-popup.component";
import { ErrorNotifierPopupComponent } from "../error-notifier-popup/error-notifier-popup.component";
import { forkJoin } from "rxjs";
import { TokenStorageService } from "app/shared/token-storage.service";

@Component({
  selector: "app-common-personal-details",
  templateUrl: "./common-personal-details.component.html",
  styleUrls: ["./common-personal-details.component.scss"],
})
export class CommonPersonalDetailsComponent implements OnInit {
  customerDetailsForm: FormGroup;
  @Output() customSavePersonal = new EventEmitter<{}>();
  @Output() personalBack = new EventEmitter<{}>();
  @Output() customFormGroup = new EventEmitter<{}>();

  isDone = true;
  selectedStep: number = 0;
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChildren(MatExpansionPanel) panels!: QueryList<MatExpansionPanel>;
  @Input() customerInfo;

  firstFormGroup = this.fb.group({});
  secondFormGroup = this.fb.group({
    secondCtrl: [""],
  });
  isLinear = true;
  holderType: any;
  loanCustomerId: any;
  countryArray: any;

  listCityState: any = [];
  staticData = {
    RESIDENCETYPE: [],
    GENDER: [],
    PREFIX: [],
  };
  genderArray: any[] = [];
  prefixArray: any[] = [];
  residenceTypeArray: any[] = [];
  todayDate: Date = new Date();
  listCity: any = [];
  primaryCustIndex: number = 0;
  boundaries: any;
  screenName: string = "Personal Details";
  countriesIsdCodes: any;
  defaultIsdCodeValue: any;
  maxMobileLength: any;
  constructor(
    private fb: FormBuilder,
    private api: NewDepositService,
    private personalDetailsService: PersonalDetailsService,
    private loanApi: LoanService,
    private openApi: OpenAccountService,
    private cd: ChangeDetectorRef,
    private rdApi: CreateRdService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private tokenStore: TokenStorageService
  ) {}

  panelOpened(index: number) {
    this.panels.forEach((panel, i) => {
      if (i !== index) {
        panel.close();
      }
    });
  }

  ngAfterViewInit() {
    // Set up initial expansion state
    this.panels.forEach((panel, i) => {
      console.log(i, "........");
    });
  }

  ngOnInit(): void {
    // this.getCountry();
    this.getGenericDetails();
    this.fetchBoundaries();
    this.holderType = sessionStorage.getItem("loanHolderType") || "Self";
    this.loanCustomerId = sessionStorage.getItem("originationId");
    this.getAllRequisite().then((res) => {
      if (this.loanCustomerId != null) this.getCustomerById();
      else this.buildCustomerDetailsForm();
    });

    // this.getState();
    // this.getCity();
  }

  async getAllRequisite() {
    return new Promise((resolve) => {
      forkJoin({
        countries: this.api.getCountryDetails(),
        states: this.loanApi.getAllState(),
        citys: this.loanApi.getAllCity(),
      }).subscribe(
        (res) => {
          console.log(res, "......");
          this.getCountry(res.countries);
          this.getState(res.states);
          this.getCity(res.citys);
          resolve("done");
        },
        () => {
          resolve("Fail");
        }
      );
    });
  }

  getState(resp) {
    if (resp?.statusCode === 200) {
      this.listCityState = resp.data;
    }
  }
  getCity(resp) {
    if (resp?.statusCode === 200) {
      this.countryArray = resp.data;
    }
    this.listCity = resp.data;
  }

  getCustomerById() {
    this.rdApi
      .getOriginationMaster(parseInt(this.loanCustomerId))
      .subscribe((resp) => {
        if (resp?.statusCode === 200) {
          let customerDetails = resp.data[0].customerInfo;
          this.buildCustomerDetailsForm(customerDetails);
          // this.dateOfBirthValidationHandle(customerDetails);
        } else this.buildCustomerDetailsForm();
      });
  }

  getGenericDetails() {
    this.loanApi
      .genericValue(this.screenName, Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.genderArray = resp.data["GENDER"];
          this.prefixArray = resp.data["PREFIX"];
          this.residenceTypeArray = resp.data["RESIDENCETYPE"];
        }
      });
  }
  getCountry(resp) {
    if (resp?.statusCode === 200) {
      if (resp?.data) {
        this.countryArray = resp.data;
        this.countriesIsdCodes = resp?.data;
        const indiaIsdCode = this.countriesIsdCodes.find(
          (item) =>
            item?.countryName == this.tokenStore.getUserOtherInfo().country
        );
        if (indiaIsdCode) {
          this.defaultIsdCodeValue = indiaIsdCode?.countryTelIsdCode;
          this.maxMobileLength = indiaIsdCode?.mobileLength;
        } else {
          this.defaultIsdCodeValue =
            this.countriesIsdCodes[0].countryTelIsdCode;
          this.maxMobileLength = this.countriesIsdCodes[0]?.mobileLength;
        }
      }
    }
  }

  buildCustomerDetailsForm(data?) {
    this.customerDetailsForm = this.fb.group({
      loanCustomerId: "",
      customer: this.fb.array([]),
    });

    if (data?.length > 0) {
      setTimeout(() => {
        if (this.holderType == "Self") this.addCustomer(data && data[0]);
        else if (this.holderType == "Joint") {
          this.renderApplicant(data, data?.length);
          this.cd.detectChanges();
        }
      }, 200);
    } else {
      if (this.holderType == "Self") {
        this.addCustomer();
      } else if (this.holderType == "Joint")
        for (let i = 0; i < 2; i++) this.addCustomer();
      this.cd.detectChanges();
    }
  }

  renderApplicant(data, applicantLength) {
    for (let i = 0; i < applicantLength; i++) this.addCustomer();
  }

  get customer(): FormArray {
    return this.customerDetailsForm.get("customer") as FormArray;
  }

  newCustomer(data?): FormGroup {
    console.log(data);
    return this.fb.group({
      customerId: data && data.customerId,
      customerNo: [data ? data.customerNo : ""],
      primaryCustomer: [
        data ? data.primaryCustomer : this.customer.length == 0 ? true : false,
      ],
      prefix: [data ? data.prefix : "", Validators.required],
      firstName: [data ? data.firstName : "", Validators.required],
      lastName: [data ? data.lastName : "", Validators.required],
      dateOfBirth: [data ? data.dateOfBirth : "", Validators.required],
      email: [
        data?.contact ? data?.contact.email : "",
        [
          Validators.required,
          Validators.pattern(
            "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"
          ),
        ],
      ],
      gender: [data ? data.gender : "", Validators.required],
      nationality: [data ? data.nationality : "", Validators.required],
      address1: [data ? data.contact?.address[0].address1 : ""],
      residenceType: [
        data ? data.contact.address[0].residenceType : "",
        Validators.required,
      ],
      country: [
        data ? data.contact.address[0].countryName : "",
        Validators.required,
      ],
      pincode: [
        data ? data.contact.address[0].pincode : "",
        Validators.required,
      ],
      state: [
        data ? data.contact.address[0].stateName : "",
        Validators.required,
      ],
      cityId: [data ? data.contact.address[0].cityId : "", Validators.required],
      source: data?.source ? data.source : "Website",
      kycStatus: data?.kycStatus && data.kycStatus,
      documentId: this.calculateId(data),
      mobile: [data ? data.contact.mobile : "", Validators.required],
      mobtCode: [
        data ? parseInt(data.contact.mobtCode) : this.defaultIsdCodeValue,
      ],
    });
  }
  calculateId(data) {
    var docIds = [];
    data?.documnentsInfo?.documents.forEach((item) => {
      let docItemId = [];
      item.docs.forEach((docItem) => {
        docItemId.push(docItem.documentId);
      });
      const docId = {
        docIds: docItemId,
      };
      docIds.push(docId);
    });
    return docIds;
  }

  addCustomer(data?) {
    this.customer.push(this.newCustomer(data));
    this.debounceZipCodeAndCif();
  }
  debounceZipCodeAndCif() {
    for (let i = 0; i < this.customer.value?.length; i++) {
      this.fetchStateCity(i);
      this.getCustomerByCif(i);
      this.checkMobileValidtiy(i);
    }
  }

  fetchStateCity(i) {
    this.customer.controls[i]
      .get("pincode")
      .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        if (value) {
          if (value.toString().length) {
            this.personalDetailsService
              .fetchStateCityByZipcode(value)
              .subscribe((res: any) => {
                if (res?.statusCode === 200) {
                  this.customer.controls[i]
                    .get("state")
                    .patchValue(res?.data?.[0]?.state);
                  this.customer.controls[i]
                    .get("cityId")
                    .patchValue(res?.data?.[0]?.cityId);
                  this.customer.controls[i]
                    .get("country")
                    .patchValue(res?.data?.[0]?.countryName);
                }
              });
          }
        }
      });
  }
  getCustomerByCif(i) {
    this.customer.controls[i]
      .get("customerNo")
      .valueChanges.pipe(debounceTime(500))
      .subscribe((value) => {
        if (value) {
          this.personalDetailsService
            .getCustomerByCif(value)
            .subscribe((resp) => {
              console.log(this.customer);
              if (resp && resp?.statusCode === 200) {
                this.customer.controls[i].patchValue(
                  this.FactoryPopulate(resp.data[0])
                );
                const nationality = this.countryArray.filter(
                  (item) => item.countryName === item.nationality
                );
                this.customer.controls[i]
                  .get("nationality")
                  .patchValue(
                    nationality?.length > 0 ? nationality.countryName : ""
                  );
                this.customerDetailsForm.markAllAsTouched();
              } else {
                this.resetExceptCif(i);
              }
            });
        } else {
          this.resetExceptCif(i);
        }
      });
  }
  checkMobileValidtiy(i) {
    const mobileControl = this.customer.controls[i].get("mobile");
    mobileControl.valueChanges.pipe(debounceTime(500)).subscribe((resp) => {
      if (resp?.length != this.maxMobileLength) {
        mobileControl.setErrors({ invalidLength: true });
      }
    });
  }

  resetExceptCif(i) {
    this.customerDetailsForm.get("customer")["controls"][i].patchValue({
      primaryCustomer: false,
      prefix: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      email: "",
      gender: "",
      nationality: "",
      address1: "",
      residenceType: "",
      country: "",
      pincode: "",
      state: "",
      cityId: "",
      source: "",
      kycStatus: "",
    });
  }
  pincodeExpansion(i) {
    const dialogRef = this.dialog.open(ReusablePincodePopupComponent, {
      width: "60%",
      disableClose: true,
      panelClass: "dialog-class",
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        console.log(res);
        this.customerDetailsForm
          .get("customer")
          ["controls"][i].get("state")
          .patchValue(res.stateName);
        this.customerDetailsForm
          .get("customer")
          ["controls"][i].get("cityId")
          .patchValue(res.cityId);
        this.customerDetailsForm
          .get("customer")
          ["controls"][i].get("pincode")
          .patchValue(res.pincode);
        this.customerDetailsForm
          .get("customer")
          ["controls"][i].get("country")
          .patchValue(res.countryName);
      }
    });
  }

  confirmCustomer() {
    if (this.customerDetailsForm.invalid || this.isAnyPrimaryCustomer()) {
      return;
    }
    this.customSavePersonal.emit({
      status: true,
      personalDetails: this.customerDetailsForm,
    });
  }

  /**
   * checking any one customer should be primary customer .If not then it will show message and return.
   * @returns is any customer primary or not.
   */
  isAnyPrimaryCustomer() {
    if (
      this.customerDetailsForm.value.customer.some(
        (item) => item?.primaryCustomer == true
      )
    ) {
      return false;
    } else {
      this.dialog.open(ErrorNotifierPopupComponent, {
        data: {
          errorMessage: "Please select primary customer",
        },
        width: "650px",
        disableClose: true,
        panelClass: "popup-dialog-class",
        backdropClass: "bdrop",
      });
      return true;
    }
  }

  goBack() {
    this.personalBack.emit();
  }
  saveCustomer(i) {
    this.closePanel(i);
    console.log(this.customerDetailsForm);
  }
  closePanel(index) {
    this.panels.forEach((panel, i) => {
      if (i == index) {
        panel.close();
      }
    });
  }

  FactoryPopulate(resp) {
    return {
      customerId: resp?.customerId,
      primaryCustomer: "",
      prefix: resp.prefix,
      firstName: resp.firstName,
      lastName: resp.lastName,
      dateOfBirth: resp.dateOfBirth,
      email: resp.contact.email,
      gender: resp.gender,
      // nationality: resp.nationality,
      address1: resp.contact.address[0].address1,
      residenceType: resp.contact.address[0].residenceType,
      country: resp.contact.address[0].countryName,
      pincode: resp.contact.address[0].pincode,
      state: resp.contact.address[0].stateName,
      cityId: resp.contact.address[0].cityId,
      source: resp.source,
      kycStatus: resp.kycStatus,
    };
  }
  checkPrimaryCustomer() {
    return this.customerDetailsForm.value.customer.some((item, i) => {
      if (item.primaryCustomer) {
        this.primaryCustIndex = i;
        return item.primaryCustomer;
      } else return false;
    });
  }
  fetchBoundaries() {
    const basisId = JSON.parse(
      sessionStorage.getItem("loanBasisDetails")
    ).basisId;
    this.openApi.fetchBoundariesDetails(basisId).subscribe((res) => {
      if (res?.statusCode === 200 && res?.data) {
        this.boundaries = res.data[0];
      }
    });
  }

  dateOfBirthSelected(selectedDate, i) {
    let dateOfBirth = moment(selectedDate).format("YYYY-MMM-DD");
    console.log(this.calculateAge(dateOfBirth) > this.boundaries.minimumAge);
    if (this.calculateAge(dateOfBirth) < this.boundaries.minimumAge) {
      this.showAgeValidation("Min", this.boundaries?.minimumAge, i);
    } else if (this.calculateAge(dateOfBirth) > this.boundaries.maximumAge) {
      this.showAgeValidation("Max", this.boundaries?.maximumAge, i);
    }
  }
  showAgeValidation(type, age, i) {
    this.snack.open(`${type} age should be ${age}`, "OK", {
      duration: 2000,
      verticalPosition: "top",
      horizontalPosition: "right",
    });

    setTimeout(() => {
      this.customerDetailsForm
        .get("customer")
        ["controls"][i].get("dateOfBirth")
        .setValue(null);
    }, 100);
  }
  calculateAge(dateOfBirth) {
    return moment().diff(dateOfBirth, "years");
  }

  CheckGenderandPrefix(index: number) {
    const personalInfoGroup = this.customer.at(index);
    const prefix = personalInfoGroup.get("prefix").value;
    const gender = personalInfoGroup.get("gender").value;
    if (prefix && gender) {
      if (
        (prefix.toLowerCase() === "mr" && gender.toLowerCase() === "male") ||
        ((prefix.toLowerCase() === "ms" || prefix.toLowerCase() === "mrs") &&
          gender.toLowerCase() === "female")
      ) {
        console.log("Prefix and Gender match!");
      } else {
        personalInfoGroup.get("prefix").patchValue("");
        personalInfoGroup.get("gender").patchValue("");
        this.snack.open("Prefix and Gender does not match!", "OK", {
          duration: 2000,
          verticalPosition: "top",
          horizontalPosition: "right",
        });
      }
    }
  }
}
