import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-sign-pad',
  templateUrl: './sign-pad.component.html',
  styleUrls: ['./sign-pad.component.scss'],
})
export class SignPadComponent implements AfterViewInit {
  @Input() type: string | undefined;
  @Output() public signpadImage = new EventEmitter();
  @ViewChild('canvas', { static: true }) canvas:
    | ElementRef<HTMLCanvasElement>
    | any;
  private ctx: CanvasRenderingContext2D | any;
  private isDrawing = false;
  private hasSigned = false;
  private lastX: number | any;
  private lastY: number | any;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {
    this.matIconRegistry.addSvgIcon(
      'reload-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/reload.svg',
      ),
    );
  }
  clearCanvasIfFirstDraw() {
    if (!this.hasSigned) {
      const canvas = this.canvas.nativeElement;
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.setCanvasBackground();
      this.hasSigned = true;
    }
  }

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.setCanvasBackground();
    this.drawPlaceholder();
  }
  private drawPlaceholder() {
    const canvas = this.canvas.nativeElement;
    this.ctx.font = '36px "Pacifico", cursive';
    this.ctx.fillStyle = '#ccd0d5';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Sign here', canvas.width / 2, canvas.height / 2);
  }

  handleMouseDown(event: MouseEvent) {
    if (!this.hasSigned) {
      this.ctx.clearRect(
        0,
        0,
        this.canvas.nativeElement.width,
        this.canvas.nativeElement.height,
      );
      this.setCanvasBackground();
      this.hasSigned = true;
    }

    this.isDrawing = true;
    const { x, y } = this.getCanvasCoordinates(event);
    this.lastX = x;
    this.lastY = y;
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.isDrawing) return;
    const { x, y } = this.getCanvasCoordinates(event);
    this.draw(x, y);
  }

  handleMouseUp() {
    this.isDrawing = false;
  }

  draw(x: number, y: number) {
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.strokeStyle = 'black';

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.quadraticCurveTo(this.lastX, this.lastY, x, y);
    this.ctx.stroke();

    this.lastX = x;
    this.lastY = y;
  }

  clearCanvas() {
    const canvas = this.canvas.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.setCanvasBackground();
    this.hasSigned = false;
    this.ctx.beginPath();
    this.drawPlaceholder();
  }

  private setCanvasBackground() {
    this.ctx.fillStyle = '#FEF3F2';
    this.ctx.fillRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height,
    );
  }
  getCanvasCoordinates(event: MouseEvent) {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const scaleX = this.canvas.nativeElement.width / rect.width;
    const scaleY = this.canvas.nativeElement.height / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }

  saveSignature() {
    if (!this.hasSigned) {
      return;
    }
    const originalCanvas = this.canvas.nativeElement;
    const sourceWidth = originalCanvas.width;
    const sourceHeight = originalCanvas.height;

    const targetSize = 300; // Final output will be 300x300 square

    // Create square canvas
    const squareCanvas = document.createElement('canvas');
    squareCanvas.width = targetSize;
    squareCanvas.height = targetSize;

    const squareCtx = squareCanvas.getContext('2d');
    if (!squareCtx) {
      console.error('Failed to get 2D context');
      return;
    }

    // Fill background with your desired color
    squareCtx.fillStyle = '#FEF3F2';
    squareCtx.fillRect(0, 0, targetSize, targetSize);

    // Calculate scale and position to center the original drawing
    const scale = Math.min(targetSize / sourceWidth, targetSize / sourceHeight);
    const drawWidth = sourceWidth * scale;
    const drawHeight = sourceHeight * scale;
    const dx = (targetSize - drawWidth) / 2;
    const dy = (targetSize - drawHeight) / 2;

    // Draw scaled original canvas in center
    squareCtx.drawImage(
      originalCanvas,
      0,
      0,
      sourceWidth,
      sourceHeight,
      dx,
      dy,
      drawWidth,
      drawHeight,
    );

    // Export image
    const dataURL = squareCanvas.toDataURL('image/png');
    fetch(dataURL)
      .then((res) => res.blob())
      .then((blob) => this.signpadImage.emit(blob));
  }
}
