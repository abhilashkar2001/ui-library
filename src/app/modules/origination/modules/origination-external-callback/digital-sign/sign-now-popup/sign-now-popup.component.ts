import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { catchError, map, of, Subscription } from 'rxjs';
import { BranchService } from './branch.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { SignPadComponent } from '../sign-pad/sign-pad.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-sign-now-popup',
  templateUrl: './sign-now-popup.component.html',
  styleUrls: ['./sign-now-popup.component.scss'],
})
export class SignNowPopupComponent implements OnInit {
  @ViewChild('signPadRef', { static: false })
  signPadComponent: SignPadComponent | any;
  signatureImg: any;
  isSign = true;
  radioFlag = 'digitan-sign';
  signaturePadOptions: any = {
    minWidth: 2,
    canvasWidth: 700,
    canvasHeight: 300,
    penColor: 'black',
    backgroundColor: 'white',
  };
  selectedIndex: number | any;
  uploadingFile: string | any;
  isUploading = false;
  diasableDone = true;
  percentDone: number | any;
  uploadSuccess: boolean | any;
  requestSubscription: Subscription | any;
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
    private branchService: BranchService,
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
  ngAfterViewInit() {}

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
    this.branchService
      .saveUploadSignature(docPayload)
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
    if (event.type === HttpEventType.UploadProgress) {
      this.percentDone = Math.round((100 * event.loaded) / event.total);
    } else if (event.type === HttpEventType.Response) {
      // Upload complete
      this.percentDone = 0;
      this.isUploading = false;
      this.uploadSuccess = true;
      this.dialogRef.close({
        result: event?.body?.data,
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
   * Method for Removing Image
   */

  removeimage() {
    document.querySelector('#imgforped')?.classList.add('hidden');
  }
  /**
   * Draw Start Method
   */
  drawStart() {
    document.querySelector('#imgforped')?.classList.add('hidden');
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
        this.uploadDocument();
      };
    } catch (error) {}
  }

  /**
   * File Upload Method for uplaoding the file
   * @param file
   */
  fileUpload(file: any) {
    this.isUploading = true;
    this.requestSubscription = this.branchService
      .uploadAndProgress(file)
      .subscribe((event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.percentDone = Math.round((100 * event.loaded) / event.total);
        } else if (event instanceof HttpResponse) {
          this.uploadSuccess = true;
          this.percentDone = 0;
          this.isUploading = false;
          this.cdr.markForCheck();
        }
      });
  }

  onFileDropped(event: any) {
    this.file = event;
    this.isStart = true;
    this.isUploading = false;
    this.signImg = true;
  }

  deleteFile() {
    this.isStart = !this.isStart;
    this.file = null;
    this.signImg = null;
  }
}
