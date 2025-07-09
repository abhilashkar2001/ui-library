import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import { SignPadComponent } from '../sign-pad/sign-pad.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DmsService } from '@onerumango/utils';

@Component({
  selector: 'app-sign-now-popup',
  templateUrl: './sign-now-popup.component.html',
  styleUrls: ['./sign-now-popup.component.scss'],
})
export class SignNowPopupComponent implements OnInit {
  @ViewChild('signPadRef', { static: false })
  signPadComponent!: SignPadComponent;
  @ViewChild('fileSelect', { static: false })
  fileInput!: ElementRef<HTMLInputElement>;
  isSign = true;
  radioFlag = 'digitan-sign';
  selectedIndex: number | any;
  isUploading = false;
  percentDone: number | any;
  uploadSuccess: boolean | any;
  signImg: any;
  isStart = false;
  file: any;
  fileName: any;
  sinatureId: string | Blob | any;
  title: any;
  check: any;
  fileUploadFailed = false;

  constructor(
    private dialogRef: MatDialogRef<SignNowPopupComponent>,
    private cdr: ChangeDetectorRef,
    private dmsService: DmsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.title = data?.title;
    this.check = data?.check;
  }

  ngOnInit(): void {
    if (this.data?.check == 'Upload') {
      this.radioEvent('upload');
    } else {
      this.radioEvent('digitan-sign');
    }
    this.cdr.markForCheck();
  }

  signpadImage(event: any) {
    this.file = new File([event], 'E-sign.png', {
      type: 'png',
    });
    this.uploadDocument();
  }

  saveDigitalSign() {
    if (this.signPadComponent) {
      this.signPadComponent.saveSignature();
    }
  }

  saveSignUpload() {
    if (!this.file || !this.signImg) {
      return;
    }
    this.uploadDocument();
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
    docPayload.append('signatureId', this.sinatureId);
    this.isUploading = true;
    this.dmsService
      .uploadSignaturewithEvent(docPayload)
      .pipe(
        map((event: any) => this.handleUploadEvent(event)),
        catchError((err) => {
          this.fileUploadFailed = true;
          this.isUploading = false;
          return of(err);
        }),
      )
      .subscribe();
  }

  handleUploadEvent(event: any) {
    this.isUploading = true;
    this.uploadSuccess = true;
    if (event.type === HttpEventType.UploadProgress) {
      this.percentDone = Math.round((100 * event.loaded) / event.total);
    } else if (event.type === HttpEventType.Response) {
      this.percentDone = 0;
      this.isUploading = false;
      this.uploadSuccess = true;
      this.dialogRef.close({
        result: event?.body,
        title: this.title,
      });
    }
  }

  closeDialog() {
    if (this.signPadComponent) this.signPadComponent.clearCanvas();
    this.deleteFile();
    this.dialogRef.close(false);
  }

  /**
   * Radio Event Method for telling the event is either digit sign or not
   * @param event
   */

  radioEvent(event: any) {
    if (event == 'digitan-sign') {
      this.isSign = true;
      this.radioFlag = event;
    } else {
      this.isSign = false;
      this.radioFlag = event;
    }
  }

  /**
   * onFileSelect Method for selecting files
   * @param e
   */
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

  onFileDropped(event: any) {
    this.file = event;
    this.fileName = this.file.name;
    this.isStart = true;
    this.isUploading = false;
    this.signImg = true;
    this.handleUploadEvent(event);
  }

  deleteFile() {
    this.isStart = !this.isStart;
    this.file = null;
    this.signImg = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
