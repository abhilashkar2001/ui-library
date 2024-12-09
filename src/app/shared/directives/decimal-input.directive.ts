import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
  selector: "[decimalinput]"
})
export class DecimalInputDirective {
  @Input()
  numLength: number | any;
  @Input()
  allowedDecimalIndex: number | any;
  constructor(private el: ElementRef) {}

  @HostListener("input", ["$event"])
  onInput(): void {
    const input = this.el.nativeElement as HTMLInputElement;
    let value = input.value;
    value = value.replace(/[^0-9.]/g, "");
    const decimalIndex = value.indexOf(".");

    if (decimalIndex === -1) {
      if (value.length > this.numLength) {
        value = value.substring(0, this.numLength);
      }
    } else {
      if (value.length - decimalIndex > this.allowedDecimalIndex) {
        value = value.substring(
          0,
          decimalIndex + (this.allowedDecimalIndex + 1)
        );
      }
    }

    input.value = value;
  }
}
