import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-sign-pad",
  templateUrl: "./sign-pad.component.html",
  styleUrls: ["./sign-pad.component.scss"],
})
export class SignPadComponent {
  @Output() public signpadImage = new EventEmitter();

  signPad: any;
  @ViewChild("signPadCanvas", { static: false }) signaturePadElement: any;
  signImage: any;

  constructor(private snack: MatSnackBar) {}

  ngAfterViewInit() {
    // this.signPad = new SignaturePad(this.signaturePadElement.nativeElement);
    console.log(this.signPad);
  }
  /*It's work in devices*/
  startSignPadDrawing(event: Event) {
    console.log(event);
  }
  /*It's work in devices*/
  movedFinger(event: Event) {}
  /*Undo last step from the signature*/
  undoSign() {
    const data = this.signPad.toData();
    if (data) {
      data.pop(); // remove the last step
      this.signPad.fromData(data);
    }
  }
  /*Clean whole the signature*/
  clearSignPad() {
    this.signPad.clear();
  }
  /*Here you can save the signature as a Image*/
  saveSignPad() {
    if (!this.signPad.isEmpty()) {
      this.signImage = this.signPad.toDataURL();
      fetch(this.signImage)
        .then((res) => res.blob())
        .then((resp) => this.signpadImage.emit(resp));
      // Here you can save your signature image using your API call.
    } else {
      this.snack.open("Signature is not present", "Ok", {
        duration: 2000,
        horizontalPosition: "right",
        verticalPosition: "top",
      });
      return;
    }
  }
}
