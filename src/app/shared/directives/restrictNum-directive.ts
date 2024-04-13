import {
  Directive,
  Input,
  ElementRef,
  HostListener,
  Self,
  Renderer2,
} from "@angular/core";
import { NgControl } from "@angular/forms";
import { debounceTime } from "rxjs/operators";

@Directive({
  selector: "[minMax]",
})
export class MinMaxDirective {
  @Input() min: number;
  @Input() max: number;

  constructor(
    private ref: ElementRef,
    private ngControl: NgControl,
    private renderer: Renderer2
  ) {}

  @HostListener("input", ["$event"])
  onInput(event: InputEvent): void {
    let val = parseFloat(this.ref.nativeElement.value);
    this.debounceValue(this.updateInputValue, 700, val);
  }

  updateInputValue = (value: number) => {
    const inputElement = this.ref.nativeElement;
    if (value >= this.min && value <= this.max) {
      this.ngControl.control.setValue(value.toString());
    } else if (value < this.min) {
      this.ngControl.control.setValue(this.min.toString());
    } else {
      this.ngControl.control.setValue(this.max.toString());
    }
  };

  debounceValue(func: Function, delay: number, value: number): void {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    this.debounceTimeout = setTimeout(() => {
      func(value);
    }, delay);
  }

  private debounceTimeout: any;
}
