import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SignPadComponent } from '../../../origination-external-callback/digital-sign/sign-pad/sign-pad.component';
import { catchError, map, of } from 'rxjs';
import { DmsService } from '@onerumango/utils';

@Component({
  selector: 'app-signature-popup-shared',
  templateUrl: './signature-popup-shared.component.html',
  styleUrls: ['./signature-popup-shared.component.scss'],
})
export class SignatureSharedPopupComponent {
  @ViewChild('signPadRef', { static: false })
  signPadComponent!: SignPadComponent;
  file: any;
  fileName: any;
  signImg: boolean | undefined;
  fileUploadFailed: boolean | undefined;
  isStart: boolean | undefined;
  percentDone: number | undefined;

  constructor(
    private cdr: ChangeDetectorRef,
    private dialogRef: MatDialogRef<SignatureSharedPopupComponent>,
    private dmsService: DmsService,
  ) {}

  signpadImage(event: any) {
    this.file = new File([event], 'E-sign.png', {
      type: 'png',
    });
    console.log(this.file);
    this.uploadDocument();
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
        this.handleUploadEvent(this.signImg);
        // this.uploadDocument();
      };
    } catch (error) {
      console.log(error);
    }
    this.cdr.detectChanges();
  }

  handleUploadEvent(event: any) {
    this.percentDone = 0;
    this.dialogRef.close({
      result: event,
      title: 'Signature',
    });
  }

  uploadDocument() {
    const docPayload = new FormData();
    const data = {
      fileName: this.file?.name || 'signature',
      fileType: this.file?.type || 'jpeg',
      verificationType: 'loan',
    };
    docPayload.append('file', this.file);
    docPayload.append('data', JSON.stringify(data));
    docPayload.append('module', 'signature');
    this.dmsService
      .uploadDocuments(docPayload)
      .pipe(
        map((event: any) => this.handleUploadEvent(event)),
        catchError((err) => {
          this.fileUploadFailed = true;
          return of(err);
        }),
      )
      .subscribe();
  }

  saveDigitalSign() {
    if (this.signPadComponent) {
      this.signPadComponent.saveSignature();
    }
  }
}
