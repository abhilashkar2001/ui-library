import { Directive, ElementRef, HostListener, Input } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
  selector: "[numbersOnly]",
})
export class NumberDirective {
  regexStructure = "^[0-9]*$";

  constructor(private _el: ElementRef) {}

  @HostListener("ion-input", ["$event"]) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initalValue.replace(/[^0-9]*/g, "");
    if (initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }

  @HostListener("keypress", ["$event"]) onKeyPress(event) {
    return new RegExp(this.regexStructure).test(event.key);
  }
}
