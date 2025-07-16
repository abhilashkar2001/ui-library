import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateTimeService } from '@onerumango/utils';
import {
  GenericValueData,
  GenericValueInfoModel,
} from 'app/shared/models/generic-value.model';
import { CountryService } from 'app/shared/services/country-service';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { IcHttpResponseModel } from '@onerumango/utils';
import { tap, map, catchError, of } from 'rxjs';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

@Component({
  selector: 'app-business-details',
  templateUrl: './business-details.component.html',
  styleUrls: ['./business-details.component.scss'],
})
export class BusinessDetailsComponent implements OnInit {
  businessDetailsForm!: FormGroup;
  dateFormat!: string;
  staticData = {
    COMPANYTYPE: [],
    NATUREOFBUSINESS: [],
    SEGMENT: [],
  };

  businessIntensityArr: any[] = [
    { label: 'Captial', value: true },
    { label: 'Labour', value: false },
  ];
  companyTypeArr: GenericValueData[] = [];
  natureOfBusinessArr: GenericValueData[] = [];
  segmentArr: GenericValueData[] = [];
  countryArr: any[] = [];
  parentCompanyArr: any[] = [];
  originationId!: number;
  category!: string | null;

  constructor(
    private fb: FormBuilder,
    private genericService: GenericValueService,
    private dateService: DateTimeService,
    private loanService: LoanService,
    private countryService: CountryService,
    private sessionStorageService: SessionStorageService,
  ) {
    this.category = this.sessionStorageService.getItem('category');
  }

  ngOnInit() {
    this.originationId = this.sessionStorageService.getOriginationId();
    this.dateFormat = this.dateService?.format.toLocaleLowerCase();
    this.fetchGenericValue();
    this.fetchParentCompany();
    this.fetchCountry();
    this.buildBusinessDetailForm();
    this.getBusinessDetailsById();
  }

  fetchGenericValue() {
    this.genericService
      .loadGenericValue(Object.keys(this.staticData))
      .subscribe((res: IcHttpResponseModel<GenericValueInfoModel>) => {
        if (res?.statusCode == 200 || res?.statusCode == 201) {
          this.companyTypeArr = res?.data?.['COMPANYTYPE'] ?? [];
          this.natureOfBusinessArr = res?.data?.['NATUREOFBUSINESS'] ?? [];
          this.segmentArr = res?.data?.['SEGMENT'] ?? [];
        }
      });
  }

  fetchCountry() {
    this.countryService.getCountries().subscribe((resp) => {
      if (resp) {
        this.countryArr = resp?.data;
      }
    });
  }

  getBusinessDetailsById() {
    this.loanService
      .getBusinessDetailsById(this.originationId)
      .subscribe((res: any) => {
        if (res?.statusCode == 200 || res?.statusCode == 201) {
          this.businessDetailsForm.patchValue(res?.data[0]);
        }
      });
  }

  fetchParentCompany() {
    this.loanService.fetchParentScreen().subscribe((resp: any) => {
      if (resp.data.length > 0) {
        this.parentCompanyArr = resp?.data;
      }
    });
  }

  buildBusinessDetailForm() {
    this.businessDetailsForm = this.fb.group({
      businessId: [''],
      businessName: ['', Validators.required],
      companyTypeId: [''],
      natureOfBusinessId: ['', Validators.required],
      segmentId: [''],
      noOfDirectors: ['', Validators.required],
      countryOfIncorporationName: ['', Validators.required],
      dateOfIncorporation: ['', Validators.required],
      registrationNumber: ['', Validators.required],
      tinNumber: ['', Validators.required],
      sourceOfIncomeId: [''],
      businessIntencity: [true],
      customerDescription: [''],
      descriptionOfBusiness: [''],
      yearsOfOperation: [''],
      monthlyTurnover: [''],
      aveStockLevel: [''],
      parentCompanyId: [null],
      contact: this.fb.group({
        telephone: [''],
        address: this.fb.array([this.buildAddressGroup()]),
      }),
    });
  }

  buildAddressGroup(): FormGroup {
    return this.fb.group({
      address1: ['', Validators.required],
    });
  }

  get contact() {
    return this.businessDetailsForm.get('contact') as FormGroup;
  }

  get address(): FormArray {
    return this.contact.get('address') as FormArray;
  }

  // save business details
  handleSubmit() {
    const payload = {
      originationModel: {
        originationId: this.originationId,
      },
      screenCode: 498,
      businessDetailModel: this.businessDetailsForm.value,
    };

    return this.loanService.saveBusinessDetails(payload).pipe(
      tap((res) => {
        console.log(res);
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
}
