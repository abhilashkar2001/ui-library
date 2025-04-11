import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Data } from '@angular/router';
import { IcHttpResponseModel } from '@onerumango/utils';
import {
  GenericValueData,
  GenericValueInfoModel,
} from 'app/shared/models/generic-value.model';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

@Component({
  selector: 'app-business-details',
  templateUrl: './business-details.component.html',
  styleUrls: ['./business-details.component.scss'],
})
export class BusinessDetailsComponent implements OnInit {
  @Output() CustomSubmit = new EventEmitter<Data>();
  @Output() backEvent = new EventEmitter<Data>();
  businessDetailsForm!: FormGroup;
  industryTypeList: GenericValueData[] = [];
  staticData = {
    INDUSTRYTYPE: [],
  };
  originationId!: number;

  constructor(
    private fb: FormBuilder,
    private sessionStorage: SessionStorageService,
    private loanService: LoanService,
    private genericService: GenericValueService,
  ) {}

  ngOnInit() {
    this.originationId = this.sessionStorage.getOriginationId();
    this.buildBusinessForm();
    this.fetchGenericValue();
    if (this.originationId) {
      this.getBusinessDetailsById();
    }
  }

  getBusinessDetailsById() {
    this.loanService
      .getCollateralDetailsId(this.originationId)
      .subscribe((res: any) => {
        if (res?.statusCode == 200 || res?.statusCode == 201) {
          this.businessDetailsForm.patchValue(res?.data);
        }
      });
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

  buildBusinessForm() {
    this.businessDetailsForm = this.fb.group({
      businessName: [''],
      natureOfBusinessId: [20],
      yearsOfOperation: [''],
      typeOfService: [''],
      monthlyTurnover: [''],
      aveStockLevel: [''],
      contact: this.fb.group({
        telephone: [''],
        address: this.fb.array([this.buildAddressGroup()]),
      }),
    });
  }

  get contact() {
    return this.businessDetailsForm.get('contact') as FormGroup;
  }

  get address(): FormArray {
    return this.contact.get('address') as FormArray;
  }

  buildAddressGroup(): FormGroup {
    return this.fb.group({
      address1: [''],
    });
  }

  saveBusinessDetails() {
    if (!this.businessDetailsForm.valid) {
      return;
    }
    const payload = {
      originationModel: {
        originationId: this.sessionStorage.getOriginationId(),
      },
      businessDetailModel: {
        ...this.businessDetailsForm.value,
      },
    };
    this.loanService.saveBusinessDetails(payload).subscribe((res) => {
      if (res.statusCode === 200) {
        this.CustomSubmit.emit({ isNext: true });
      }
    });
  }

  onBack() {
    this.backEvent.emit();
  }
}
