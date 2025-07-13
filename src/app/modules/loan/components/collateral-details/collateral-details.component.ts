import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ContainerContextData,
  SidenavService,
} from 'app/shared/services/sidenav.service';
import { AddCollateralComponent } from './add-collateral/add-collateral.component';
import { MatSidenav } from '@angular/material/sidenav';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { catchError, map, of, tap } from 'rxjs';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { GenericValueInfoModel } from 'app/shared/models/generic-value.model';
import { GenericValueService } from 'app/shared/services/generic-value.service';
@Component({
  selector: 'app-collateral-details',
  templateUrl: './collateral-details.component.html',
  styleUrls: ['./collateral-details.component.scss'],
})
export class CollateralDetailsComponent implements OnInit {
  @ViewChild('sidenavPanel') sidenavPanel!: MatSidenav;
  @Input() screenCode: string | undefined;
  collateralForm: FormGroup | undefined;
  tableHeaders = [
    { key: 'collateralNameValue', label: 'Collateral Name' },
    { key: 'ownership', label: 'Ownership of the collateral' },
    { key: 'assetWorth', label: 'Asset Monetary Worth' },
    { key: 'description', label: 'Description of Collateral' },
    { key: 'document', label: 'Document Upload' },
    { key: 'action', label: 'Action' },
  ];
  originationId: number | undefined;
  genericValue: GenericValueInfoModel | undefined;
  staticData = {
    LOANTYPE: [],
  };

  constructor(
    private fb: FormBuilder,
    public sidenavService: SidenavService,
    private loanService: LoanService,
    private cdr: ChangeDetectorRef,
    private sessionStorageService: SessionStorageService,
    private genericValueService: GenericValueService,
  ) {}

  ngOnInit() {
    this.originationId = this.sessionStorageService.getOriginationId();
    this.buildCollateralForm();
    this.fetchGenericValues();
    this.fetchCollateralDetails();
    this.loanService.collateral$.subscribe((collateralData) => {
      if (collateralData) {
        if (collateralData.operation === 'update') {
          this.collateralDetails
            .at(collateralData.selectedDataIndex)
            .patchValue(collateralData.collateral);
        } else this.addCollateralDetails(collateralData.collateral);
        this.cdr.detectChanges();
      }
    });
  }

  buildCollateralForm(data?: any) {
    this.collateralForm = this.fb.group({
      id: [data?.id ?? ''],
      search: [''],
      securityCover: [data?.securityCover ?? '', Validators.required],
      totalAssetWorth: [data?.totalAssetWorth ?? ''],
      loanTypeId: [data?.loanTypeId ?? '', Validators.required],
      collateralDetails: this.fb.array([]),
    });
    console.log(this.collateralForm?.value);
    if (data?.collateralDetails?.length > 0) {
      data.collateralDetails.forEach((collateral: any) => {
        this.addCollateralDetails(collateral);
      });
    }
  }

  get collateralDetails() {
    return this.collateralForm?.get('collateralDetails') as FormArray;
  }

  addCollateralDetails(data?: any) {
    const collateralGroup = this.fb.group({
      id: [data?.id ?? ''],
      collateralNameValue: [data?.collateralNameValue ?? ''],
      collateralNameId: [data?.collateralNameId ?? ''],
      ownership: [data?.ownership ?? ''],
      description: [data?.description ?? ''],
      assetMonetaryWorth: [data?.assetMonetaryWorth ?? ''],
      documentId: this.fb.array([]),
    });
    if (data?.document?.length > 0)
      data.document.forEach((doc: any) => {
        this.addDocument(collateralGroup, doc);
      });
    return this.collateralDetails.push(collateralGroup);
  }

  get document(): FormArray {
    return this.collateralDetails?.get('documentId') as FormArray;
  }

  addDocument(collateralGroup: FormGroup, data?: any) {
    const newDoc = this.documentUploadArray(data);

    const documentArray = collateralGroup.get('documentId') as FormArray;
    if (documentArray) {
      documentArray.push(newDoc);
    }
  }

  documentUploadArray(data?: any) {
    return this.fb.group({
      documentId: [data?.documentId ?? ''],
      uuid: [data?.uuid ?? ''],
      documentName: [data?.fileName ?? ''],
      fileSize: [data?.fileSize ?? ''],
    });
  }

  openSidePanel(control: any, args?: any) {
    const contextData: ContainerContextData = {
      component: AddCollateralComponent,
      data: { ...control.value, ...args },
    };
    this.sidenavService.open(contextData);
  }

  editRow(event: any) {
    this.openSidePanel(this.collateralDetails, {
      operation: 'update',
      selectedDataIndex: event,
    });
  }

  deleteRow(event: any) {
    if (this.collateralDetails.at(event).get('id')?.value)
      this.loanService
        .deleteCollateralDetails(
          this.collateralDetails.at(event).get('id')?.value,
        )
        .subscribe((res) => {
          if (res?.statusCode == 200 || res?.statusCode == 201) {
            console.log('Collateral deleted successfully');
          }
        });
    this.collateralDetails.removeAt(event);
  }

  fetchGenericValues() {
    this.genericValueService
      .loadGenericValue(Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.genericValue = resp?.data;
        }
      });
  }

  fetchCollateralDetails() {
    if (this.originationId)
      this.loanService
        .getCollateralDetailsId(this.originationId)
        .subscribe((res) => {
          if (res?.statusCode == 200 || res?.statusCode == 201) {
            this.buildCollateralForm(res?.data);
          }
        });
  }

  handleSubmit() {
    if (this.collateralForm?.invalid) {
      this.collateralForm.markAllAsTouched();
      return;
    }
    const payload = { ...this.collateralForm?.value };
    payload.originationId = this.originationId;
    payload.screenCode = this.screenCode;
    delete payload.search;
    return this.loanService.saveCollateralDetails(payload).pipe(
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
    return this.handleSubmit()?.toPromise();
  }
}
