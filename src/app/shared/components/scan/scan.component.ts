import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as faceapi from 'face-api.js';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss'],
})
export class ScanComponent implements OnInit {
  WIDTH = 0;
  HEIGHT = 0;
  @ViewChild('video', { static: true })
  public video!: ElementRef;
  @ViewChild('canvas', { static: true })
  public canvasRef!: ElementRef;
  imageData: any;
  scannedImage: any;
  public mainDiv!: ElementRef;
  stream: any;
  detection: any;
  resizedDetections: any;
  canvas: any;
  canvasEl: any;
  displaySize: any;
  videoInput: any;
  flag = true;
  disableVideo = false;
  isScanned = false;
  rescann: boolean | any;
  perscentageCheck = true;
  prompt = 'Face forward 🧍';
  randomDirection: string | undefined;
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private elRef: ElementRef,
    public dialogRef: MatDialogRef<ScanComponent>,
  ) {}

  async ngOnInit() {
    this.dialogData;
    this.startVideo();
    this.randomDirection = Math.random() < 0.5 ? 'RIGHT' : 'LEFT';
    faceapi.nets.tinyFaceDetector.loadFromUri('../../assets/models'),
      await faceapi.nets.faceLandmark68Net.loadFromUri('../../assets/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('../../assets/models');
    await faceapi.nets.faceExpressionNet.loadFromUri('../../assets/models');
  }

  closeClick(isScanned: boolean) {
    this.dialogRef.close({
      message: 'Confirm',
      isScanned: isScanned,
      image: this.scannedImage,
    });
  }

  startVideo() {
    const newVariable = window.navigator as any;

    this.videoInput = this.video.nativeElement;

    newVariable.getUserMedia(
      { video: {}, audio: false },

      (stream: any) => (this.videoInput.srcObject = stream),

      (err: any) => console.log(err),
    );

    this.face_detect();
  }

  face_detect() {
    this.elRef.nativeElement
      .querySelector('video')
      .addEventListener('play', async () => {
        this.canvas = await faceapi.createCanvasFromMedia(this.videoInput);
        this.canvasEl = this.canvasRef.nativeElement;
        this.canvasEl.appendChild(this.canvas);
        this.canvas.setAttribute('id', 'canvass');
        this.canvas.setAttribute(
          'style',
          'position: relative; top: -10px; left: 0px;',
        );

        this.displaySize = {
          width: this.videoInput.width,
          height: this.videoInput.height,
        };

        faceapi.matchDimensions(this.canvas, this.displaySize);

        let leftDetected = false;
        let rightDetected = false;

        setInterval(async () => {
          this.detection = await faceapi
            .detectAllFaces(
              this.videoInput,
              new faceapi.TinyFaceDetectorOptions(),
            )
            .withFaceLandmarks()
            .withFaceExpressions();
          if (this.detection?.length > 1) {
            this.prompt = 'More than one face detected';
            this.drawFaceBox('red');
          } else if (this.detection?.length == 1) {
            this.resizedDetections = faceapi.resizeResults(
              this.detection,
              this.displaySize,
            );

            this.canvas
              .getContext('2d')
              .clearRect(0, 0, this.canvas.width, this.canvas.height);

            if (this.resizedDetections?.length > 0) {
              this.resizedDetections.forEach((detection: any) => {
                const box = detection.detection.box;
                const faceWidth = box.width;
                const imageWidth = this.displaySize.width;
                const facePercent = (faceWidth / imageWidth) * 100;

                // Calculate color based on face percentage
                const color = this.getColorBasedOnPercentage(facePercent);
                if (!leftDetected && !rightDetected) {
                  this.prompt = `Turn your head to the ${this.randomDirection}`;
                }

                // Liveliness check - detecting left and right turns using landmarks
                const landmarks = detection.landmarks;
                const nose = landmarks.getNose();
                const leftEye = landmarks.getLeftEye();
                const rightEye = landmarks.getRightEye();

                const leftEyeX = leftEye[0].x;
                const rightEyeX = rightEye[0].x;
                const noseX = nose[0].x;
                // Calculate the center point between the eyes
                const eyeCenterX = (leftEyeX + rightEyeX) / 2;
                const faceW = rightEyeX - leftEyeX; // Approximate face width
                const threshold = faceW * 0.2;

                setTimeout(() => {
                  if (noseX > eyeCenterX + threshold) {
                    rightDetected = true;
                  } else if (noseX < eyeCenterX - threshold) {
                    leftDetected = true;
                  }
                  setTimeout(() => {
                    if (!leftDetected && !rightDetected) {
                      leftDetected = true;
                    }
                  }, 2000);
                  if (leftDetected || rightDetected) {
                    if (
                      (this.randomDirection == 'LEFT' && rightDetected) ||
                      (this.randomDirection == 'RIGHT' && leftDetected)
                    )
                      this.prompt = '✅ Liveliness check passed!';
                    else {
                      this.close();
                    }
                  }
                }, 1000);

                this.drawFaceBox(color);
              });
            } else {
              this.prompt = 'No face detected! Position yourself in the frame.';
            }
          }
        }, 3000);
      });
  }

  drawFaceBox(color: string) {
    if (this.video) {
      this.video.nativeElement.style.border = `2px solid ${color}`;
    }
  }

  getColorBasedOnPercentage(percentage: number): string {
    // Adjust color based on your threshold values
    if (percentage > 34) {
      this.perscentageCheck = false;
      return 'green';
    } else if (percentage > 18 && percentage <= 34) {
      this.perscentageCheck = false;
      return 'yellow';
    } else {
      this.perscentageCheck = true;
      return 'red';
    }
  }
  captureImage() {
    const canvas = document.createElement('canvas');

    canvas.width = this.videoInput.videoWidth;

    canvas.height = this.videoInput.videoHeight;

    const context = canvas.getContext('2d');

    context!.drawImage(this.videoInput, 0, 0, canvas.width, canvas.height);

    this.imageData = canvas.toDataURL('image/jpeg');

    this.scannedImage = this.imageData;

    this.flag = false;

    this.disableVideo = true;

    const mainDiv: any = document.getElementById('mainDiv');
    mainDiv.remove();

    if (this.scannedImage && this.videoInput) {
      this.videoInput.srcObject = null;
    }
    this.videoInput.srcObject = null;
  }

  stopVideo() {
    const stream = this.videoInput.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      this.videoInput.srcObject = null;
    }
  }

  done() {
    this.closeClick(true);
  }
  rescan() {
    this.dialogRef.close('reScan');
    this.rescann = true;
  }
  close(remark?: string) {
    this.dialogRef.close(remark);
  }
}
