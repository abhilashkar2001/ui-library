import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appMinMax]',
})
export class MinMaxDirective {
  @Input() min: number | any;
  @Input() max: number | any;

  constructor(
    private ref: ElementRef,
    private ngControl: NgControl,
  ) {}

  @HostListener('input', ['$event'])
  onInput(): void {
    const val = parseFloat(this.ref.nativeElement.value);
    this.debounceValue(this.updateInputValue, 400, val);
  }

  updateInputValue = (value: number) => {
    if (value >= this.min && value <= this.max) {
      this.ngControl.control?.setValue(value.toString());
    } else if (value < this.min) {
      this.ngControl.control?.setValue(this.min.toString());
    } else {
      this.ngControl.control?.setValue(this.max.toString());
    }
  };

  debounceValue(
    func: (value: number) => void,
    delay: number,
    value: number,
  ): void {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    this.debounceTimeout = setTimeout(() => {
      func(value);
    }, delay);
  }

  private debounceTimeout: any;
}
