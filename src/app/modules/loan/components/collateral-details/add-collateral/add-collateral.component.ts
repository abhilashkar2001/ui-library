import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DmsService } from '@onerumango/utils';
import { GenericValueInfoModel } from 'app/shared/models/generic-value.model';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { SidenavService } from 'app/shared/services/sidenav.service';
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-add-collateral',
  templateUrl: './add-collateral.component.html',
  styleUrls: ['./add-collateral.component.scss'],
})
export class AddCollateralComponent implements OnInit {
  @Input() data: any;
  collateralForm: FormGroup | undefined;
  ownershipValues = [
    {
      label: 'Self',
      value: 'self',
    },
    {
      label: 'Others',
      value: 'others',
    },
  ];
  file: any;
  fileName: any;
  signImg: boolean | undefined;
  isStart: boolean | undefined;
  fileUploadFailed: boolean | undefined;
  percentDone = 0;
  genericValue: GenericValueInfoModel | undefined;
  staticData = {
    COLLATERALNAME: [],
  };

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private sideNavService: SidenavService,
    private loanService: LoanService,
    private dmsService: DmsService,
    private genericValueService: GenericValueService,
  ) {}

  ngOnInit(): void {
    this.buildCollateral();
    this.fetchGenericValues();
    console.log(this.data);
  }

  buildCollateral() {
    const selectedData = this.data[this.data?.selectedDataIndex];
    console.log(selectedData, this.data?.selectedDataIndex);
    this.collateralForm = this.fb.group({
      collateralNameValue: [selectedData?.collateralNameValue ?? ''],
      ownership: [selectedData?.ownership ?? ''],
      description: [selectedData?.description ?? ''],
      assetMonetaryWorth: [selectedData?.assetMonetaryWorth ?? ''],
      document: this.fb.array([]),
    });
  }

  get document(): FormArray {
    return this.collateralForm?.get('document') as FormArray;
  }

  addDocument(data?: any) {
    this.document.push(this.documentUploadArray(data));
  }

  documentUploadArray(data?: any): FormGroup {
    return this.fb.group({
      documentId: [data?.documentId ?? ''],
      uuid: [data?.uuid ?? ''],
      documentName: [data?.fileName ?? ''],
      fileSize: [data?.fileSize ?? ''],
    });
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

  setCollateralName(event: any) {
    if (this.genericValue?.['COLLATERALNAME']) {
      const collateralName = this.genericValue?.['COLLATERALNAME'].find(
        (item: any) => item.id === event,
      )?.values;
      this.collateralForm?.get('collateralNameValue')?.setValue(collateralName);
    }
  }

  onFileDropped(event: any) {
    this.file = event;
    this.fileName = this.file.name;
    this.signImg = true;
    this.addDocument(event);
  }

  onFileSelect(e: any) {
    this.fileUploadFailed = false;
    try {
      this.isStart = true;
      this.file = e.target.files[0];
      this.fileName = this.file.name;
      const fReader = new FileReader();
      fReader.readAsDataURL(this.file);
      fReader.onloadend = (_event: any) => {
        this.signImg = _event.target.result;
        console.log(this.signImg, this.file, this.fileName);
        this.uploadDocument();
      };
    } catch (error) {
      console.log(error);
    }
    this.cdr.detectChanges();
  }

  uploadDocument() {
    const docPayload = new FormData();
    const data = {
      fileName: this.file?.name || 'collateral',
      fileType: this.file?.type,
    };
    docPayload.append('file', this.file);
    docPayload.append('data', JSON.stringify(data));
    docPayload.append('module', 'signature');
    this.dmsService
      .uploadDocuments(docPayload)
      .pipe(
        map((event: any) => this.addDocument(event)),
        catchError((err) => {
          this.fileUploadFailed = true;
          return of(err);
        }),
      )
      .subscribe();
  }

  addCollateral() {
    console.log(this.collateralForm?.value);
    this.loanService.sendCollateralData({
      ...this.data,
      collateral: this.collateralForm?.value,
    });
    this.sideNavService.close();
  }

  close() {
    this.sideNavService.close();
  }
}
