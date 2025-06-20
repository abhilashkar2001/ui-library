import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState, LocaleData, selectLocaleData } from '@onerumango/utils';
import { PersonalDetailsConstant } from 'app/modules/origination/modules/dynamic-pages/common-personal-details/personal-details.constant';
import {
  GenericValueData,
  GenericValueInfoModel,
} from 'app/shared/models/generic-value.model';
import { CountryService } from 'app/shared/services/country-service';
import { GenericValueService } from 'app/shared/services/generic-value.service';
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
  maxMobileLength: any;
  isMarried = false;

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
    private genericValueService: GenericValueService,
    private store: Store<AppState>,
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
          mobtCode: [''],
          waptCode: [''],
          altCode: [''],
          statementViaId: [''],
          address: this.fb.array([]),
        }),
      }),

      contact: this.fb.group({
        email: [''],
        mobile: [''],
        mobtCode: [this.defaultIsdCodeValue],
        alternativeNumber: [''],
        altCode: [''],
        whatsappNo: [''],
        waptCode: [''],
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

  createDocumentGroup(doc: any): FormGroup {
    return this.fb.group({
      docIds: [doc?.docIds || []],
      documentNumber: [doc?.documentNumber ?? '', Validators.required],
      issueDate: [doc?.issueDate ?? '', Validators.required],
      expiryDate: [doc?.expiryDate ?? '', Validators.required],
      countryOfIssue: [doc?.countryOfIssue ?? '', Validators.required],
    });
  }
}
