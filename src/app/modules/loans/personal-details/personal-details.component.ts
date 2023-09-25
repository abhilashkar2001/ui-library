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
import * as moment from "moment";

import { PersonalDetailsService } from "./personal-details.service";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { NewDepositService } from "app/modules/new-deposit/new-deposit.service";
import { LoanService } from "app/shared/services/loan/loan.service";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";

@Component({
  selector: "app-custom-personal-details",
  templateUrl: "./personal-details.component.html",
  styleUrls: ["./personal-details.component.scss"],
})
export class PersonalCustomDetailsComponent implements OnInit {
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
      // panel.expandedChange.subscribe((expanded) => {
      //   this.items[i].expanded = expanded;
      // });
    });
  }

  ngOnInit(): void {
    this.getGenericDetails();
    this.holderType = sessionStorage.getItem("holderType") || "Self";
    this.loanCustomerId = sessionStorage.getItem("loanCustomerId");
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
    setTimeout(() => {
      if (this.holderType == "Self") this.addCustomer(data);
      else if (this.holderType == "Joint") {
        for (let i = 0; i <= 1; i++) this.addCustomer(data);
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
    const customer = this.createPayload();
    console.log(customer);
    sessionStorage.setItem("email", customer[0].contact.email);
    customer[0].contact.mobile = sessionStorage.getItem("loanPhone");
    customer[0].kycStatus = "UNDER_PROCESS";
    this.customSavePersonal.emit({
      status: true,
      personalDetails: customer,
    });
  }
  createPayload() {
    var customer = [];
    this.customerDetailsForm.value.customer.forEach((element) => {
      console.log(element);
      const cus = {
        prefix: element.prefix,
        firstName: element.firstName,
        lastName: element.lastName,
        customerId: element?.customerId,
        middleName: "",
        gender: element.gender,
        jointCustomerInfo: [],
        isphoneNumVerified: true,
        isEmailVerified: true,
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
    };
  }
}
