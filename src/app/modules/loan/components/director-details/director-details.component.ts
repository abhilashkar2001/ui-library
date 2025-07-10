import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState, LocaleData, selectLocaleData } from '@onerumango/utils';
import { PersonalDetailsConstant } from 'app/modules/origination/modules/dynamic-pages/common-personal-details/personal-details.constant';
import { ReusablePincodePopupComponent } from 'app/shared/components/reusable-pincode-popup/reusable-pincode-popup.component';
import { pluckOnlyDate } from 'app/shared/helpers/utils';
import {
  GenericValueData,
  GenericValueInfoModel,
} from 'app/shared/models/generic-value.model';
import { CountryService } from 'app/shared/services/country-service';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { OpenAccountService } from 'app/shared/services/open-service/open-account.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import {
  catchError,
  finalize,
  forkJoin,
  map,
  of,
  Subscription,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-director-details',
  templateUrl: './director-details.component.html',
  styleUrls: ['./director-details.component.scss'],
})
export class DirectorDetailsComponent implements OnInit {
  @Input() docCustomerDetails: any;
  customerDetailsForm!: FormGroup;
  staticData = PersonalDetailsConstant.GENERIC_SATIC_KEYS;
  genderArray: GenericValueInfoModel[] = [];
  prefixArray: GenericValueInfoModel[] = [];
  empoymentArray: GenericValueInfoModel[] = [];
  relationArray: GenericValueInfoModel[] = [];
  statementOptionArr: GenericValueInfoModel[] = [];
  residenceTypeArray: GenericValueInfoModel[] = [];
  maritalStatusArray: GenericValueData[] = [];
  countriesIsdCodes: any[] = [];
  countryArray: any;
  nationalityArray: any[] = [];
  subscriptions: Subscription[] = [];
  defaultIsdCodeValue: any;
  maxMobileLength!: number;
  dobMinDate: Date | any;
  dobMaxDate: Date | any;
  dateFormat!: string;
  @Input() basisId: any;
  boundaries: any;
  todayDate: Date = new Date();
  showSpouseSection: boolean[] = [];
  private localeData: LocaleData | undefined;
  personalDetails: any;
  originationId: number | undefined;

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
    private genericValueService: GenericValueService,
    private store: Store<AppState>,
    private dialog: MatDialog,
    private openApi: OpenAccountService,
    private loanService: LoanService,
    private sessionStorageService: SessionStorageService,
  ) {}

  ngOnInit() {
    this.originationId = this.sessionStorageService.getOriginationId();

    const localeData$ = this.store.select(selectLocaleData).subscribe((res) => {
      if (res) {
        this.localeData = res;
      }
    });
    this.subscriptions.push(localeData$);
    this.getGenericDetails();
    this.fetchBoundaries();

    this.getAllRequisite().then(() => {
      if (!this.personalDetails) {
        this.buildPersonalDetailsForm();
      }
    });

    if (this.originationId) {
      this.loanService
        .getPersonalDetailsData(this.originationId)
        .pipe(
          finalize(() => {
            this.buildPersonalDetailsForm(this.personalDetails);
          }),
        )
        .subscribe({
          next: (resp) => {
            this.personalDetails = resp?.data?.customerInfo || null;
            if (this.personalDetails) {
              this.getGenericDetails();
            }
          },
        });
    }
  }

  // Commenting this code this is not required
  // ngOnChanges(changes: SimpleChanges | any): void {
  //   console.log(changes, 'changess');

  //   this.getAllRequisite().then(() => {
  //     if (changes?.personalDetails?.currentValue) {
  //       this.buildPersonalDetailsForm(changes.personalDetails.currentValue);
  //     } else this.buildPersonalDetailsForm();
  //   });
  // }

  async getAllRequisite() {
    return new Promise((resolve) => {
      forkJoin({
        countries: this.countryService.getCountries(),
      }).subscribe(
        (res) => {
          this.getCountry(res.countries);
          resolve('done');
        },
        () => {
          resolve('Fail');
        },
      );
    });
  }

  getGenericDetails() {
    this.genericValueService
      .loadGenericValue(Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.genderArray = resp.data['GENDER'];
          this.prefixArray = resp.data['PREFIX'];
          this.residenceTypeArray = resp.data['RESIDENCETYPE'];
          this.maritalStatusArray = resp.data['MARITALSTATUS'];
          this.empoymentArray = resp.data['EMPLOYMENTTYPE'];
          this.relationArray = resp.data['RELATIONSHIPTYPE'];
          this.statementOptionArr = resp.data['COMMUNICATIONTYPE'];
        }
      });
  }

  fetchBoundaries() {
    this.openApi
      .fetchBoundariesDetails(this.basisId ?? 24878)
      .subscribe((res: any) => {
        if (res?.statusCode === 200 && res?.data) {
          this.boundaries = res.data[0];
          const minimumAge = this.boundaries.minimumAge ?? 0;
          const maximumAge = this.boundaries.maximumAge ?? 0;

          this.dobMaxDate = new Date(
            this.todayDate.getFullYear() - maximumAge,
            this.todayDate.getMonth(),
            this.todayDate.getDate(),
          );

          this.dobMinDate = new Date(
            this.todayDate.getFullYear() - minimumAge,
            this.todayDate.getMonth(),
            this.todayDate.getDate(),
          );
        }
      });
  }

  getCountry(resp?: any) {
    if (resp?.statusCode === 200) {
      if (resp?.data.length > 0) {
        this.countryArray = resp?.data;
        resp?.data?.forEach((element: any) => {
          if (element.nationality != null) this?.nationalityArray.push(element);
        });
        this.countriesIsdCodes = resp?.data;
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
      }
    }
  }

  //  This method is to add the default customer while patching if it have multiple customer
  renderApplicant(data: any, applicantLength: any) {
    for (let i = 0; i < applicantLength; i++)
      this.addCustomer(i, data && data[i]);
  }

  buildPersonalDetailsForm(data?: any) {
    this.customerDetailsForm = this.fb.group({
      customer: this.fb.array([]),
    });

    if (data?.length > 0) {
      setTimeout(() => {
        this.renderApplicant(
          data,
          this.docCustomerDetails?.length || data?.length,
        );
      });
    } else {
      if (this.docCustomerDetails?.length > 0) {
        for (let i = 0; i < this.docCustomerDetails?.length; i++)
          this.addCustomer(i);
      } else {
        this.addCustomer(0);
      }
    }
  }

  getDocumentIdArray(index: number): FormArray {
    return this.customer?.at(index)?.get('documentId') as FormArray;
  }

  newCustomer(data?: any) {
    console.log(data, 'data');
    const formGroup = this.fb.group({
      customerId: data && data?.customerId,
      customerNo: [data ? data?.customerNo : ''],
      custStagingId: data?.custStagingId ?? null,
      onboardingStatus: [data ? data?.onboardingStatus : ''],
      primaryCustomer: [data ? data?.primaryCustomer : false],
      prefixId: [data ? data?.prefixId : ''],
      firstName: [data ? data?.firstName : ''],
      lastName: [data ? data?.lastName : ''],
      dateOfBirth: [data ? data?.dateOfBirth : ''],
      genderId: [data ? data?.genderId : ''],
      nationality: [data ? data?.nationality : ''],
      maritalStatusId: [data ? data?.maritalStatusId : ''],
      positionId: [data ? data?.positionId : ''],
      countryOfResidence: [data ? data?.countryOfResidence : ''],
      sharePercentage: [data ? data?.sharePercentage : ''],
      source: 'Website',
      kycStatus: data?.kycStatus && data?.kycStatus,
      documentId: this.fb.array([]),
      spouseInfo: this.fb.group({
        spouseDetilsId: [data?.spouseInfo?.spouseDetilsId ?? null],
        prefixId: [data?.spouseInfo?.prefixId ?? ''],
        prefixValue: [data?.spouseInfo?.prefixValue ?? ''],
        firstName: [data?.spouseInfo?.firstName ?? ''],
        middleName: [data?.spouseInfo?.middleName ?? ''],
        lastName: [data?.spouseInfo?.lastName ?? ''],
        dateOfBirth: [data?.spouseInfo?.dateOfBirth ?? ''],
        employeeStatusId: [data?.spouseInfo?.employeeStatusId ?? ''],
        employeeStatusValue: [data?.spouseInfo?.employeeStatusValue ?? ''],
        netIncome: [data?.spouseInfo?.netIncome ?? ''],

        contact: this.fb.group({
          contactId: [data?.spouseInfo?.contact?.contactId ?? null],
          telephone: [data?.spouseInfo?.contact?.telephone ?? ''],
          workTelephone: [data?.spouseInfo?.contact?.workTelephone ?? ''],
          mobile: [data?.spouseInfo?.contact?.mobile ?? ''],
          email: [data?.spouseInfo?.contact?.email ?? ''],
          mobtCode: [
            data?.spouseInfo?.contact?.mobtCode ?? this.defaultIsdCodeValue,
          ],
        }),
      }),
      emergencyContactInfo: this.fb.group({
        emergencyContactId: [
          data?.emergencyContactInfo?.emergencyContactId ?? null,
        ],
        prefixId: [data?.emergencyContactInfo?.prefixId ?? ''],
        prefixValue: [data?.emergencyContactInfo?.prefixValue ?? ''],
        firstName: [data?.emergencyContactInfo?.firstName ?? ''],
        middleName: [data?.emergencyContactInfo?.middleName ?? ''],
        lastName: [data?.emergencyContactInfo?.lastName ?? ''],
        relationshipId: [data?.emergencyContactInfo?.relationshipId ?? ''],
        relationshipValue: [
          data?.emergencyContactInfo?.relationshipValue ?? '',
        ],

        contact: this.fb.group({
          contactId: [data?.emergencyContactInfo?.contact?.contactId ?? null],
          telephone: [data?.emergencyContactInfo?.contact?.telephone ?? ''],
          workTelephone: [
            data?.emergencyContactInfo?.contact?.workTelephone ?? '',
          ],
          mobile: [data?.emergencyContactInfo?.contact?.mobile ?? ''],
          email: [data?.emergencyContactInfo?.contact?.email ?? ''],
          fax: [data?.emergencyContactInfo?.contact?.fax ?? ''],
          whatsappNo: [data?.emergencyContactInfo?.contact?.whatsappNo ?? ''],
          alternativeNumber: [
            data?.emergencyContactInfo?.contact?.alternativeNumber ?? '',
          ],
          residencePhone: [
            data?.emergencyContactInfo?.contact?.residencePhone ?? '',
          ],
          mobtCode: [
            data?.emergencyContactInfo?.contact?.mobtCode ??
              this.defaultIsdCodeValue,
          ],
          waptCode: [
            data?.emergencyContactInfo?.contact?.waptCode ??
              this.defaultIsdCodeValue,
          ],
          altCode: [
            data?.emergencyContactInfo?.contact?.altCode ??
              this.defaultIsdCodeValue,
          ],
          statementViaId: [
            data?.emergencyContactInfo?.contact?.statementViaId ?? '',
          ],
          address: this.fb.array(
            data?.emergencyContactInfo?.contact?.address?.map((addr: any) =>
              this.createEmergencyContactAddressGroup(addr),
            ) || [this.createEmergencyContactAddressGroup()],
          ),
        }),
      }),
      contact: this.fb.group({
        email: [data?.contact ? data?.contact.email : ''],
        mobile: [data?.contact ? data?.contact?.mobile : ''],
        mobtCode: [
          data ? parseInt(data?.contact?.mobtCode) : this.defaultIsdCodeValue,
        ],
        alternativeNumber: [
          data?.contact ? data?.contact.alternativeNumber : '',
        ],
        altCode: [
          data ? parseInt(data?.contact?.altCode) : this.defaultIsdCodeValue,
        ],
        whatsappNo: [data?.contact ? data?.contact?.whatsappNo : ''],
        waptCode: [
          data ? parseInt(data?.contact?.waptCode) : this.defaultIsdCodeValue,
        ],
        telephone: [data?.contact ? data?.contact?.telephone : ''],
        workTelephone: [data?.contact ? data?.contact?.workTelephone : ''],
        fax: [data?.contact ? data?.contact?.fax : ''],
        statementViaId: [data?.contact ? data?.contact?.statementViaId : ''],
        address: this.fb.array([]),
      }),
    });

    const docArray = formGroup.get('documentId') as FormArray;
    docArray.push(this.createDocumentGroup(0));
    return formGroup;
    console.log(this.customerDetailsForm, 'formgroup');
  }

  get customer(): FormArray {
    return this.customerDetailsForm.get('customer') as FormArray;
  }

  getSpouseInfo(index: number): FormGroup {
    return this.customer.at(index).get('spouseInfo') as FormGroup;
  }

  getSpouseContactDetails(index: number): FormGroup {
    return this.getSpouseInfo(index).get('contact') as FormGroup;
  }

  getEmergencyContactInfo(index: number): FormGroup {
    return this.customer.at(index).get('emergencyContactInfo') as FormGroup;
  }

  getEmergencyContactDetails(index: number): FormGroup {
    return this.getEmergencyContactInfo(index).get('contact') as FormGroup;
  }

  getEmergencyContactAddress(index: number): FormArray {
    return this.getEmergencyContactDetails(index).get('address') as FormArray;
  }

  getCustomerContactDetails(index: number): FormGroup {
    return this.customer.at(index)?.get('contact') as FormGroup;
  }

  async addCustomer(i: number, data?: any) {
    const customerGroup = this.newCustomer(data);
    this.customer.push(customerGroup);
    this.addAddress(i, data?.contact?.address?.[0] ?? {});

    const maritalControl = customerGroup.get('maritalStatusId');
    const maritalId = maritalControl?.value;

    const isMarried =
      this.maritalStatusArray
        .find((item) => item.id === maritalId)
        ?.values?.toLowerCase() === 'married';

    const hasSpouseInfo =
      !!data?.spouseInfo?.firstName || !!data?.spouseInfo?.prefixId;

    this.showSpouseSection[i] = isMarried || hasSpouseInfo;

    maritalControl?.valueChanges.subscribe((newId: number) => {
      const status = this.maritalStatusArray
        .find((item) => item.id === newId)
        ?.values?.toLowerCase();
      this.showSpouseSection[i] = status === 'married';
    });
  }

  addAddress(i: any, address?: any) {
    const jk = this.customer.at(i).get('contact') as FormGroup;
    const pk = jk.get('address') as FormArray;
    const addressArrayControl = pk;
    addressArrayControl.push(
      this.fb.group({
        livingAddressSince: [
          address?.livingAddressSince ?? '',
          Validators.required,
        ],
        address1: [address?.address1 ?? '', [Validators.required]],
        address2: [address?.address2 ?? '', [Validators.required]],
        residenceType: [address?.residenceType ?? '', [Validators.required]],
        countryName: [address?.countryName ?? ''],
        pincode: [address?.pincode ?? '', [Validators.required]],
        stateName: [address?.stateName ?? ''],
        cityId: [address?.cityId ?? ''],
        cityName: [address?.cityName ?? ''],
      }),
    );
  }

  addEmergencyContactAddress(index: number, address?: any): void {
    const addressArray = this.getEmergencyContactAddress(index);
    addressArray.push(this.createEmergencyContactAddressGroup(address));
  }

  // Document Form Group
  createDocumentGroup(doc: any): FormGroup {
    return this.fb.group({
      docIds: [doc?.docIds || []],
      documentNumber: [doc?.documentNumber ?? '', Validators.required],
      issueDate: [doc?.issueDate ?? '', Validators.required],
      expiryDate: [doc?.expiryDate ?? '', Validators.required],
      countryOfIssue: [doc?.countryOfIssue ?? '', Validators.required],
    });
  }
  // Pincode Search Popup
  pincodeExpansion(
    customerIndex: number,
    addressType: 'customer' | 'emergency' = 'customer',
  ) {
    const dialogRef = this.dialog.open(ReusablePincodePopupComponent, {
      width: '60%',
      disableClose: true,
      panelClass: 'dialog-class',
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        if (addressType === 'customer') {
          // Handle customer address
          const customerAddress = this.customer
            .at(customerIndex)
            .get('contact.address') as FormArray;
          const addressControl = customerAddress.controls[0];
          addressControl?.patchValue(res);
          addressControl?.get('countryName')?.patchValue(res.countryName);
        } else {
          // Handle emergency contact address

          const emergencyAddress =
            this.getEmergencyContactAddress(customerIndex);

          if (emergencyAddress.controls[0]) {
            emergencyAddress.controls[0].patchValue(res);
            emergencyAddress.controls[0]
              .get('countryName')
              ?.patchValue(res.countryName);
          } else {
            // If no address exists, add one
            this.addEmergencyContactAddress(customerIndex, res);
          }
        }
      }
    });
  }

  // To check the Mobilelength according to isdCode
  checkMobileLength(value: any, contactGroup: FormGroup, controlName: string) {
    if (!contactGroup) {
      return;
    }
    const countryCode = this.countriesIsdCodes?.find(
      (resp: any) => resp.countryTelIsdCode === Number(value),
    );
    if (countryCode) {
      this.maxMobileLength = countryCode?.mobileLength;
      const control = contactGroup.get(controlName);
      if (control) {
        const validators = [
          Validators.maxLength(this.maxMobileLength),
          Validators.minLength(this.maxMobileLength),
        ];
        if (controlName === 'mobile') {
          validators.unshift(Validators.required);
        }
        control.setValidators(validators);
        control.updateValueAndValidity();
      }
    }
  }

  getExpDateMin() {
    const currentDate = new Date(this.todayDate);
    currentDate.setDate(currentDate.getDate() + 1);
    return currentDate;
  }

  handleSubmit() {
    const customerData = this.customer.controls.map((customerGroup, index) => {
      const customer = customerGroup.value;

      const maritalStatus = this.maritalStatusArray
        .find((item: GenericValueData) => item.id === customer.maritalStatusId)
        ?.values?.toLowerCase();

      const isMarried = maritalStatus === 'married';

      const formattedCustomer = {
        ...customer,
        dateOfBirth: pluckOnlyDate(customer.dateOfBirth),
        primaryCustomer: index === 0,
        spouseInfo: isMarried
          ? {
              ...customer.spouseInfo,
              dateOfBirth: pluckOnlyDate(customer.spouseInfo?.dateOfBirth),
            }
          : undefined,
      };

      if (!isMarried) {
        delete formattedCustomer.spouseInfo;
      }

      return formattedCustomer;
    });

    const payload = {
      originationId: this.originationId,
      screenCode: 460,
      customerInfo: customerData,
    };

    console.log(payload, 'Final Payload');

    return this.loanService.savePersonalDetails(payload).pipe(
      tap((res) => {
        const customerInfo = res?.data?.customerInfo;
        if (
          customerInfo &&
          customerInfo.length > 0 &&
          customerInfo[0]?.custStagingId
        ) {
          this.sessionStorageService.setCustomerStagingId(
            customerInfo[0]?.custStagingId,
          );
        }
      }),
      map((res) =>
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

  goBack() {
    console.log('skjdf');
  }

  // EmergencyContactAddressGroup
  private createEmergencyContactAddressGroup(address?: any): FormGroup {
    const group = this.fb.group({
      addressId: [address?.addressId ?? null],
      address1: [address?.address1 ?? '', Validators.required],
      address2: [address?.address2 ?? '', Validators.required],
      cityName: [address?.cityName ?? '', Validators.required],
      stateName: [address?.stateName ?? ''],
      countryName: [address?.countryName ?? ''],
      pincode: [address?.pincode ?? '', Validators.required],
      cityId: [address?.cityId ?? ''],
      residenceType: [address?.residenceType ?? '', Validators.required],
      residenceTypeValue: [address?.residenceTypeValue ?? ''],
    });
    // This ensures validators are processed immediately
    group.updateValueAndValidity();
    return group;
  }
}
