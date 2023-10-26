import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatAccordion, MatExpansionPanel } from "@angular/material/expansion";
import { PersonalDetailsService } from "app/modules/loans/personal-details/personal-details.service";
import { NewDepositService } from "app/modules/new-deposit/new-deposit.service";
import { LoanService } from "app/shared/services/loan/loan.service";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";
import * as moment from "moment";

import { debounceTime, distinctUntilChanged } from "rxjs/operators";

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
    RESIDENCETYE: [],
    GENDER: [],
    PREFIX: [],
  };
  genderArray: any[] = [];
  prefixArray: any[] = [];
  residenceTypeArray: any[] = [];
  todayDate: Date = new Date();
  listCity: any = [];
  constructor(
    private fb: FormBuilder,
    private api: NewDepositService,
    private personalDetailsService: PersonalDetailsService,
    private loanApi: LoanService,
    private openApi: OpenAccountService
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
    this.getGenericDetails();
    this.holderType = sessionStorage.getItem("holderType") || "Self";
    this.loanCustomerId = sessionStorage.getItem("customerId");
    if (this.loanCustomerId) this.getCustomerById();
    else this.buildCustomerDetailsForm();
    this.getCountry();
    this.getState();
    this.getCity();
  }

  getState() {
    this.loanApi.getAllState().subscribe((resp: any) => {
      if (resp?.statusCode == 200) {
        this.listCityState = resp.data;
      }
    });
  }
  getCity() {
    this.loanApi.getAllCity().subscribe((resp: any) => {
      if (resp?.statusCode == 200) {
        this.listCity = resp.data;
      }
    });
  }

  getCustomerById() {
    this.openApi
      .getCustomerById(parseInt(this.loanCustomerId))
      .subscribe((resp) => {
        if (resp?.statusCode === 200)
          this.buildCustomerDetailsForm(resp.data[0]);
        else this.buildCustomerDetailsForm();
      });
  }

  getGenericDetails() {
    this.loanApi
      .genericValue("website", Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.genderArray = resp.data["GENDER"];
          this.prefixArray = resp.data["PREFIX"];
          this.residenceTypeArray = resp.data["RESIDENCETYE"];
        }
      });
  }
  getCountry() {
    this.api.getCountryDetails().subscribe((resp) => {
      if (resp?.statusCode == 200) {
        this.countryArray = resp.data;
      }
    });
  }

  buildCustomerDetailsForm(data?) {
    this.customerDetailsForm = this.fb.group({
      loanCustomerId: "",
      customer: this.fb.array([]),
    });

    console.log(data)
    setTimeout(() => {
      if (this.holderType == "Self") this.addCustomer(data);
      else if (this.holderType == "Joint") {
        for (let i = 0; i <= 1; i++)
          i==0 ?  this.addCustomer(data) :  this.addCustomer();
      }
      this.customFormGroup.emit(this.customerDetailsForm);
    }, 200);
  }

  get customer(): FormArray {
    return this.customerDetailsForm.get("customer") as FormArray;
  }

  newCustomer(data?): FormGroup {
    return this.fb.group({
      customerId: data && data.customerId,
      customerNo: [data ? data.customerNo : ""],
      primaryCustomer: "",
      prefix: [data ? data.prefix : "", Validators.required],
      firstName: [data ? data.firstName : "", Validators.required],
      lastName: [data ? data.lastName : "", Validators.required],
      dateOfBirth: [data ? data.dateOfBirth : "", Validators.required],
      email: [
        data?.contact ? data?.contact.email : "",
        [Validators.required, Validators.email],
      ],
      gender: [data ? data.gender : "", Validators.required],
      nationality: [data ? data.nationality : "", Validators.required],
      address1: [data ? data.contact.address[0].address1 : ""],
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
    });
  }

  addCustomer(data?) {
    this.customer.push(this.newCustomer(data));
    this.debounceZipCodeAndCif();
  }
  debounceZipCodeAndCif() {
    for (let i = 0; i < this.customer.value?.length; i++) {
      this.fetchStateCity(i);
      this.getCustomerByCif(i);
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
        this.personalDetailsService
          .getCustomerByCif(value)
          .subscribe((resp) => {
            if (resp?.statusCode === 200) {
              this.customer.controls[i].patchValue(
                this.FactoryPopulate(resp.data[0])
              );
            }
          });
      });
  }

  confirmCustomer() {
    if (this.customerDetailsForm.invalid) {
      return;
    }
    this.customSavePersonal.emit({
      status: true,
      personalDetails: this.customerDetailsForm,
    });
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
      nationality: resp.nationality,
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
}
