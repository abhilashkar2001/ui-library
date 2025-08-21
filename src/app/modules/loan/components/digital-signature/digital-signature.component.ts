import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SignaturePopupComponent } from './signature-popup/signature-popup.component';
import { DmsService } from '@onerumango/utils';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { tap, map, catchError, of } from 'rxjs';
import { BranchService } from 'app/modules/origination/modules/origination-external-callback/digital-sign/sign-now-popup/branch.service';

@Component({
  selector: 'app-digital-signature',
  templateUrl: './digital-signature.component.html',
  styleUrls: ['./digital-signature.component.scss'],
})
export class DigitalSignatureComponent implements OnInit {
  customerStagingId: number | undefined;
  signatureForm!: FormGroup;
  constructor(
    private dialog: MatDialog,
    private dmsService: DmsService,
    private loanService: LoanService,
    private sessionStorageService: SessionStorageService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private branchService: BranchService,
  ) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.customerStagingId = this.sessionStorageService.getCustomerStagingId();
    this.buildSignatureForm();
    this.fetchSignature();
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
      documentName: [data?.fileName ?? ''],
      isESign: [data?.isESign ?? null],
    });
  }
  openSignPopup(): void {
    const dialogRef = this.dialog.open(SignaturePopupComponent, {
      height: 'auto',
      width: '50%',
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      console.log(res);
      if (res?.result?.uuid) {
        this.signatureArray.push(this.addSignature(res?.result));
        this.cdr.detectChanges();
      } else if (res?.result) {
        this.uploadSignature(res?.result, res?.isESign);
      }
    });
  }
  sendLink() {}
  uploadSignature(base64String: string, isESign?: boolean | undefined) {
    const base64Data = base64String.split(',')[1] ?? '';
    const contentType = base64String.match(/data:(.*?);/)?.[1] || 'image/jpeg';
    const fileExtension = contentType.split('/')[1] || 'jpeg';
    const fileName = `Signature_${Date.now()}.${fileExtension}`;

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
            this.signatureArray.push(this.addSignature({ ...res, isESign }));
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

  fetchSignature() {
    if (!this.customerStagingId) return;
    this.branchService
      .fetchCustomerSign(this.customerStagingId)
      .subscribe((res: any) => {
        res?.data?.forEach((item: any) => {
          this.signatureArray.push(this.addSignature(item));
        });
        this.cdr.detectChanges();
      });
  }

  deleteSignatureAt(index: any) {
    this.signatureArray.removeAt(index);
  }
  submitForm() {
    console.log('Form submitted');
    return this.saveSignature().toPromise();
  }
  // Call this on final submit button click
  saveSignature() {
    if (!this.signatureArray?.length) {
      console.warn('No uploaded signature to save.');
      return of('failure' as const);
    }
    const signatureIdsOnly = this.signatureArray.value.map(
      (item: any) => item.signatureId,
    );
    const payload = {
      signatureId: signatureIdsOnly,
      customerStagingId: this.customerStagingId,
    };

    return this.loanService.saveSignature(payload).pipe(
      tap((res: any) => {
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
}
