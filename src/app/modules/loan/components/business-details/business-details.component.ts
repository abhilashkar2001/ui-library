import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateTimeService } from '@onerumango/utils';
import {
  GenericValueData,
  GenericValueInfoModel,
} from 'app/shared/models/generic-value.model';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { IcHttpResponseModel } from '@onerumango/utils';

@Component({
  selector: 'app-business-details',
  templateUrl: './business-details.component.html',
  styleUrls: ['./business-details.component.scss'],
})
export class BusinessDetailsComponent implements OnInit {
  businessDetailsForm!: FormGroup;
  industryTypeList: GenericValueData[] = [];
  dateFormat!: string;
  staticData = {
    INDUSTRYTYPE: [],
  };
  businessIntensityArr: any[] = [
    { label: 'Captial', value: true },
    { label: 'Labour', value: false },
  ];

  constructor(
    private fb: FormBuilder,
    private genericService: GenericValueService,
    private dateService: DateTimeService,
  ) {}

  get contact() {
    return this.businessDetailsForm.get('contact') as FormGroup;
  }

  get address(): FormArray {
    return this.contact.get('address') as FormArray;
  }

  ngOnInit() {
    this.dateFormat = this.dateService?.format.toLocaleLowerCase();
    this.fetchGenericValue();
    this.buildBusinessDetailForm();
  }

  fetchGenericValue() {
    this.genericService
      .loadGenericValue(Object.keys(this.staticData))
      .subscribe((res: IcHttpResponseModel<GenericValueInfoModel>) => {
        if (res?.statusCode == 200 || res?.statusCode == 201) {
          this.industryTypeList = res?.data?.['INDUSTRYTYPE'] ?? [];
        }
      });
  }

  // Build form
  buildBusinessDetailForm() {
    this.businessDetailsForm = this.fb.group({
      businessName: ['', Validators.required],
      companyTypeId: [''],
      natureOfBusinessId: ['', Validators.required],
      segmentId: [''],
      noOfDirectors: ['', Validators.required],
      countryOfIncorporation: ['', Validators.required],
      dateOfIncorporation: ['', Validators.required],
      registrationNumber: ['', Validators.required],
      tinNumber: ['', Validators.required],
      sourceOfIncome: [''],
      businessIntensity: [''],
      customerDescription: [''],
      descriptionofBusiness: [''],
      parentCompany: [''],
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
}
