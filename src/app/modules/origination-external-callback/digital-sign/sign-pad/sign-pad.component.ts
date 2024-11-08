import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { MatLegacySnackBar as MatSnackBar } from "@angular/material/legacy-snack-bar";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-sign-pad",
  templateUrl: "./sign-pad.component.html",
  styleUrls: ["./sign-pad.component.scss"],
})
export class SignPadComponent implements AfterViewInit {
  @Output() public signpadImage = new EventEmitter();
  @ViewChild("canvas", { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;
  private isDrawing: boolean = false;
  private lastX: number;
  private lastY: number;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      "reload-icon",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/reload.svg"
      )
    );
  }

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext("2d");
  }

  handleMouseDown(event: MouseEvent) {
    this.isDrawing = true;
    this.lastX = event.offsetX;
    this.lastY = event.offsetY;
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.isDrawing) return;
    this.draw(event.offsetX, event.offsetY);
  }

  handleMouseUp() {
    this.isDrawing = false;
  }

  draw(x: number, y: number) {
    this.ctx.strokeStyle = "black";
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";
    this.ctx.lineWidth = 2;

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();

    this.lastX = x;
    this.lastY = y;
  }

  clearCanvas() {
    this.ctx.clearRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );
  }

  saveSignature() {
    // Create a new canvas with white background
    const newCanvas = document.createElement("canvas");
    const newCtx = newCanvas.getContext("2d");
    newCanvas.width = this.canvas.nativeElement.width;
    newCanvas.height = this.canvas.nativeElement.height;
    newCtx.fillStyle = "white";
    newCtx.fillRect(0, 0, newCanvas.width, newCanvas.height);

    // Draw the signature canvas onto the new canvas
    newCtx.drawImage(this.canvas.nativeElement, 0, 0);

    // Save the final signature image
    const signatureImage = newCanvas.toDataURL("image/png");
    fetch(signatureImage)
      .then((res) => res.blob())
      .then((resp) => this.signpadImage.emit(resp));
    // You can save or process the image data here
  }
}
