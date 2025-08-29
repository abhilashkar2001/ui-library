//@ts-ignore
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
//@ts-ignore
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
//@ts-ignore
import { GenericValueInfoModel } from 'app/shared/models/generic-value.model';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { SidenavService } from 'app/shared/services/sidenav.service';
// import { LoanService } from 'app/shared/services/loan/loan.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
//@ts-ignore
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { CountryService } from 'app/shared/services/country-service';
import { AppState, LocaleData, selectLocaleData } from '@onerumango/utils';
import { Store } from '@ngrx/store';
import { ReusablePincodePopupComponent } from 'app/shared/components/reusable-pincode-popup/reusable-pincode-popup.component';
import { MatDialog } from '@angular/material/dialog';
// import { CityService } from 'app/shared/services/city.service';

@Component({
  selector: 'app-generic-account-form',
  templateUrl: './generic-account-form.component.html',
  styleUrls: ['./generic-account-form.component.scss'],
})
export class GenericAccountFormComponent implements OnInit {
  @Input() customerForm!: FormGroup | any;
  @Input() genericValue!: any;
  @Input() tabIndex!: number | any;
  @Input() dobMaxDate: Date | any;
  @Input() dobMinDate: Date | any;
  @Input() countryArray: any[] = [];
  todayDate: Date = new Date();

  @Input() screenCode = '';
  @Output() genericForm = new EventEmitter();

  staticData = {
    GENDER: [],
    PREFIX: [],
    RESIDENTSTATUS: [],
    RELATIONSHIP: [],
    STATEMENTVIA: [],
    EMPLOYMENTTYPE: [],
    MARITALSTATUS: [],
  };
  originationId: number | undefined;

  @Input() detailsForGeneric: any;
  @Input() user: any;

  personalDetailsForm: FormGroup | any;

  nationalityArray: any[] = [];

  prefix = [];
  genders = [];
  maritalStatus = [];
  nationality = [];
  countries = [];

  residentStatus = [];
  cities = [];
  relationships = [];
  positions = [];

  countriesIsdCodes: any = [];
  maxMobileLength: any;

  countryTelIsdCode: any;
  defaultIsdCodeValue: any;

  validationConfig = {
    individual: {
      prefix: [Validators.required],
      firstName: [Validators.required],
      lastName: [Validators.required],
      dateOfBirth: [Validators.required],
      gender: [Validators.required],
      maritalStatus: [Validators.required],
      nationality: [Validators.required],
      countryOfResidence: [Validators.required],

      identificationNo: [Validators.required],
      countryOfIssue: [Validators.required],
      dateOfIssue: [Validators.required],
      expiryDate: [Validators.required],

      mobileNo: [Validators.required],
      telephoneHome: [Validators.required],
      telephoneWork: [Validators.required],
      fax: [Validators.required],
      statementVia: [Validators.required],

      residentStatus: [Validators.required],
      city: [Validators.required],
      subRub: [Validators.required],
      livingAddressSince: [Validators.required],

      spousePrefix: [Validators.required],
      spouseFirstName: [Validators.required],
      spouseLastName: [Validators.required],
      spouseDateOfBirth: [Validators.required],
      spouseMobileNo: [Validators.required],
      spouseEmail: [Validators.required],
      spouseEmployeeStatus: [Validators.required],
      spouseNetIncome: [Validators.required],

      emePrefix: [Validators.required],
      emeFirstName: [Validators.required],
      emeLastName: [Validators.required],
      emeRelationship: [Validators.required],
      emeMobileNo: [Validators.required],
      emeTelephoneHome: [Validators.required],
      emeTelephoneWork: [Validators.required],
      emeFax: [Validators.required],
      emeResidentStatus: [Validators.required],
      emeCity: [Validators.required],
      emePostalCode: [Validators.required],
      emeLivingAddressSince: [Validators.required],
    },
    joint: {
      prefix: [Validators.required],
      firstName: [Validators.required],
      lastName: [Validators.required],
      dateOfBirth: [Validators.required],
      gender: [Validators.required],
      maritalStatus: [Validators.required],
      nationality: [Validators.required],
      countryOfResidence: [Validators.required],

      identificationNo: [Validators.required],
      countryOfIssue: [Validators.required],
      dateOfIssue: [Validators.required],
      expiryDate: [Validators.required],

      relationship: [Validators.required],
      sharePercentage: [Validators.required],

      mobileNo: [Validators.required],
      statementVia: [Validators.required],

      residentStatus: [Validators.required],
      city: [Validators.required],
      livingAddressSince: [Validators.required],
    },
    minor: {
      prefix: [Validators.required],
      firstName: [Validators.required],
      lastName: [Validators.required],
      dateOfBirth: [Validators.required],
      gender: [Validators.required],
      maritalStatus: [Validators.required],
      nationality: [Validators.required],
      countryOfResidence: [Validators.required],

      identificationNo: [Validators.required],
      countryOfIssue: [Validators.required],
      dateOfIssue: [Validators.required],
      expiryDate: [Validators.required],

      relationship: [Validators.required],

      mobileNo: [Validators.required],
      statementVia: [Validators.required],

      residentStatus: [Validators.required],
      city: [Validators.required],
      livingAddressSince: [Validators.required],
    },
    corporate: {
      prefix: [Validators.required],
      firstName: [Validators.required],
      position: [Validators.required],
      lastName: [Validators.required],
      dateOfBirth: [Validators.required],
      gender: [Validators.required],
      maritalStatus: [Validators.required],
      nationality: [Validators.required],
      countryOfResidence: [Validators.required],

      identificationNo: [Validators.required],
      countryOfIssue: [Validators.required],
      dateOfIssue: [Validators.required],
      expiryDate: [Validators.required],

      mobileNo: [Validators.required],
      // telephoneHome: ([Validators.required]),
      // telephoneWork: ([Validators.required]),
      // fax: ([Validators.required]),
      statementVia: [Validators.required],

      residentStatus: [Validators.required],
      city: [Validators.required],
      livingAddressSince: [Validators.required],

      // spousePrefix: ([Validators.required]),
      // spouseFirstName: ([Validators.required]),
      // spouseLastName: ([Validators.required]),
      // spouseDateOfBirth: ([Validators.required]),
      // spouseMobileNo: ([Validators.required]),
      // spouseEmail: ([Validators.required]),
      // spouseEmployeeStatus: ([Validators.required]),
      // spouseNetIncome: ([Validators.required]),

      // emePrefix: ([Validators.required]),
      // emeFirstName: ([Validators.required]),
      // emeLastName: ([Validators.required]),
      // emeRelationship: ([Validators.required]),
      // emeMobileNo: ([Validators.required]),
      // emeTelephoneHome: ([Validators.required]),
      // emeTelephoneWork: ([Validators.required]),
      // emeFax: ([Validators.required]),
      // emeResidentStatus: ([Validators.required]),
      // emeCity: ([Validators.required]),
      // emePostalCode: ([Validators.required]),
      // emeLivingAddressSince: ([Validators.required]),
    },
  };
  subscriptions: Subscription[] = [];

  private localeData: LocaleData | undefined;
  countryArr: any;

  constructor(
    // private fb: FormBuilder,
    public sidenavService: SidenavService,
    // private loanService: LoanService,
    private dialog: MatDialog,
    //@ts-ignore
    private sessionStorageService: SessionStorageService,
    private countryService: CountryService,
    private store: Store<AppState>,
    // private cityService: CityService,
    private genericValueService: GenericValueService,
  ) {
    // this.currentDate?.setDate(new Date().getDate() + 1);
  }

  // get loanDisbursementAccount() {
  //   return this.disbursementForm?.get('disbursementAccount') as FormGroup;
  // }

  ngOnInit(): void {
    const localeData$ = this.store
      .select(selectLocaleData)
      .subscribe((res: any) => {
        if (res) {
          this.localeData = res;
        }
      });
    this.subscriptions.push(localeData$);
    // this.originationId = this.sessionStorageService.getOriginationId();
    // this.buildDisbursementForm();
    this.fetchGenericValues();
    // this.fetchStateCity();
    // this.fetchDisbursementDetails();
    this.onCreateGroupFormValueChange();

    this.loadCountries();
  }

  getKycInfo(): FormGroup {
    return this.customerForm.get('kycInfo') as FormGroup;
  }

  getIdentificationDetails(): FormGroup {
    return this.customerForm.get('identificationDetails') as FormGroup;
  }

  getExpDateMin() {
    const currentDate = new Date(this.todayDate);
    currentDate.setDate(currentDate.getDate() + 1);
    return currentDate;
  }

  onCreateGroupFormValueChange() {
    this.personalDetailsForm.valueChanges.subscribe(() => {
      this.genericForm.emit(this.personalDetailsForm);
    });
  }

  addUpdateValidators() {
    const accountType = this.detailsForGeneric
      .accountType as keyof typeof this.validationConfig;
    const configForType = this.validationConfig[accountType] || {};
    this.applyValidators(configForType);
  }

  applyValidators(config: any) {
    Object.keys(this.personalDetailsForm.controls).forEach((field) => {
      const control = this.personalDetailsForm.get(field);
      if (control) {
        const validators = config[field] || [];
        control.setValidators(validators);
        control.updateValueAndValidity();
      }
    });
  }

  pincodeExpansion() {
    const dialogRef = this.dialog.open(ReusablePincodePopupComponent, {
      width: '60%',
      disableClose: true,
      panelClass: 'dialog-class',
    });

    dialogRef.afterClosed().subscribe((res) => {
      console.log(res);
    });
  }

  // fetchStateCity() {
  //   if (this.personalDetailsForm) {
  //     this.addressGroup
  //       .get('postalCode')
  //       ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
  //       .subscribe((value: any) => {
  //         if (value && value.toString().length >= 6) {
  //           this.cityService
  //             .fetchZipcodeDetails(value)
  //             .subscribe((res: any) => {
  //               if (res?.statusCode === 200 && res.data?.length) {
  //                 const data = res.data[0];

  //                 // set cities dropdown
  //                 this.cities = res.data.map((city: any) => ({
  //                   id: city.cityId,
  //                   values: city.city,
  //                 }));
  //                 this.addressGroup.patchValue({
  //                   city: data.cityId, // cityId bind hoga dropdown me
  //                   subRub: data.state,
  //                 });
  //                 // patch selected city automatically (optional)
  //                 this.emergencyContactAdress.patchValue({
  //                   city: data.cityId, // cityId is your bindValueKey
  //                 });
  //               } else {
  //                 this.cities = []; // reset dropdown if no data
  //                 this.emergencyContactAdress.patchValue({ city: null });
  //               }
  //             });
  //         }
  //       });
  //   }
  // }

  // Get All Countrys and Isd code Mthd
  loadCountries() {
    this.countryService.getCountries().subscribe((resp: any) => {
      if (resp.data.length > 0) {
        this.countryArr = resp.data;
        this.countriesIsdCodes = resp?.data;
        this.countryTelIsdCode = resp?.data.map(
          (i: any) => i?.countryTelIsdCode,
        );
        resp?.data?.forEach((element: any) => {
          if (element.nationality != null) this?.nationalityArray.push(element);
        });
        const indiaIsdCode = this.countriesIsdCodes.find(
          (item: any) => item?.countryName == this.localeData?.country,
        );

        if (indiaIsdCode) {
          this.defaultIsdCodeValue = indiaIsdCode?.countryTelIsdCode;
          this.maxMobileLength = indiaIsdCode?.mobileLength;
        } else {
          this.defaultIsdCodeValue =
            this.countriesIsdCodes[0].countryTelIsdCode;
          this.maxMobileLength = this.countriesIsdCodes[0]?.mobileLength;
        }

        this.personalDetailsForm
          .get('isdCode')
          ?.setValue(this.defaultIsdCodeValue);
      }
    });
  }

  setMobileLength() {
    if (this.personalDetailsForm.get('isdCode')?.value) {
      const countryRecord = this.countriesIsdCodes.find(
        (item: any) =>
          item.countryTelIsdCode ==
          this.personalDetailsForm.get('isdCode')?.value,
      );

      this.maxMobileLength = countryRecord?.mobileLength;
    }
  }

  fetchGenericValues() {
    this.genericValueService
      .loadGenericValue(Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.genericValue = resp?.data;
        }
      });
  }
}
