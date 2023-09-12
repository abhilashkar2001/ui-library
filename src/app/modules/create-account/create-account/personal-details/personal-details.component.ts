import {
  EventEmitter,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";
import { MatAccordion, MatExpansionPanel } from "@angular/material/expansion";
import { debounceTime } from "rxjs/operators";
import { PersonalDetailsService } from "app/modules/loans/personal-details/personal-details.service";
import { LoanService } from "app/shared/services/loan/loan.service";

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
  staticData = {
    RESIDENCETYE: [],
    GENDER: [],
    PREFIX: [],
  };
  genderArray: string[] = [];
  prefixArray: string[] = [];
  residenceTypeArray: string[] = [];

  constructor(
    // private router: Router,
    // private _location: Location,
    private fb: FormBuilder,
    private openAccountService: OpenAccountService,
    private activateRoute: ActivatedRoute,
    private personalDetailsService: PersonalDetailsService,
    private loanApi: LoanService
  ) {
    this.accountHeader = this.activateRoute.snapshot["queryParams"]["title"];
  }

  ngOnInit(): void {
    var customerId = parseInt(sessionStorage.getItem("customerId"));
    this.getGenericDetails();
    // this.builtPersonalFOrm();
    this.getCountry();
    if (customerId) this.getCustomerById(customerId);
    else this.builtPersonalFOrm();
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
      .genericValue("website", Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.genderArray = resp.data["GENDER"];
          this.prefixArray = resp.data["PREFIX"];
          this.residenceTypeArray = resp.data["RESIDENCETYE"];
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
      email: [data ? data.contact.email : "", Validators.required],
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
    });
  }

  addCustomer(data?) {
    this.personalInfoArray.push(this.initialForm(data));
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
    console.log(this.personalDetailsForm.value);
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
    payLoad.customer[0].contact.mobile = sessionStorage.getItem("mobileNo");
    this.openAccountService.savePersonalDetails(payLoad.customer).subscribe(
      (response: any) => {
        console.log("Response: ", response);
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
      this.countries = Countrylist.data;
    });
  }

  onCountrySelect() {
    this.openAccountService
      .getState(this.personalDetailsForm.value.nationality)
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

  getCityandStateByZipcode(indx) {
    console.log({ indx });

    (<FormGroup>this.personalInfoArray.controls[indx])
      .get("zipCode")
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
                  this.personalInfoArray.controls[indx]
                    .get("state")
                    .patchValue(res?.data?.[0]?.state);

                  this.personalInfoArray.controls[indx]
                    .get("cityId")
                    .patchValue(res?.data?.[0]?.cityId);
                }
              });
          }
        }
      });
  }

  onBack() {
    this.onBackEvent.emit();
  }
}
