import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SignaturePopupComponent } from './signature-popup/signature-popup.component';
import { DmsService } from '@onerumango/utils';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-digital-signature',
  templateUrl: './digital-signature.component.html',
  styleUrls: ['./digital-signature.component.scss'],
})
export class DigitalSignatureComponent {
  customerStagingId: number | undefined;
  signatureForm!: FormGroup;
  constructor(
    private dialog: MatDialog,
    private dmsService: DmsService,
    private loanService: LoanService,
    private sessionStorageService: SessionStorageService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.buildSignatureForm();
  }
  buildSignatureForm() {
    this.signatureForm = this.fb.group({
      signatureId: this.fb.array([]),
    });
    this.signatureForm.valueChanges.subscribe((res: any) => {
      console.log(res);
    });
  }
  addSignature(data: any): FormGroup {
    console.log('DATA ', data);
    return this.fb.group({
      signatureId: [data?.documentId ?? ''],
      uuid: [data?.uuid ?? ''],
    });
  }
  openSignPopup(): void {
    const dialogRef = this.dialog.open(SignaturePopupComponent, {
      height: '65%',
      width: '50%',
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      console.log(res);
      if (res?.result) {
        this.uploadSignature(res?.result);
      }
    });
  }

  uploadSignature(res: any) {
    const base64Data = res.split(',')[1];
    const contentType = 'image/jpeg';
    const fileName = 'Signature_2_1.jpeg';

    const byteCharacters = atob(base64Data);
    const byteNumbers = Array.from(byteCharacters, (char) =>
      char.charCodeAt(0),
    );
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: contentType });
    const file = new File([blob], fileName, { type: contentType });

    const formData = new FormData();
    formData.append('file', file);
    formData.append(
      'data',
      JSON.stringify({
        documentType: 'Signature',
        documentNumber: '',
        documentSide: 1,
        fileName,
        fileType: contentType,
        verificationType: 'kyc',
      }),
    );

    this.dmsService
      .uploadSignaturewithEvent(formData)
      .subscribe((event: any) => {
        if (event.type === HttpEventType.Response) {
          const res = event.body;

          const exists = this.signatureArray.value.some(
            (item: any) => item.signatureId === res.documentId,
          );

          if (!exists) {
            this.signatureArray.push(this.addSignature(res));
            console.log('UPLOAD res', res);
          } else {
            console.warn('Duplicate prevented');
          }
        } else {
          console.log('Progress event:', event);
        }
        this.cdr.detectChanges();
      });
  }
  get signatureArray(): FormArray {
    return this.signatureForm.get('signatureId') as FormArray;
  }
  deleteSignatureAt(index: any) {
    this.signatureArray.removeAt(index);
  }
  submitForm() {
    console.log('Form submitted');
  }
  // Call this on final submit button click
  saveSignature(): void {
    if (!this.signatureArray?.length) {
      console.warn('No uploaded signature to save.');
      return;
    }

    const payload = {
      signatureId: this.signatureArray.value,
      custStagingId: this.sessionStorageService.getCustomerStagingId(),
    };

    this.loanService.saveSignature(payload).subscribe((res) => {
      console.log('Signature saved to loan service:', res);
    });
  }
}
