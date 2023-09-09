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
import { debounceTime } from "rxjs/operators";
import { NewDepositService } from "app/modules/new-deposit/new-deposit.service";
import { LoanService } from "app/shared/services/loan/loan.service";

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
  fixedDepositId: any;
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

  constructor(
    private fb: FormBuilder,
    private api: NewDepositService,
    private personalDetailsService: PersonalDetailsService,
    private loanApi: LoanService
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
    this.buildCustomerDetailsForm();
    this.holderType = sessionStorage.getItem("holderType") || "Self";
    this.fixedDepositId = parseInt(sessionStorage.getItem("fixedDepositId"));
    this.getCountry();
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

  buildCustomerDetailsForm() {
    this.customerDetailsForm = this.fb.group({
      fixedDepositId: "",
      customer: this.fb.array([]),
    });
    setTimeout(() => {
      if (this.holderType == "Self") this.addCustomer();
      else if (this.holderType == "Joint") {
        for (let i = 0; i <= 1; i++) this.addCustomer();
      }
      this.customFormGroup.emit(this.customerDetailsForm);
    }, 200);
  }

  get customer(): FormArray {
    return this.customerDetailsForm.get("customer") as FormArray;
  }

  newCustomer(): FormGroup {
    return this.fb.group({
      id: "",
      customerNo: "",
      primaryCustomer: "",
      prefix: ["", Validators.required],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      dateOfBirth: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      gender: ["", Validators.required],
      nationality: ["", Validators.required],
      address1: [""],
      residenceType: ["", Validators.required],
      country: ["", Validators.required],
      pincode: ["", Validators.required],
      state: ["", Validators.required],
      cityId: ["", Validators.required],
    });
  }

  addCustomer() {
    this.customer.push(this.newCustomer());
  }

  confirmCustomer() {
    if (this.customerDetailsForm.invalid) {
      return;
    }
    const customer = this.createPayload();
    console.log(customer);
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
        middleName: "",
        gender: element.gender,
        dateOfBirth: moment(element.dateOfBirth).format(),
        nationality: element.nationality,
        contact: {
          mobile: element.mobile,
          email: element.email,
          address: [
            {
              address1: element.address,
              address2: "",
              residentType: element.residentType,
              cityId: element.cityId,
              country: element.country,
              zipCode: element.pincode,
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

  getCityandStateByZipcode(indx) {
    console.log({ indx });

    (<FormGroup>this.customer.controls[indx])
      .get("pincode")
      .valueChanges.pipe(debounceTime(500))
      .subscribe((value) => {
        console.log({ value });

        if (value) {
          console.log(value);
          if (value.toString().length) {
            this.personalDetailsService
              .fetchStateCityByZipcode(value)
              .subscribe((res: any) => {
                if (res) {
                  this.listCityState = res?.data;
                  this.customer.controls[indx]
                    .get("state")
                    .patchValue(res?.data?.[0]?.state);
                  this.customer.controls[indx]
                    .get("cityId")
                    .patchValue(res?.data?.[0]?.cityId);
                }
              });
          }
        }
      });
  }
}
