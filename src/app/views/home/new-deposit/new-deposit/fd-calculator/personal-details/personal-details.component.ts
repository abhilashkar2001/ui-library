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
import { NewDepositService } from "../../../new-deposit.service";
import { PersonalDetailsService } from "./personal-details.service";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: "app-personal-details",
  templateUrl: "./personal-details.component.html",
  styleUrls: ["./personal-details.component.scss"],
})
export class PersonalDetailsComponent implements OnInit {
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

  customerDetailsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: NewDepositService,
    private personalDetailsService: PersonalDetailsService
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
    this.holderType = sessionStorage.getItem("holderType") || "Self";
    this.fixedDepositId = parseInt(sessionStorage.getItem("fixedDepositId"));
    this.buildCustomerDetailsForm();
    this.getCountry();
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
      email: ["", Validators.required],
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
    console.log(this.customerDetailsForm.value);
    this.customSavePersonal.emit({
      status: true,
      personalDetails: customer,
    });
  }
  createPayload() {
    var contact = {};
    var customer = [];
    this.customerDetailsForm.value.customer.forEach((element) => {
      const address = {
        address1: element.address1,
        residenceType: element.residenceType,
        pincode: element.pincode,
        cityId: 30,
        // parseInt(element.cityId),
      };
      contact = {
        email: element.email,
        address: [address],
      };
      var customerDetails = {
        prefix: element.prefix,
        firstName: element.firstName,
        middleName: "",
        customerNo: element.customerNo,
        lastName: element.lastName,
        gender: element.gender,
        dateOfBirth: moment(element.dateOfBirth).format("YYYY-MM-DD"),
        nationality: element.nationality,
        contact: contact,
      };
      customer.push(customerDetails);
    });

    const payload = {
      fixedDepositId: this.fixedDepositId,
      customer: customer,
    };

    return payload;
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
    (<FormGroup>this.customer.controls[indx])
      .get("pincode")
      .valueChanges.pipe(debounceTime(500))
      .subscribe((value) => {
        if (value) {
          console.log(value);
          if (value.toString().length) {
            this.personalDetailsService
              .fetchStateCityByZipcode(value)
              .subscribe((res: any) => {
                if (res) {
                  this.customer.controls[indx]
                    .get("state")
                    .setValue(res?.data?.[0]?.state);
                  this.customer.controls[indx]
                    .get("city")
                    .setValue(res?.data?.[0]?.cityId);
                }
              });
          }
        }
      });
  }
}
