import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Data } from '@angular/router';
import { IcHttpResponseModel } from '@onerumango/utils';
import { GenericValueInfoModel } from 'app/shared/models/generic-value.model';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

@Component({
  selector: 'app-collateral-details',
  templateUrl: './collateral-details.component.html',
  styleUrls: ['./collateral-details.component.scss'],
})
export class CollateralDetailsComponent implements OnInit {
  @Output() CustomSubmit = new EventEmitter<Data>();
  @Output() backEvent = new EventEmitter<Data>();
  collateralDetailsForm!: FormGroup;
  ownershipStatus = [
    { label: 'Self', value: true },
    { label: 'Others', value: false },
  ];
  loanTypeList: any[] = [];
  originationId!: number;
  staticData = {
    LOANTYPE: [],
  };
  screenCode: number | undefined;
  constructor(
    private fb: FormBuilder,
    private sessionStorageService: SessionStorageService,
    private loanService: LoanService,
    private genericService: GenericValueService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.originationId = this.sessionStorageService.getOriginationId();
    this.screenCode = this.sessionStorageService.getCurrentScreenCode();
    this.buildCollateralForm();
    this.getCollateralDetails().push(this.collateralDetailsGroup('Credit'));
    this.getCollateralDetails().push(this.collateralDetailsGroup('Vaf'));
    this.fetchGenericValue();
    if (this.originationId) {
      this.getCollateralDetailsById();
    }
  }

  fetchGenericValue() {
    this.genericService
      .loadGenericValue(Object.keys(this.staticData))
      .subscribe((res: IcHttpResponseModel<GenericValueInfoModel>) => {
        if (res?.statusCode == 200 || res?.statusCode == 201) {
          this.loanTypeList = res?.data?.['LOANTYPE'] ?? [];
        }
      });
  }

  getCollateralDetailsById() {
    this.loanService
      .getCollateralDetailsId(this.originationId)
      .subscribe((res: any) => {
        if (res?.statusCode === 200 || res?.statusCode === 201) {
          const data = res.data[0];
          this.collateralDetailsForm.patchValue({
            percentageOfSecurityCover: data.percentageOfSecurityCover,
            effectiveDate: data.effectiveDate,
            expiryDate: data.expiryDate,
            totalAssetWorth: data.totalAssetWorth,
            loanTypeId: data.loanTypeId,
          });

          const details = data.collateralDetails ?? [];
          details.forEach((item: any, index: number) => {
            const group = this.getCollateralDetails().at(index);
            if (group) {
              group.patchValue(item);
            }
          });

          this.collateralDetailsForm
            .get('originationd')
            ?.setValue(this.originationId);
          this.collateralDetailsForm
            .get('screenCode')
            ?.setValue(this.screenCode);
        }
      });
  }

  buildCollateralForm() {
    this.collateralDetailsForm = this.fb.group({
      percentageOfSecurityCover: [''],
      effectiveDate: [''],
      expiryDate: [''],
      totalAssetWorth: [''],
      collateralDetails: this.fb.array([]),
      loanTypeId: [''],
      originationd: [this.originationId ?? ''],
      screenCode: [this.screenCode ?? ''],
    });
    this.cdr.detectChanges();
  }

  // Get collateral details form array
  getCollateralDetails(): FormArray {
    return this.collateralDetailsForm.get('collateralDetails') as FormArray;
  }

  get creditGroup(): FormGroup {
    return (
      (this.getCollateralDetails()?.at(0) as FormGroup) || this.fb.group({})
    );
  }

  get vafGroup(): FormGroup {
    return (
      (this.getCollateralDetails()?.at(1) as FormGroup) || this.fb.group({})
    );
  }

  collateralDetailsGroup(typeOfCollateral?: string) {
    return this.fb.group({
      description: [''],
      ownership: [''],
      assetMonetaryWorth: [''],
      typeOfCollateral: [typeOfCollateral],
    });
  }

  saveCollateralDetails() {
    const payload = { ...this.collateralDetailsForm.value };
    this.loanService.saveCollateralDetails(payload).subscribe((res: any) => {
      if (res?.statusCode == 200 || res?.statusCode == 201) {
        this.CustomSubmit.emit({ isNext: true });
      }
    });
  }

  onBack() {
    this.backEvent.emit();
  }
}
