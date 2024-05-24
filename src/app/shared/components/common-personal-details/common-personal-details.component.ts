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
import { PersonalDetailsConstant } from "./personal-details.constant";

@Component({
  selector: "app-common-personal-details",
  templateUrl: "./common-personal-details.component.html",
  styleUrls: ["./common-personal-details.component.scss"],
})
export class CommonPersonalDetailsComponent implements OnInit {
  customerDetailsForm: FormGroup;
  @Output() onCustomSubmit = new EventEmitter<{}>();
  @Output() onBackEvent = new EventEmitter<{}>();
  @Output() customFormGroup = new EventEmitter<{}>();
  @Input() isHideField = false;
  @Input() basisId: any;
  @Input() personalDetails: any;
  @Input("updateParentModel") updateParentModel: (value: Partial<any>) => void;
  @Input() docCustomerDetails: any;
  isDone = true;
  selectedStep: number = 0;
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChildren(MatExpansionPanel) panels!: QueryList<MatExpansionPanel>;
  @Input() customerInfo;
  @Input() mobileVerifyInfo: any = {};

  firstFormGroup = this.fb.group({});
  secondFormGroup = this.fb.group({
    secondCtrl: [""],
  });
  isLinear = true;
  holderType: any;
  loanCustomerId: any;
  countryArray: any;

  listCityState: any = [];
  staticData = PersonalDetailsConstant.GENERIC_SATIC_KEYS;
  genderArray: any[] = [{}];
  prefixArray: any[] = [{}];
  residenceTypeArray: any[] = [{}];
  todayDate: Date = new Date();
  listCity: any = [];
  primaryCustIndex: number = 0;
  boundaries: any;
  screenName: string = "Common";
  countriesIsdCodes: any;
  defaultIsdCodeValue: any;
  maxMobileLength: any;
  nationalityArray: any[] = [];
  customerIds: any[] = [];

  constructor(
    private fb: FormBuilder,
    private api: NewDepositService,
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

  ngOnChanges(changes: SimpleChanges): void {
    this.getAllRequisite().then((res) => {
      console.log("buildingForm");
      if (changes?.personalDetails?.currentValue) {
        this.buildCustomerDetailsForm(changes.personalDetails.currentValue);
      } else this.buildCustomerDetailsForm();
    });
  }

  ngOnInit(): void {
    this.getGenericDetails();
    this.fetchBoundaries();
    this.holderType =
      sessionStorage.getItem("loanHolderType")?.toLowerCase() || "Self";
    this.loanCustomerId = sessionStorage.getItem("originationId");
    this.getAllRequisite().then((res) => {
      if (this.personalDetails?.length > 0) {
        this.getGenericDetails();
        this.buildCustomerDetailsForm(this.personalDetails);
      } else {
        this.buildCustomerDetailsForm();
        console.log(this.docCustomerDetails, "this.docCustomerDetails");
        if (this.docCustomerDetails)
          setTimeout(() => {
            this.customerDetailsForm
              .get("customer")
              ["controls"][0].get("dateOfBirth")
              .setValue(
                moment(
                  this.docCustomerDetails?.dateOfBirth,
                  "DD/MM/YYYY"
                ).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
              );
            const applicantNameArray =
              this.docCustomerDetails?.applicantName.split(" ");
            if (applicantNameArray && applicantNameArray.length >= 3) {
              this.customerDetailsForm
                .get("customer")
                ["controls"][0].get("firstName")
                .setValue(applicantNameArray.slice(0, 2).join(" "));
              this.customerDetailsForm
                .get("customer")
                ["controls"][0].get("lastName")
                .setValue(applicantNameArray[applicantNameArray.length - 1]);
            } else {
              this.customerDetailsForm
                .get("customer")
                ["controls"][0].get("firstName")
                .setValue(applicantNameArray[0]);
              this.customerDetailsForm
                .get("customer")
                ["controls"][0].get("lastName")
                .setValue(applicantNameArray[applicantNameArray.length - 1]);
            }
            const address = this.customer.at(0).get("contact").get("address")[
              "controls"
            ][0] as FormGroup;
            address
              .get("pincode")
              .patchValue(
                JSON.parse(sessionStorage.getItem("backData")).pincode
              );
            address
              .get("address1")
              .patchValue(
                JSON.parse(sessionStorage.getItem("backData")).address1
              );

            sessionStorage.removeItem("backData");
          }, 100);
      }
    });
  }

  async getAllRequisite() {
    return new Promise((resolve) => {
      forkJoin({
        countries: this.api.getCountryDetails(),
      }).subscribe(
        (res) => {
          console.log(res, "......");
          this.getCountry(res.countries);
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
        this.countryArray = resp?.data;
        resp?.data.forEach((element) => {
          if (element.nationality != null) this.nationalityArray.push(element);
        });
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

  onIsdCodeSelected(isdCode) {}

  buildCustomerDetailsForm(data?) {
    this.customerDetailsForm = this.fb.group({
      loanCustomerId: "",
      customer: this.fb.array([]),
    });

    if (data?.length > 0) {
      setTimeout(() => {
        if (this.holderType.toLowerCase() == "self")
          this.addCustomer(0, data && data[0]);
        else if (this.holderType.toLowerCase() == "joint") {
          this.renderApplicant(data, data?.length);
          this.cd.detectChanges();
        }
      }, 200);
    } else {
      if (this.holderType.toLowerCase() == "self") {
        this.addCustomer(0);
      } else if (this.holderType.toLowerCase() == "joint")
        for (let i = 0; i < 2; i++) this.addCustomer(i);
      else this.addCustomer(0);
      this.cd.detectChanges();
    }
  }

  renderApplicant(data, applicantLength) {
    for (let i = 0; i < applicantLength; i++)
      this.addCustomer(i, data && data[i]);
  }

  get customer(): FormArray {
    return this.customerDetailsForm.get("customer") as FormArray;
  }

  newCustomer(data?): FormGroup {
    return this.fb.group({
      customerId: data && data.customerId,
      customerNo: [data ? data.customerNo : ""],
      onboardingStatus: [data ? data.onboardingStatus : ""],
      primaryCustomer: [
        data ? data.primaryCustomer : this.customer.length == 0 ? true : false,
      ],
      prefix: [data ? data.prefix : "", Validators.required],
      firstName: [data ? data.firstName : "", Validators.required],
      lastName: [data ? data.lastName : "", Validators.required],
      dateOfBirth: [data ? data.dateOfBirth : "", Validators.required],

      gender: [data ? data.gender : "", Validators.required],
      nationality: [data ? data.nationality : "", Validators.required],
      source: data?.source ? data.source : "Website",
      kycStatus: data?.kycStatus && data.kycStatus,
      documentId: this.calculateId(data),

      contact: this.fb.group({
        email: [
          data?.contact ? data?.contact.email : "",
          [
            Validators.required,
            Validators.pattern(
              "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"
            ),
          ],
        ],
        mobile: [
          data?.contact ? data?.contact.mobile : "",
          [Validators.required],
        ],
        mobtCode: [
          data ? parseInt(data.contact.mobtCode) : this.defaultIsdCodeValue,
          [Validators.required],
        ],
        address: this.fb.array([]),
      }),
    });
  }

  addAddress(i, address?) {
    const jk = this.customer.at(i).get("contact") as FormGroup;
    const pk = jk.get("address") as FormArray;
    const addressArrayControl = pk;
    addressArrayControl.push(
      this.fb.group({
        address1: [address?.address1 ?? "", [Validators.required]],
        address2: [address?.address2 ?? ""],
        residenceType: [address?.residenceType ?? "", [Validators.required]],
        countryName: [address?.countryName ?? "", [Validators.required]],
        pincode: [address?.pincode ?? "", [Validators.required]],
        stateName: [address?.stateName ?? ""],
        cityId: [address?.cityId ?? ""],
        cityName: [address?.cityName ?? ""],
      })
    );
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

  async addCustomer(i, data?) {
    await this.customer.push(this.newCustomer(data));
    this.addAddress(i, data ? data.contact?.address[0] : {});
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
    const addressControl = this.customer.at(i).get("contact").get("address")[
      "controls"
    ][0] as FormGroup;
    addressControl
      .get("pincode")
      .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        if (value) {
          if (value.toString().length) {
            this.loanApi
              .fetchStateCityByZipcode(value)
              .subscribe((res: any) => {
                if (res?.statusCode === 200) {
                  addressControl.patchValue(res?.data?.[0]);
                  addressControl
                    .get("countryName")
                    .patchValue(res?.data?.[0]?.countryName);
                  addressControl
                    .get("cityName")
                    .patchValue(res?.data?.[0]?.city);
                  addressControl
                    .get("stateName")
                    .patchValue(res?.data?.[0]?.state);
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
          this.loanApi.getCustomerByCif(value).subscribe((resp) => {
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
    const mobileControl = this.customer.at(i).get("contact").get("mobile");
    const mobileNo = parseInt(sessionStorage.getItem("mobileNo"));
    if (mobileNo) {
      if (i === 0) {
        mobileControl.markAllAsTouched();
        mobileControl.patchValue(mobileNo);
      }
    }
    mobileControl.valueChanges.pipe(debounceTime(500)).subscribe((resp) => {
      if (resp?.length != this.maxMobileLength && i != 0) {
        mobileControl.setErrors({ invalidLength: true });
      } else {
        this.openApi
          .checkMobileAndProduct(
            this.mobileVerifyInfo.basisName,
            resp,
            this.mobileVerifyInfo.productDuplicationKey
          )
          .subscribe((result) => {
            if (!result) {
              this.allreadyProduct(mobileControl);
            }
          });
      }
    });
  }

  allreadyProduct(mobileControl) {
    const dialogRef = this.dialog.open(ErrorNotifierPopupComponent, {
      data: {
        errorMessage: `We have found similar ${this.mobileVerifyInfo.applicationType} in our record on your Mobile Number`,
        errorMessageHint: "Please visit bank for more information.",
      },
      width: "650px",
      disableClose: true,
      panelClass: "popup-dialog-class",
      backdropClass: "bdrop",
    });
    dialogRef.afterClosed().subscribe((data) => {
      mobileControl.setValue("");
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
      countryName: "",
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
        const addressControl = this.customer
          .at(i)
          .get("contact")
          .get("address")["controls"][0] as FormGroup;
        addressControl.patchValue(res);
        addressControl.get("countryName").patchValue(res.countryName);
      }
    });
  }

  confirmCustomer() {
    if (
      this.customerDetailsForm.invalid ||
      (!this.isHideField && this.isAnyPrimaryCustomer())
    ) {
      return;
    }

    let prefixValue = null;
    this.customerDetailsForm.value.customer.forEach((element, i) => {
      this.prefixArray.forEach((el) => {
        if (element.primaryCustomer && el.id == element.prefix) {
          prefixValue = el.values;
        }
      });
    });
    console.log(this.customerDetailsForm, "customerDetailsForm");
    this.onCustomSubmit.emit({
      status: true,
      prefixValue: prefixValue,
      personalDetails: this.customerDetailsForm,
    });

    this?.updateParentModel({
      personalDetails: this.customerDetailsForm.value,
      updateMasterSave: true,
      prefixValue: prefixValue,
      isForLoan: false,
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
    this.onBackEvent.emit();
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
      nationality: resp.nationality,
      contact: {
        mobile: resp.contact.mobile,
        mobtCode: parseInt(resp.contact.mobtCode),
        email: resp.contact.email,
        address: [
          {
            address1: resp.contact.address[0].address1,
            residenceType: resp.contact.address[0].residenceType,
            countryName: resp.contact.address[0].countryName,
            pincode: resp.contact.address[0].pincode,
            state: resp.contact.address[0].stateName,
            cityId: resp.contact.address[0].cityId,
          },
        ],
      },
      source: resp.source,
      kycStatus: resp.kycStatus,
      mobile: resp.contact.mobile,
      mobtCode: parseInt(resp.contact.mobtCode),
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
    this.openApi.fetchBoundariesDetails(this.basisId).subscribe((res) => {
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
    const prefix = this.prefixArray.filter(
      (item) => item.id === personalInfoGroup.get("prefix").value
    )[0].values;
    const gender = this.genderArray.filter(
      (item) => item.id === personalInfoGroup.get("gender").value
    )[0]?.values;
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
