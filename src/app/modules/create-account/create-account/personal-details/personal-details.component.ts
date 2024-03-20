import {
  EventEmitter,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";
import { MatAccordion, MatExpansionPanel } from "@angular/material/expansion";
import { debounceTime } from "rxjs/operators";
import { PersonalDetailsService } from "app/modules/loans/personal-details/personal-details.service";
import { LoanService } from "app/shared/services/loan/loan.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import * as moment from "moment";

@Component({
  selector: "app-create-account-personal-details",
  templateUrl: "./personal-details.component.html",
  styleUrls: ["./personal-details.component.scss"],
})
export class CreateAccountPersonalDetailsComponent implements OnInit {
  @Output() onSubmitPersonalDetailsEvent: EventEmitter<any> =
    new EventEmitter();
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChildren(MatExpansionPanel) panels!: QueryList<MatExpansionPanel>;
  personalDetailsForm: FormGroup | any;
  countries: any = [];
  stateList: any = [];
  cityList: any = [];
  accountHeader: string;
  todayDate: Date = new Date();
  listCityState: any = [];
  listCity: any = [];
  staticData = {
    RESIDENCETYPE: [],
    GENDER: [],
    PREFIX: [],
  };
  genderArray: string[] = [];
  prefixArray: string[] = [];
  residenceTypeArray: string[] = [];
  boundaries: any;
  // SAVE BUTTON PROPERTIES
  isLoading: boolean = false;
  loadingBtnText: string = "Saving...";
  countriesIsdCodes: any;
  defaultIsdCodeValue: any;
  maxMobileLength: any;
  screenName: string = "Personal Details";
  constructor(
    private fb: FormBuilder,
    private openAccountService: OpenAccountService,
    private activateRoute: ActivatedRoute,
    private personalDetailsService: PersonalDetailsService,
    private loanApi: LoanService,
    private snack: MatSnackBar
  ) {
    this.accountHeader = this.activateRoute.snapshot["queryParams"]["title"];
  }

  ngOnInit(): void {
    var customerId = parseInt(sessionStorage.getItem("customerId"));
    this.getGenericDetails();
    this.fetchBoundaries();
    this.getCountry();
    this.getState();
    this.getCity();
    if (customerId) {
      this.getCustomerById(customerId);
    } else this.builtPersonalFOrm();
  }

  getState() {
    this.openAccountService.getAllState().subscribe((resp: any) => {
      if (resp?.statusCode == 200) {
        this.listCityState = resp.data;
      }
    });
  }
  fetchBoundaries() {
    const basisId = JSON.parse(
      localStorage.getItem("basisDetails")
    ).basisDetailsId;
    this.openAccountService.fetchBoundariesDetails(basisId).subscribe((res) => {
      if (res?.statusCode === 200 && res?.data) {
        this.boundaries = res.data[0];
      }
    });
  }

  dateOfBirthSelected() {
    let dateOfBirth = moment(
      this.personalDetailsForm.value.personalInfoArray[0].dateOfBirth
    ).format("YYYY-MMM-DD");
    if (this.calculateAge(dateOfBirth) < this.boundaries.minimumAge) {
      this.showAgeValidation("Min", this.boundaries?.minimumAge);
    } else if (this.calculateAge(dateOfBirth) > this.boundaries.maximumAge) {
      this.showAgeValidation("Max", this.boundaries?.maximumAge);
    }
  }
  showAgeValidation(type, age) {
    this.snack.open(`${type} age should be ${age} year`, "OK", {
      duration: 2000,
      verticalPosition: "top",
      horizontalPosition: "right",
    });

    setTimeout(() => {
      this.personalDetailsForm
        .get("personalInfoArray")
        ["controls"][0].get("dateOfBirth")
        .setValue(null);
    }, 200);
  }
  calculateAge(dateOfBirth) {
    return moment().diff(dateOfBirth, "years");
  }

  getCity() {
    this.openAccountService.getAllCity().subscribe((resp: any) => {
      if (resp?.statusCode == 200) {
        this.listCity = resp.data;
      }
    });
  }

  getCustomerById(customerId) {
    this.openAccountService.getCustomerById(customerId).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        this.builtPersonalFOrm(resp.data);
      } else this.builtPersonalFOrm();
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

  builtPersonalFOrm(data?) {
    this.personalDetailsForm = this.fb.group({
      personalInfoArray: this.fb.array([]),
    });
    if (data) {
      data.forEach((item) => {
        this.addCustomer(item);
      });
    } else this.addCustomer();
  }

  get personalInfoArray(): FormArray {
    return this.personalDetailsForm.get("personalInfoArray") as FormArray;
  }

  initialForm(data?): FormGroup {
    return this.fb.group({
      prefix: [data ? data.prefix : "", Validators.required],
      firstName: [data ? data.firstName : "", Validators.required],
      lastName: [data ? data.lastName : "", Validators.required],
      dateOfBirth: [data ? data.dateOfBirth : "", Validators.required],
      email: [
        data ? data.contact.email : "",
        [
          Validators.required,
          Validators.pattern(
            "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"
          ),
        ],
      ],
      gender: [data ? data.gender : "", Validators.required],
      nationality: [data ? data.nationality : "", Validators.required],
      city: [""],
      cityId: [data ? data.contact.address[0]?.cityId : ""],
      state: [
        data ? data.contact.address[0]?.stateName : "",
        Validators.required,
      ],
      address: [
        data ? data.contact.address[0]?.address1 : "",
        Validators.required,
      ],
      residentType: [
        data ? data.contact.address[0]?.residenceType : "",
        Validators.required,
      ],
      country: [
        data ? data.contact.address[0]?.countryName : "",
        Validators.required,
      ],
      zipCode: [
        data ? data.contact.address[0]?.pincode : "",
        Validators.required,
      ],
      customerId: data?.customerId,
      kycStatus: data?.kycStatus,
      mobile: [data ? data.contact.mobile : "", Validators.required],
      mobtCode: [
        data ? parseInt(data.contact.mobtCode) : "",
        Validators.required,
      ],
    });
  }

  addCustomer(data?) {
    this.personalInfoArray.push(this.initialForm(data));
    this.debounceZipCode();
  }

  debounceZipCode() {
    for (let i = 0; i < this.personalInfoArray.value?.length; i++) {
      this.fetchStateCity(i);
      this.checkAddressValidity(i);
      this.checkMobileValidtiy(i);
    }
  }

  checkMobileValidtiy(i) {
    this.personalInfoArray.controls[i]
      .get("mobile")
      .valueChanges.pipe(debounceTime(500))
      .subscribe((resp) => {
        if (resp?.length != this.maxMobileLength) {
          this.personalInfoArray.controls[i]
            .get("mobile")
            .setErrors({ invalidLength: true });
        }
      });
  }

  checkAddressValidity(i) {
    this.personalInfoArray.controls[i]
      .get("address")
      .valueChanges.pipe(debounceTime(500))
      .subscribe((resp) => {
        var regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        const addressField = this.personalInfoArray.controls[i].get("address");
        if (regex.test(resp)) {
          addressField.setErrors({ invalidAddress: true });
        } else {
          addressField.setErrors(null);
        }
      });
  }

  CheckGenderandPrefix(index: number) {
    const personalInfoGroup = this.personalInfoArray.at(index);
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

  fetchStateCity(i) {
    this.personalInfoArray.controls[i]
      .get("zipCode")
      .valueChanges.pipe(debounceTime(500))
      .subscribe((value) => {
        if (value) {
          if (value.toString().length) {
            this.personalDetailsService
              .fetchStateCityByZipcode(value)
              .subscribe((res: any) => {
                if (res?.statusCode === 200) {
                  this.personalInfoArray.controls[i]
                    .get("state")
                    .patchValue(res?.data?.[0]?.state);
                  this.personalInfoArray.controls[i]
                    .get("cityId")
                    .patchValue(res?.data?.[0]?.cityId);
                  this.personalInfoArray.controls[i]
                    .get("country")
                    .patchValue(res?.data?.[0]?.countryName);
                }
              });
          }
        }
      });
  }

  panelOpened(index: number) {
    this.panels.forEach((panel, i) => {
      if (i !== index) {
        panel.close();
      }
    });
  }

  saveCustomer(i) {
    this.closePanel(i);
  }

  closePanel(index) {
    this.panels.forEach((panel, i) => {
      if (i == index) {
        panel.close();
      }
    });
  }

  createPayLoad() {
    var customer = [];
    this.personalDetailsForm.value.personalInfoArray.forEach((element) => {
      var details = {
        prefix: element.prefix,
        firstName: element.firstName,
        lastName: element.lastName,
        middleName: null,
        customerId: element?.customerId,
        gender: element.gender,
        dateOfBirth: element.dateOfBirth,
        nationality: element.nationality,
        contact: {
          mobile: element.mobile,
          mobtCode: element.mobtCode,
          email: element.email,
          address: [
            {
              address1: element.address,
              address2: "",
              residenceType: element.residentType,
              cityId: element.cityId,
              countryName: element.country,
              pincode: element.zipCode,
              stateName: element.state,
            },
          ],
        },
      };
      customer.push(details);
    });
    const pld = {
      customer: customer,
    };
    return pld;
  }

  onConfirm() {
    const payLoad = this.createPayLoad();
    // payLoad.customer[0].contact.mobile = sessionStorage.getItem("mobileNo");
    if (this.personalDetailsForm.value.personalInfoArray[0].kycStatus)
      payLoad.customer[0].kycStatus =
        this.personalDetailsForm.value.personalInfoArray[0].kycStatus;
    this.openAccountService.setData(payLoad.customer[0]);
    this.isLoading = true;
    this.loadingBtnText = "Saving...";
    this.openAccountService.savePersonalDetails(payLoad.customer).subscribe(
      (response: any) => {
        this.loadingBtnText = "Saved";
        this.isLoading = false;
        sessionStorage.setItem("customerId", response.data[0].customerId);
        this.onSubmitPersonalDetailsEvent.emit();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getCountry() {
    this.openAccountService.getCountryList().subscribe((Countrylist: any) => {
      if (Countrylist?.statusCode == 200) {
        if (Countrylist?.data) {
          this.countries = Countrylist.data;
          this.countriesIsdCodes = Countrylist?.data;
          const indiaIsdCode = this.countriesIsdCodes.find(
            (item) => item?.countryName.toLowerCase() == "india"
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
    });
  }
  onIsdCodeSelected(isdCode) {}

  onCountrySelect(countryCode) {
    this.openAccountService
      .getState(countryCode)
      .subscribe((statelist: any) => {
        this.stateList = statelist.data;
      });
  }

  onSelectState() {
    this.openAccountService
      .getCity(this.personalDetailsForm.value.state)
      .subscribe((citylist: any) => {
        this.cityList = citylist.data;
      });
  }

  onSelectCity(event: any, cityObj: any) {
    this.personalDetailsForm.patchValue({
      zipCode: cityObj.pincozipC,
    });
  }

  onBack() {
    this.onBackEvent.emit();
  }
}
