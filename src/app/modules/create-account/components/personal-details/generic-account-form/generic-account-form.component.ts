
//@ts-ignore
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
//@ts-ignore
import { Form, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
//@ts-ignore
import { GenericValueInfoModel } from 'app/shared/models/generic-value.model';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { SidenavService } from 'app/shared/services/sidenav.service';
//@ts-ignore
import { BankCodePanelComponent } from 'app/shared/components/bank-code-panel/bank-code-panel.component';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
//@ts-ignore
import { catchError, map, of, Subscription, tap } from 'rxjs';
import { CountryService } from 'app/shared/services/country-service';
import {
  AppState,
  LocaleData,
  selectLocaleData,
} from '@onerumango/utils';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-generic-account-form',
  templateUrl: './generic-account-form.component.html',
  styleUrls: ['./generic-account-form.component.scss']
})
export class GenericAccountFormComponent {

  // disbursementForm: FormGroup | undefined;
  // currentDate: Date | undefined;
  // genericValue: GenericValueInfoModel | undefined;
  @Input() screenCode = '';
  @Output() genericForm = new EventEmitter();

  // staticData = {
  //   DISBURSEMENTTYPE: [],
  //   ACCOUNTTYPE: [],
  //   CHEQUETYPE: [],
  // };
  // accountValue = [
  //   { label: 'Internal', value: true },
  //   { label: 'External', value: false },
  // ];
  // internalAccount = [
  //   { label: 'Yes', value: true },
  //   { label: 'No', value: false },
  // ];
  // chequeValiadtors = ['chequeTypeId', 'customerName', 'branchCode'];
  // accountValidators = ['accountTypeId'];
  originationId: number | undefined;

  @Input() detailsForGeneric: any;
  @Input() user: any;

  personalDetailsForm: FormGroup | any;

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
      prefix: ([Validators.required]),
      firstName: ([Validators.required]),
      lastName: ([Validators.required]),
      dateOfBirth: ([Validators.required]),
      gender: ([Validators.required]),
      maritalStatus: ([Validators.required]),
      nationality: ([Validators.required]),
      countryOfResidence: ([Validators.required]),

      identificationNo: ([Validators.required]),
      countryOfIssue: ([Validators.required]),
      dateOfIssue: ([Validators.required]),
      expiryDate: ([Validators.required]),

      mobileNo: ([Validators.required]),
      telephoneHome: ([Validators.required]),
      telephoneWork: ([Validators.required]),
      fax: ([Validators.required]),
      statementVia: ([Validators.required]),

      residentStatus: ([Validators.required]),
      city: ([Validators.required]),
      livingAddressSince: ([Validators.required]),

      spousePrefix: ([Validators.required]),
      spouseFirstName: ([Validators.required]),
      spouseLastName: ([Validators.required]),
      spouseDateOfBirth: ([Validators.required]),
      spouseMobileNo: ([Validators.required]),
      spouseEmail: ([Validators.required]),
      spouseEmployeeStatus: ([Validators.required]),
      spouseNetIncome: ([Validators.required]),

      emePrefix: ([Validators.required]),
      emeFirstName: ([Validators.required]),
      emeLastName: ([Validators.required]),
      emeRelationship: ([Validators.required]),
      emeMobileNo: ([Validators.required]),
      emeTelephoneHome: ([Validators.required]),
      emeTelephoneWork: ([Validators.required]),
      emeFax: ([Validators.required]),
      emeResidentStatus: ([Validators.required]),
      emeCity: ([Validators.required]),
      emePostalCode: ([Validators.required]),
      emeLivingAddressSince: ([Validators.required]),
    },
    joint: {
      prefix: ([Validators.required]),
      firstName: ([Validators.required]),
      lastName: ([Validators.required]),
      dateOfBirth: ([Validators.required]),
      gender: ([Validators.required]),
      maritalStatus: ([Validators.required]),
      nationality: ([Validators.required]),
      countryOfResidence: ([Validators.required]),

      identificationNo: ([Validators.required]),
      countryOfIssue: ([Validators.required]),
      dateOfIssue: ([Validators.required]),
      expiryDate: ([Validators.required]),

      relationship: ([Validators.required]),
      sharePercentage: ([Validators.required]),

      mobileNo: ([Validators.required]),
      statementVia: ([Validators.required]),

      residentStatus: ([Validators.required]),
      city: ([Validators.required]),
      livingAddressSince: ([Validators.required]),
    },
    minor: {
      prefix: ([Validators.required]),
      firstName: ([Validators.required]),
      lastName: ([Validators.required]),
      dateOfBirth: ([Validators.required]),
      gender: ([Validators.required]),
      maritalStatus: ([Validators.required]),
      nationality: ([Validators.required]),
      countryOfResidence: ([Validators.required]),

      identificationNo: ([Validators.required]),
      countryOfIssue: ([Validators.required]),
      dateOfIssue: ([Validators.required]),
      expiryDate: ([Validators.required]),

      relationship: ([Validators.required]),

      mobileNo: ([Validators.required]),
      statementVia: ([Validators.required]),

      residentStatus: ([Validators.required]),
      city: ([Validators.required]),
      livingAddressSince: ([Validators.required]),
    },
    corporate: {
      prefix: ([Validators.required]),
      firstName: ([Validators.required]),
      position: ([Validators.required]),
      lastName: ([Validators.required]),
      dateOfBirth: ([Validators.required]),
      gender: ([Validators.required]),
      maritalStatus: ([Validators.required]),
      nationality: ([Validators.required]),
      countryOfResidence: ([Validators.required]),

      identificationNo: ([Validators.required]),
      countryOfIssue: ([Validators.required]),
      dateOfIssue: ([Validators.required]),
      expiryDate: ([Validators.required]),

      mobileNo: ([Validators.required]),
      // telephoneHome: ([Validators.required]),
      // telephoneWork: ([Validators.required]),
      // fax: ([Validators.required]),
      statementVia: ([Validators.required]),

      residentStatus: ([Validators.required]),
      city: ([Validators.required]),
      livingAddressSince: ([Validators.required]),

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
    }
  }
  subscriptions: Subscription[] = [];


  private localeData: LocaleData | undefined;


  constructor(
    //@ts-ignore
    private fb: FormBuilder,
    //@ts-ignore
    private genericValueService: GenericValueService,
    public sidenavService: SidenavService,
    //@ts-ignore
    private loanService: LoanService,
    //@ts-ignore
    private sessionStorageService: SessionStorageService,
    private countryService: CountryService,
    private store: Store<AppState>,
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
    // this.fetchGenericValues();
    // this.fetchDisbursementDetails();
    this.createPersonalDetailsForm();
    this.onCreateGroupFormValueChange();

    this.loadCountries();
  }
  onCreateGroupFormValueChange() {
    this.personalDetailsForm.valueChanges.subscribe(() => {      
      this.genericForm.emit(this.personalDetailsForm);
    });
  }
  createPersonalDetailsForm() {
  this.personalDetailsForm = this.fb.group({
    id: [null],
    originationDetail: this.fb.group({
      originationId: [null]
    }),

    customerInfo: this.fb.group({
      userRefnumber: [''],
      icustRefNo: [''],
      cifNumber: [''],
      autoVerificationType: [false],
      corporateOnboardingStatus: [''],

      // PEP & Resident status
      pepStatus: [''],
      isResidentOfIndia: [false],

      // FATCA/CRS Info
      customerFatcaAndCrsInfoList: this.fb.array([
        this.fb.group({
          fatcaId: [null],
          countryId: [null],
          tinNumber: [''],
          selectTinReason: [''],
          tinUnableReason: ['']
        })
      ]),

      // KYC Info
      kycInfo: this.fb.group({
        userRefnumber: [''],
        prefixId: [null],
        firstName: [''],
        middleName: [''],
        lastName: [''],
        dateOfBirth: [''],
        maritalStatusId: [null],
        genderId: [null],
        nationality: [''],
        branchId: [null],

        // Emergency Contact
        emergencyContactDto: this.fb.group({
          prefix: [''],
          firstName: [''],
          middleName: [''],
          lastName: [''],
          relationshipId: [null],
          relationshipValue: [''],
          contact: this.fb.group({
            telephone: [''],
            mobile: [''],
            isphoneNumVerified: [false],
            email: [''],
            workTelephone: [''],
            isEmailVerified: [false],
            fax: [null],
            whatsappNo: [''],
            alternativeNumber: [''],
            residencePhone: [''],
            communicationPhone: [null],
            statementVia: [null],
            address: this.fb.array([
              this.fb.group({
                address1: [''],
                address2: [''],
                addressTypeId: [null],
                residenceTypeId: [null],
                livingAddressSince: ['']
              })
            ])
          })
        })
      }),

      // Identification Details
      identificationDetails: this.fb.group({
        identificationNumber: [''],
        countryOfIssue: [null],
        dateIssued: [''],
        expiryDate: ['']
      }),

      // Main Contact
      contact: this.fb.group({
        telephone: [''],
        mobile: [''],
        isphoneNumVerified: [false],
        email: [''],
        workTelephone: [''],
        isEmailVerified: [false],
        fax: [null],
        whatsappNo: [''],
        alternativeNumber: [''],
        residencePhone: [''],
        communicationPhone: [null],
        statementVia: [null],
        address: this.fb.array([
          this.fb.group({
            address1: [''],
            address2: [''],
            addressTypeId: [null],
            residenceTypeId: [null],
            livingAddressSince: [''],
            suburb: [''],
            city: [''],
            postalCode: ['']
          })
        ])
      }),

      // Spouse Contact
      spouceContact: this.fb.group({
        prefix: [''],
        firstName: [''],
        lastName: [''],
        dateOfBirth: [''],
        employeeStatus: [''],
        netIncome: [null],
        contact: this.fb.group({
          telephone: [''],
          mobile: [''],
          email: [''],
          workTelephone: [''],
          residencePhone: ['']
        })
      })
    }),

    // Loan/Account Details (from JSON bottom part)
    accountDescription: [''],
    accountBranch: [''],
    businessProductName: [''],
    productDescription: [''],
    accountType: [''],
    accountCurrency: [''],
    applicationDate: [''],
    userRefNumber: [''],
    cbsRefNumber: [''],
    swiftCode: [''],
    agentCode: [''],
    rmId: [''],
    initialFunding: [false],
    overdraftRequested: [false],
    holderTypeId: [null],
    holderType: ['']
  });

    this.addUpdateValidators();
  }
get customerInfo(): FormGroup {
  return this.personalDetailsForm.get('customerInfo') as FormGroup;
}

get kycInfo(): FormGroup {
  return this.customerInfo.get('kycInfo') as FormGroup;
}

get emergencyInfo(): FormGroup {
  return this.kycInfo.get('emergencyContactDto') as FormGroup;
}

get emergencyContact(): FormGroup {
  return this.emergencyInfo.get('contact') as FormGroup;
}

get emergencyContactAdress(): FormGroup {
  return this.emergencyContact.get('address') as FormGroup;
}

get contact(): FormGroup {
  return this.customerInfo.get('contact') as FormGroup;
}

get identificationDetails(): FormGroup {
  return this.customerInfo.get('identificationDetails') as FormGroup;
}

get addressArray(): FormArray {
  return this.contact.get('address') as FormArray;
}

get spouce(): FormGroup {
  return this.customerInfo.get('spouceContact') as FormGroup;
}

get spouceContact(): FormGroup {
  return this.spouce.get('contact') as FormGroup;
}

get customerFatcaAndCrsInfoList(): FormArray {
  return this.customerInfo.get('customerFatcaAndCrsInfoList') as FormArray;
}

  addUpdateValidators() {
    const accountType = this.detailsForGeneric.accountType as keyof typeof this.validationConfig;
    const configForType = this.validationConfig[accountType] || {};
    this.applyValidators(configForType);
  }


  applyValidators(config: any) {
    Object.keys(this.personalDetailsForm.controls).forEach(field => {
      const control = this.personalDetailsForm.get(field);
      if (control) {
        const validators = config[field] || [];
        control.setValidators(validators);
        control.updateValueAndValidity();
      }
    });
  }

  onSave() {
    if (this.personalDetailsForm.invalid) {
      this.personalDetailsForm.markAllAsTouched();
    }
  }

  // Get All Countrys and Isd code Mthd
  loadCountries() {
    this.countryService.getCountries().subscribe((resp: any) => {
      if (resp.data.length > 0) {
        this.countriesIsdCodes = resp?.data;
        this.countryTelIsdCode = resp?.data.map(
          (i: any) => i?.countryTelIsdCode,
        );
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

        this.personalDetailsForm.get('isdCode')?.setValue(this.defaultIsdCodeValue);
      }
    });
  }

  setMobileLength() {
    if (this.personalDetailsForm.get('isdCode')?.value) {
      const countryRecord = this.countriesIsdCodes.find(
        (item: any) =>
          item.countryTelIsdCode == this.personalDetailsForm.get('isdCode')?.value,
      );

      this.maxMobileLength = countryRecord?.mobileLength;
    }
  }

  // buildDisbursementForm(data?: any) {
  //   this.disbursementForm = this.fb.group({
  //     originationId: this.originationId,
  //     disbursementTypeId: [data?.disbursementTypeId ?? '', Validators.required],
  //     disbursementTypeValue: [data?.disbursementTypeValue ?? 'Cash'],
  //     loanAmount: [data?.principalAmount ?? '5678'],
  //     firstDisbursementDate: [data?.firstDisbursementDate ?? this.currentDate],
  //     chequeTypeId: [data?.chequeTypeId ?? ''],
  //     branchCode: [data?.branchCode ?? ''],
  //     internal: [data?.internal ?? false],
  //     customerName: [''],
  //     internalAccount: [true],
  //     createAccountWithUs: [false],
  //     disbursementAccount: this.fb.group({
  //       accountNo: [data?.disbursementAccount?.accountNo ?? ''],
  //       confirmAccountNo: [data?.disbursementAccount?.accountNo ?? ''],
  //       accountTypeId: [data?.disbursementAccount?.accountTypeId ?? null],
  //       customerName: [data?.disbursementAccount?.customerName ?? ''],
  //       bankCode: [data?.disbursementAccount?.bankCode ?? ''],
  //       branchName: [data?.disbursementAccount?.branchName ?? ''],
  //     }),
  //   });
  // }

  // fetchGenericValues() {
  //   this.genericValueService
  //     .loadGenericValue(Object.keys(this.staticData))
  //     .subscribe((resp: any) => {
  //       if (resp?.statusCode === 200) {
  //         this.genericValue = resp?.data;
  //       }
  //     });
  // }

  // setDisbursement(event: number) {
  //   if (event) {
  //     const disbursement = this.genericValue?.['DISBURSEMENTTYPE']?.find(
  //       (value: { id: number; values: string }) => value?.id === event,
  //     )?.values;
  //     this.disbursementForm
  //       ?.get('disbursementTypeValue')
  //       ?.setValue(disbursement);
  //     if (disbursement?.includes('Cheque')) {
  //       this.chequeValiadtors.forEach((field) => {
  //         this.disbursementForm
  //           ?.get(field)
  //           ?.setValidators([Validators.required]);
  //         this.disbursementForm?.get(field)?.updateValueAndValidity();
  //       });
  //       this.accountValidators.forEach((field) => {
  //         this.disbursementForm?.get(field)?.clearValidators();
  //         this.disbursementForm?.get(field)?.updateValueAndValidity();
  //       });
  //     }
  //   }
  // }

  // searchBankCode() {
  //   const contextData = {
  //     component: BankCodePanelComponent,
  //     data: 2,
  //   };
  //   this.sidenavService;
  //   console.log(contextData);
  //   this.sidenavService.open(contextData);
  // }

  // fetchDisbursementDetails() {
  //   this.loanService.fetchDisbursementDetails(962).subscribe((res: any) => {
  //     if (res?.statusCode === 200 || res?.statusCode === 201)
  //       this.buildDisbursementForm(res?.data[0]);
  //   });
  // }

  handleSubmit() {
    const payload = { ...this.personalDetailsForm?.value };
    payload.originationId = this.originationId;
    payload.screenCode = this.screenCode;
    delete payload.disbursementAccount.confirmAccountNo;
    return this.loanService.saveDisbursementDetails(payload).pipe(
      tap((res) => {
        console.log(res);
      }),
      map((res: any) =>
        res?.statusCode == 200 || res?.statusCode == 201
          ? ('success' as const)
          : ('failure' as const),
      ),
      catchError((_err) => {
        console.error(_err);
        return of('failure' as const);
      }),
    );
  }

  submitForm() {
    return this.handleSubmit().toPromise();
  }
}
