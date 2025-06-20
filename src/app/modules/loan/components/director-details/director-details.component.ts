import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState, LocaleData, selectLocaleData } from '@onerumango/utils';
import { PersonalDetailsConstant } from 'app/modules/origination/modules/dynamic-pages/common-personal-details/personal-details.constant';
import { ReusablePincodePopupComponent } from 'app/shared/components/reusable-pincode-popup/reusable-pincode-popup.component';
import {
  GenericValueData,
  GenericValueInfoModel,
} from 'app/shared/models/generic-value.model';
import { CountryService } from 'app/shared/services/country-service';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { OpenAccountService } from 'app/shared/services/open-service/open-account.service';
import { forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'app-director-details',
  templateUrl: './director-details.component.html',
  styleUrls: ['./director-details.component.scss'],
})
export class DirectorDetailsComponent implements OnInit {
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
  private localeData: LocaleData | undefined;
  subscriptions: Subscription[] = [];
  defaultIsdCodeValue: any;
  maxMobileLength!: number;
  isMarried = false;
  dobMinDate: Date | any;
  dobMaxDate: Date | any;
  dateFormat!: string;
  @Input() basisId: any;
  boundaries: any;
  todayDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
    private genericValueService: GenericValueService,
    private store: Store<AppState>,
    private dialog: MatDialog,
    private openApi: OpenAccountService,
  ) {}

  ngOnInit() {
    const localeData$ = this.store.select(selectLocaleData).subscribe((res) => {
      if (res) {
        this.localeData = res;
      }
    });
    this.subscriptions.push(localeData$);
    this.getAllRequisite();
    this.getGenericDetails();
    this.fetchBoundaries();
    this.buildPersonalDetailsForm();
  }

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

  // BuildPersonalDetailsForm
  buildPersonalDetailsForm() {
    this.customerDetailsForm = this.fb.group({
      customer: this.fb.array([]),
    });
    this.addCustomer(0);
    this.customer
      .at(0)
      .get('maritalStatusId')
      ?.valueChanges.subscribe((maritalId: number) => {
        console.log(maritalId);
        if (maritalId) {
          const status = this.maritalStatusArray
            .find((item: GenericValueData) => item.id === maritalId)
            ?.values.toLocaleLowerCase();
          const isMarried = status === 'married';
          this.isMarried = isMarried;
          console.log(status, 'status');
        }
      });
  }

  get customer(): FormArray {
    return this.customerDetailsForm.get('customer') as FormArray;
  }

  getDocumentIdArray(index: number): FormArray {
    return this.customer?.at(index)?.get('documentId') as FormArray;
  }

  newCustomer() {
    const formGroup = this.fb.group({
      customerId: '',
      customerNo: [''],
      custStagingId: null,
      onboardingStatus: [''],
      primaryCustomer: [false],
      prefixId: [''],
      firstName: [''],
      lastName: [''],
      dateOfBirth: [''],
      genderId: [''],
      nationality: [''],
      maritalStatusId: [''],
      countryOfResidence: [''],
      source: 'Website',
      kycStatus: '',
      documentId: this.fb.array([]),
      spouseInfo: this.fb.group({
        spouseDetilsId: [null],
        prefixId: [''],
        prefixValue: [''],
        firstName: [''],
        middleName: [''],
        lastName: [''],
        dateOfBirth: [''],
        employeeStatusId: [''],
        employeeStatusValue: [''],
        netIncome: [''],
        contact: this.fb.group({
          contactId: [null],
          telephone: [''],
          worktelephone: [''],
          mobile: [''],
          email: [''],
          mobtCode: [''],
        }),
      }),
      emergencyContactInfo: this.fb.group({
        emergencyContactId: [null],
        prefixId: [''],
        prefixValue: [''],
        firstName: [''],
        middleName: [''],
        lastName: [''],
        relationshipId: [''],
        relationshipValue: [''],
        contact: this.fb.group({
          contactId: [null],
          telephone: [''],
          worktelephone: [''],
          mobile: [''],
          email: [''],
          fax: [''],
          whatsappNo: [''],
          alternativeNumber: [''],
          residencePhone: [''],
          mobtCode: [this.defaultIsdCodeValue],
          waptCode: [this.defaultIsdCodeValue],
          altCode: [this.defaultIsdCodeValue],
          statementViaId: [''],
          address: this.fb.array([]),
        }),
      }),

      contact: this.fb.group({
        email: [''],
        mobile: [''],
        mobtCode: [this.defaultIsdCodeValue],
        alternativeNumber: [this.defaultIsdCodeValue],
        altCode: [this.defaultIsdCodeValue],
        whatsappNo: [],
        waptCode: [this.defaultIsdCodeValue],
        telephone: [''],
        worktelephone: [''],
        fax: [''],
        statementViaId: [''],
        address: this.fb.array([]),
      }),
    });

    const docArray = formGroup.get('documentId') as FormArray;
    docArray.push(this.createDocumentGroup(0));
    return formGroup;

    console.log(this.customerDetailsForm, 'formgroup');
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

  async addCustomer(i: any, data?: any) {
    await this.customer.push(this.newCustomer());
    this.addAddress(i, data ? data.contact?.address[0] : {});
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

  confirmCustomer() {
    console.log('confirm button');
  }

  goBack() {
    console.log('skjdf');
  }
}
