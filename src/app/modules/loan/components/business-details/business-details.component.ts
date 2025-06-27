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

  constructor(
    private fb: FormBuilder,
    private genericService: GenericValueService,
    private dateService: DateTimeService,
    private loanService: LoanService,
    private countryService: CountryService,
  ) {}

  ngOnInit() {
    this.dateFormat = this.dateService?.format.toLocaleLowerCase();
    this.fetchGenericValue();
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
    this.loanService.getBusinessDetailsById(314).subscribe((res: any) => {
      if (res?.statusCode == 200 || res?.statusCode == 201) {
        this.businessDetailsForm.patchValue(res?.data[0]);
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
      parentCompanyId: [null],
      //   contact: this.fb.group({
      //     telephone: [''],
      //     address: this.fb.array([this.buildAddressGroup()]),
      //   }),
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
  onSaveBusinessDetails() {
    const payload = {
      originationModel: {
        originationId: 314,
      },
      screenCode: 498,
      businessDetailModel: this.businessDetailsForm.value,
    };

    this.loanService.saveBusinessDetails(payload).subscribe((resp) => {
      console.log(resp);
    });
  }
}
