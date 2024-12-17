import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumbersOnly]',
})
export class NumberDirective {
  regexStructure = '^[0-9]*$';

  constructor(private _el: ElementRef) {}

  @HostListener('ion-input', ['$event']) onInputChange(event: any) {
    const initalValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
    if (initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }

  @HostListener('keypress', ['$event']) onKeyPress(event: any) {
    return new RegExp(this.regexStructure).test(event.key);
  }
}
