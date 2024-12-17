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
  resData: any;
  isScanned = false;
  rescann: boolean | any;
  perscentageCheck = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private elRef: ElementRef,
    public dialogRef: MatDialogRef<ScanComponent>,
  ) {}

  async ngOnInit() {
    this.dialogData;
    this.startVideo();
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
          `position: relative;
        
         top: -10px;

         left: 0px;`,
        );

        this.displaySize = {
          width: this.videoInput.width,

          height: this.videoInput.height,
        };

        faceapi.matchDimensions(this.canvas, this.displaySize);

        setInterval(async () => {
          this.detection = await faceapi
            .detectAllFaces(
              this.videoInput,
              new faceapi.TinyFaceDetectorOptions(),
            )
            .withFaceLandmarks()
            .withFaceExpressions();

          this.resizedDetections = faceapi.resizeResults(
            this.detection,

            this.displaySize,
          );
          let color = 'red';
          if (this.resizedDetections?.length > 0) {
            this.resizedDetections.forEach((detection: any) => {
              const box = detection.detection.box;
              const faceWidth = box.width;
              const imageWidth = this.displaySize.width;
              const facePercent = (faceWidth / imageWidth) * 100;

              // Calculate the color based on the face percentage
              color = this.getColorBasedOnPercentage(facePercent);
            });
          } else {
            color = this.getColorBasedOnPercentage(0);
          }

          this.canvas
            .getContext('2d')
            .clearRect(0, 0, this.canvas.width, this.canvas.height);
          const context = this.canvas.getContext('2d');
          context.clearRect(0, 0, this.canvas.width, this.canvas.height);
          const gradient = context.createLinearGradient(
            0,
            0,
            this.canvas.width,
            this.canvas.height,
          );
          gradient.addColorStop(0, color); // Start color
          gradient.addColorStop(0.5, color); // Start color
          gradient.addColorStop(1, color); // End color
          context.strokeStyle = gradient;
          context.lineJoin = 'round';
          this.resizedDetections.forEach((detection: any) => {
            const box = detection.detection.box;
            const borderRadius = 10;
            // Draw the detection frame border with gradient stroke style and rounded corners

            context.beginPath();
            context.moveTo(box.x + borderRadius, box.y);
            context.lineTo(box.x + box.width - borderRadius, box.y);
            context.arcTo(
              box.x + box.width,
              box.y,
              box.x + box.width,
              box.y + borderRadius,
              borderRadius,
            );
            context.lineTo(
              box.x + box.width,
              box.y + box.height - borderRadius,
            );
            context.arcTo(
              box.x + box.width,
              box.y + box.height,
              box.x + box.width - borderRadius,
              box.y + box.height,
              borderRadius,
            );
            context.lineTo(box.x + borderRadius, box.y + box.height);
            context.arcTo(
              box.x,
              box.y + box.height,
              box.x,
              box.y + box.height - borderRadius,
              borderRadius,
            );
            context.lineTo(box.x, box.y + borderRadius);
            context.arcTo(
              box.x,
              box.y,
              box.x + borderRadius,
              box.y,
              borderRadius,
            );
            context.closePath();
            context.lineWidth = 2;
            context.stroke();
          });

          // faceapi.draw.drawDetections(this.canvas, this.resizedDetections);

          // faceapi.draw.drawFaceLandmarks(this.canvas, this.resizedDetections);

          // faceapi.draw.drawFaceExpressions(this.canvas, this.resizedDetections);
        }, 100);
      });
  }

  getColorBasedOnPercentage(percentage: number): string {
    console.log(percentage);

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

    console.log('Image captured:', this.scannedImage);

    this.flag = false;

    this.disableVideo = true;

    const mainDiv: any = document.getElementById('mainDiv');
    mainDiv.remove();

    if (this.scannedImage && this.videoInput) {
      console.log('captured');
      this.videoInput.srcObject = null;
    }
    this.videoInput.srcObject = null;
  }

  done() {
    this.closeClick(true);
  }
  rescan() {
    this.dialogRef.close('reScan');
    this.rescann = true;
  }
  close() {
    this.dialogRef.close();
  }
}
