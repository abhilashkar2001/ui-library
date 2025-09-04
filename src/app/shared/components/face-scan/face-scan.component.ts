import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'app/shared/services/common-service/common.service';
import { WebcamImage, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject, Subscription } from 'rxjs';
import * as faceapi from 'face-api.js';

@Component({
  selector: 'app-face-scan',
  templateUrl: './face-scan.component.html',
  styleUrls: ['./face-scan.component.scss'],
})
export class FaceScanComponent {
  scanning = false;
  multipleWebcamsAvailable = false;
  webcamImage!: WebcamImage | undefined;
  sysImage = '';
  private trigger: Subject<void> = new Subject<void>();
  private faceLoginSubscription: Subscription[] = [];
  faceInterval: any;
  face_scan_error = '';
  scanStartTime!: number;
  scanTimeout: any;
  MAX_SCAN_DURATION = 30000; // 30 seconds

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<FaceScanComponent>,
    private biometricSvc: CommonService,
  ) {}

  async ngOnInit() {
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      },
    );
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('../../assets/models'),
      await faceapi.nets.faceLandmark68Net.loadFromUri('../../assets/models'),
      await faceapi.nets.faceRecognitionNet.loadFromUri('../../assets/models'),
      await faceapi.nets.faceExpressionNet.loadFromUri('../../assets/models'),
    ]).then(() => {
      this.startFaceScan();
    });
  }

  captureImg(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.sysImage = webcamImage!.imageAsDataUrl;
  }

  getBlobFromData(image?: any) {
    const timestamp = new Date();
    const seconds = timestamp.getSeconds();
    fetch(image)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `${seconds}_FaceScan.png`, {
          type: 'image/png',
        });

        if (this.dialogData?.popType !== 'user') {
          this.checkFace(file);
        } else {
          this.uploadFace(file);
        }
      });
  }

  startFaceScan() {
    this.face_scan_error = '';
    this.scanStartTime = Date.now();
    this.scanning = true;
    this.startTimeoutTimer(); // Start 1-minute limit
    this.automaticCapture(); // Begin scan attempts
  }

  startTimeoutTimer() {
    this.scanTimeout = setTimeout(() => {
      this.face_scan_error = 'Face scan timed out. Please try again.';
      this.stopWebcam();
    }, this.MAX_SCAN_DURATION);
  }

  stopWebcam() {
    this.scanning = false;
    this.clearFaceScanIntervals();
  }

  clearFaceScanIntervals() {
    if (this.faceInterval) {
      for (let i = 1; i < this.faceInterval; i++) {
        clearTimeout(i);
      }
      clearTimeout(this.faceInterval);
    }
    if (this.scanTimeout) {
      clearTimeout(this.scanTimeout);
    }
  }

  async uploadFace(file: File) {
    const numberOfFaces = await this.detectFacesFromBlob(file);

    if (numberOfFaces == null) {
      this.face_scan_error = 'Unable to detect a face. Please try again.';
      this.faceIntervalMethod();
    } else if (numberOfFaces === 0) {
      this.face_scan_error =
        'No face detected. Please align properly with the frame.';
      this.faceIntervalMethod();
    } else if (numberOfFaces > 1) {
      this.face_scan_error =
        'More than one face detected. Only one person is allowed while scanning.';
      this.faceIntervalMethod();
    } else {
      this.face_scan_error = '';
      const form = new FormData();
      form.append('file', file);
      this.biometricSvc.faceRegister(form).subscribe((res: any) => {
        if (res?.statusCode == 200 || res?.statusCode == 201) {
          this.dialogRef.close({
            biometricId: res?.data?.biometricId,
            data: res?.data,
            imageUrl: this.webcamImage?.imageAsDataUrl,
          });
        }
      });
    }
  }

  get invokeObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  automaticCapture() {
    this.trigger.next();
    this.getBlobFromData(this.webcamImage?.imageAsDataUrl);
  }

  async checkFace(file: File) {
    const numberOfFaces = await this.detectFacesFromBlob(file);

    if (numberOfFaces == null) {
      this.face_scan_error = 'Unable to detect a face. Please try again.';
      this.faceIntervalMethod();
    } else if (numberOfFaces === 0) {
      this.face_scan_error =
        'No face detected. Please align properly with the frame.';
      this.faceIntervalMethod();
    } else if (numberOfFaces > 1) {
      this.face_scan_error =
        'More than one face detected. Only one person is allowed while scanning.';
      this.faceIntervalMethod();
    } else {
      this.face_scan_error = '';

      const form = new FormData();
      form.append('file', file);
      const sub = this.biometricSvc
        .faceLogin(form, this.dialogData?.biometricId)
        .subscribe(
          (res: any) => {
            if (res?.data?.message === 'Face matched successfully') {
              this.face_scan_error = '';
              this.dialogRef.close('matched');
              this.unsubscribeFromAll();
            } else {
              this.face_scan_error = res?.data?.message;
              this.faceIntervalMethod();
            }
          },
          () => {
            this.face_scan_error = 'failed to verify. Please try again.';
            this.faceIntervalMethod();
          },
        );
      this.faceLoginSubscription.push(sub);
    }
  }

  faceIntervalMethod() {
    if (Date.now() - this.scanStartTime < this.MAX_SCAN_DURATION) {
      this.faceInterval = setTimeout(() => {
        this.automaticCapture();
      }, 1500);
    } else {
      this.face_scan_error = 'Face scan timed out. Please try again.';
      this.stopWebcam();
    }
  }

  async detectFacesFromBlob(blob: Blob) {
    const image = await this.blobToImage(blob);
    if (image) {
      const options = new faceapi.TinyFaceDetectorOptions({
        inputSize: 224,
        scoreThreshold: 0.5,
      });

      const detections = await faceapi.detectAllFaces(image, options);
      const faceCount = detections.length;
      return faceCount;
    }
    return null;
  }

  // Utility method to convert Blob to Image
  blobToImage(blob: Blob): Promise<HTMLImageElement | null> {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        resolve(img);
      };
      img.onerror = () => {
        resolve(null);
      };
    });
  }

  // Method to unsubscribe from all subscriptions
  private unsubscribeFromAll() {
    this.faceLoginSubscription.forEach((sub: Subscription) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
    this.faceLoginSubscription = [];
  }

  retakePic() {
    this.sysImage = '';
    this.scanning = true;
    this.startFaceScan();
  }

  ngOnDestroy() {
    for (let i = 1; i < this.faceInterval; i++) {
      clearTimeout(i);
    }
    clearTimeout(this.faceInterval);
  }

  close() {
    this.unsubscribeFromAll();
    this.dialogRef.close();
  }
}
