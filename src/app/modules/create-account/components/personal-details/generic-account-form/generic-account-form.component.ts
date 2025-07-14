
//@ts-ignore
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
//@ts-ignore
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//@ts-ignore
import { GenericValueInfoModel } from 'app/shared/models/generic-value.model';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { SidenavService } from 'app/shared/services/sidenav.service';
//@ts-ignore
import { BankCodePanelComponent } from 'app/shared/components/bank-code-panel/bank-code-panel.component';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
//@ts-ignore
import { catchError, map, of, tap } from 'rxjs';

@Component({
  selector: 'app-generic-account-form',
  templateUrl: './generic-account-form.component.html',
  styleUrls: ['./generic-account-form.component.scss']
})
export class GenericAccountFormComponent {

  // disbursementForm: FormGroup | undefined;
  // currentDate: Date | undefined;
  // genericValue: GenericValueInfoModel | undefined;
  // @Input() screenCode = '';
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
  // originationId: number | undefined;

  @Input() detailsForGeneric: any;
  @Input() user: any;

  personalDetails: FormGroup | any;

  prefix = [];
  genders = [];
  maritalStatus = [];
  nationality = [];
  countries = [];

  residentStatus = [];
  cities = [];
  relationships = [];

  countriesIsdCodes: any = [];
  maxMobileLength: any;


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
  ) {
    // this.currentDate?.setDate(new Date().getDate() + 1);
  }

  // get loanDisbursementAccount() {
  //   return this.disbursementForm?.get('disbursementAccount') as FormGroup;
  // }

  ngOnInit(): void {
    // this.originationId = this.sessionStorageService.getOriginationId();
    // this.buildDisbursementForm();
    // this.fetchGenericValues();
    // this.fetchDisbursementDetails();
    this.createPersonalDetailsForm();
    console.log(this.user);
  }

  createPersonalDetailsForm() {
    this.personalDetails = this.fb.group({
      cifNumber: ['', []],
      isPrimary: [true, []],
      prefix: ['', []],
      firstName: ['', []],
      lastName: ['', []],
      dateOfBirth: ['', []],
      gender: ['', []],
      maritalStatus: ['', []],
      nationality: ['', []],
      countryOfResidence: ['', []],

      identificationNo: ['', []],
      countryOfIssue: ['', []],
      dateOfIssue: ['', []],
      expiryDate: ['', []],

      relationship: ['', []],
      sharePercentage: ['', []],

      mobtCode: ['', []],
      mobileNo: ['', []],
      alternateNo: ['', []],
      whatsAppNo: ['', []],
      emailId: ['', []],
      telephoneHome: ['', []],
      telephoneWork: ['', []],
      fax: ['', []],
      statementVia: ['', []],

      addressLine1: ['', []],
      addressLine2: ['', []],
      residentStatus: ['', []],
      subRub: ['', []],
      city: ['', []],
      postalCode: ['', []],
      livingAddressSince: ['', []],

      spousePrefix: ['', []],
      spouseFirstName: ['', []],
      spouseLastName: ['', []],
      spouseDateOfBirth: ['', []],
      spouseTelephoneHome: ['', []],
      spouseTelephoneWork: ['', []],
      spouseMobileNo: ['', []],
      spouseEmail: ['', []],
      spouseEmployeeStatus: ['', []],
      spouseNetIncome: ['', []],

      emePrefix: ['', []],
      emeFirstName: ['', []],
      emeLastName: ['', []],
      emeRelationship: ['', []],
      emeMobileNo: ['', []],
      emeAlternateNo: ['', []],
      emeWhatsAppNo: ['', []],
      emeEmailId: ['', []],
      emeTelephoneHome: ['', []],
      emeTelephoneWork: ['', []],
      emeFax: ['', []],
      emeAddressLine1: ['', []],
      emeAddressLine2: ['', []],
      emeResidentStatus: ['', []],
      emeSubRub: ['', []],
      emeCity: ['', []],
      emePostalCode: ['', []],
      emeLivingAddressSince: ['', []],
    });
    this.addUpdateValidators();
  }

  addUpdateValidators() {
    if (this.detailsForGeneric.accountType == 'individual') {
      this.addUpdateValidatorsForIndividual();
    } else if (this.detailsForGeneric.accountType == 'joint') {
      this.addUpdateValidatorsForJoint();
    } else {
      this.addUpdateValidatorsForMinor();
    }
  }

  addUpdateValidatorsForIndividual() {
    this.personalDetails.controls['firstName'].setValidators([Validators.required]);
    this.personalDetails.controls['firstName'].updateValueAndValidity();
    this.personalDetails.controls['lastName'].setValidators([Validators.required]);
    this.personalDetails.controls['lastName'].updateValueAndValidity();
    this.personalDetails.controls['dateOfBirth'].setValidators([Validators.required]);
    this.personalDetails.controls['dateOfBirth'].updateValueAndValidity();
    this.personalDetails.controls['gender'].setValidators([Validators.required]);
    this.personalDetails.controls['gender'].updateValueAndValidity();
    this.personalDetails.controls['maritalStatus'].setValidators([Validators.required]);
    this.personalDetails.controls['maritalStatus'].updateValueAndValidity();
    this.personalDetails.controls['nationality'].setValidators([Validators.required]);
    this.personalDetails.controls['nationality'].updateValueAndValidity();
    this.personalDetails.controls['countryOfResidence'].setValidators([Validators.required]);
    this.personalDetails.controls['countryOfResidence'].updateValueAndValidity();
    this.personalDetails.controls['lastName'].setValidators([Validators.required]);
    this.personalDetails.controls['lastName'].updateValueAndValidity();

    this.personalDetails.controls['identificationNo'].setValidators([Validators.required]);
    this.personalDetails.controls['identificationNo'].updateValueAndValidity();
    this.personalDetails.controls['countryOfIssue'].setValidators([Validators.required]);
    this.personalDetails.controls['countryOfIssue'].updateValueAndValidity();
    this.personalDetails.controls['dateOfIssue'].setValidators([Validators.required]);
    this.personalDetails.controls['dateOfIssue'].updateValueAndValidity();
    this.personalDetails.controls['expiryDate'].setValidators([Validators.required]);
    this.personalDetails.controls['expiryDate'].updateValueAndValidity();

    this.personalDetails.controls['mobileNo'].setValidators([Validators.required]);
    this.personalDetails.controls['mobileNo'].updateValueAndValidity();
    this.personalDetails.controls['telephoneHome'].setValidators([Validators.required]);
    this.personalDetails.controls['telephoneHome'].updateValueAndValidity();
    this.personalDetails.controls['telephoneWork'].setValidators([Validators.required]);
    this.personalDetails.controls['telephoneWork'].updateValueAndValidity();
    this.personalDetails.controls['fax'].setValidators([Validators.required]);
    this.personalDetails.controls['fax'].updateValueAndValidity();
    this.personalDetails.controls['statementVia'].setValidators([Validators.required]);
    this.personalDetails.controls['statementVia'].updateValueAndValidity();

    this.personalDetails.controls['residentStatus'].setValidators([Validators.required]);
    this.personalDetails.controls['residentStatus'].updateValueAndValidity();
    this.personalDetails.controls['city'].setValidators([Validators.required]);
    this.personalDetails.controls['city'].updateValueAndValidity();
    this.personalDetails.controls['livingAddressSince'].setValidators([Validators.required]);
    this.personalDetails.controls['livingAddressSince'].updateValueAndValidity();

    this.personalDetails.controls['spousePrefix'].setValidators([Validators.required]);
    this.personalDetails.controls['spousePrefix'].updateValueAndValidity();
    this.personalDetails.controls['spouseFirstName'].setValidators([Validators.required]);
    this.personalDetails.controls['spouseFirstName'].updateValueAndValidity();
    this.personalDetails.controls['spouseLastName'].setValidators([Validators.required]);
    this.personalDetails.controls['spouseLastName'].updateValueAndValidity();
    this.personalDetails.controls['spouseDateOfBirth'].setValidators([Validators.required]);
    this.personalDetails.controls['spouseDateOfBirth'].updateValueAndValidity();
    this.personalDetails.controls['spouseMobileNo'].setValidators([Validators.required]);
    this.personalDetails.controls['spouseMobileNo'].updateValueAndValidity();
    this.personalDetails.controls['spouseEmail'].setValidators([Validators.required]);
    this.personalDetails.controls['spouseEmail'].updateValueAndValidity();
    this.personalDetails.controls['spouseEmployeeStatus'].setValidators([Validators.required]);
    this.personalDetails.controls['spouseEmployeeStatus'].updateValueAndValidity();
    this.personalDetails.controls['spouseNetIncome'].setValidators([Validators.required]);
    this.personalDetails.controls['spouseNetIncome'].updateValueAndValidity();

    this.personalDetails.controls['emePrefix'].setValidators([Validators.required]);
    this.personalDetails.controls['emePrefix'].updateValueAndValidity();
    this.personalDetails.controls['emeFirstName'].setValidators([Validators.required]);
    this.personalDetails.controls['emeFirstName'].updateValueAndValidity();
    this.personalDetails.controls['emeLastName'].setValidators([Validators.required]);
    this.personalDetails.controls['emeLastName'].updateValueAndValidity();
    this.personalDetails.controls['emeRelationship'].setValidators([Validators.required]);
    this.personalDetails.controls['emeRelationship'].updateValueAndValidity();
    this.personalDetails.controls['emeMobileNo'].setValidators([Validators.required]);
    this.personalDetails.controls['emeMobileNo'].updateValueAndValidity();
    this.personalDetails.controls['emeTelephoneHome'].setValidators([Validators.required]);
    this.personalDetails.controls['emeTelephoneHome'].updateValueAndValidity();
    this.personalDetails.controls['emeTelephoneWork'].setValidators([Validators.required]);
    this.personalDetails.controls['emeTelephoneWork'].updateValueAndValidity();
    this.personalDetails.controls['emeFax'].setValidators([Validators.required]);
    this.personalDetails.controls['emeFax'].updateValueAndValidity();
    this.personalDetails.controls['emeResidentStatus'].setValidators([Validators.required]);
    this.personalDetails.controls['emeResidentStatus'].updateValueAndValidity();
    this.personalDetails.controls['emeCity'].setValidators([Validators.required]);
    this.personalDetails.controls['emeCity'].updateValueAndValidity();
    this.personalDetails.controls['emePostalCode'].setValidators([Validators.required]);
    this.personalDetails.controls['emePostalCode'].updateValueAndValidity();
    this.personalDetails.controls['emeLivingAddressSince'].setValidators([Validators.required]);
    this.personalDetails.controls['emeLivingAddressSince'].updateValueAndValidity();
  }

  addUpdateValidatorsForJoint() {

  }

  addUpdateValidatorsForMinor() {

  }

  onSave() {
    console.log(this.personalDetails);
    if (this.personalDetails.invalid) {
      this.personalDetails.markAllAsTouched();
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

  // handleSubmit() {
  //   const payload = { ...this.disbursementForm?.value };
  //   payload.originationId = this.originationId;
  //   payload.screenCode = this.screenCode;
  //   delete payload.disbursementAccount.confirmAccountNo;
  //   return this.loanService.saveDisbursementDetails(payload).pipe(
  //     tap((res) => {
  //       console.log(res);
  //     }),
  //     map((res: any) =>
  //       res?.statusCode == 200 || res?.statusCode == 201
  //         ? ('success' as const)
  //         : ('failure' as const),
  //     ),
  //     catchError((_err) => {
  //       console.error(_err);
  //       return of('failure' as const);
  //     }),
  //   );
  // }

  // submitForm() {
  //   return this.handleSubmit().toPromise();
  // }
}
