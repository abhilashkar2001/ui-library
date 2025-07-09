import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { SidenavService } from 'app/shared/services/sidenav.service';

@Component({
  selector: 'app-add-collateral',
  templateUrl: './add-collateral.component.html',
  styleUrls: ['./add-collateral.component.scss'],
})
export class AddAccountCollateralComponent implements OnInit {
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
  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private sideNavService: SidenavService,
  ) {}

  ngOnInit(): void {
    this.buildCollateral();
    console.log(this.data);
  }

  buildCollateral() {
    this.collateralForm = this.fb.group({
      collateralName: [''],
      ownership: [''],
      description: [''],
      document: this.fb.array([]),
    });
  }

  document(): FormArray {
    return this.collateralForm?.get('document') as FormArray;
  }

  addDocument(data?: any) {
    this.document().push(this.documentUploadArray(data));
  }

  documentUploadArray(data?: any): FormGroup {
    const docType = data?.values ?? (data?.document || '');
    return this.fb.group({
      documentNumber: [''],
      documentType: [docType],
      fileInfo: [''],
      docIds: [''],
    });
  }

  onFileDropped(event: any) {
    this.file = event;
    this.fileName = this.file.name;
    this.signImg = true;
    this.handleUploadEvent(event);
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
        this.handleUploadEvent(this.signImg);
        this.uploadDocument();
      };
    } catch (error) {
      console.log(error);
    }
    this.cdr.detectChanges();
  }

  handleUploadEvent(event: any) {
    this.percentDone = 0;
    console.log(event);
    // this.dialogRef.close({
    //   result: event,
    //   title: 'Signature',
    // });
  }

  uploadDocument() {
    const docPayload = new FormData();
    const data = {
      fileName: this.file?.name || 'collateral',
      fileType: this.file?.type,
    };
    docPayload.append('file', this.file);
    docPayload.append('data', JSON.stringify(data));
    docPayload.append('module', 'collateral');
    // docPayload.append('signatureId', this.sinatureId);
    // this.branchService
    //   .saveUploadSignature(docPayload)
    //   .pipe(
    //     map((event: any) => this.handleUploadEvent(event)),
    //     catchError((err) => {
    //       this.fileUploadFailed = true;
    //       return of(err);
    //     }),
    //   )
    //   .subscribe();
  }

  addCollateral() {
    console.log(this.collateralForm?.value);
    this.sideNavService.close();
  }
}
