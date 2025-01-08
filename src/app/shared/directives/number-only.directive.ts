import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNumbersOnly]',
})
export class NumberDirective {
  regexStructure = '^[0-9]*$'; // numbers accpt dots
  @Input('appNumbersOnly') isNumbersOnly!: boolean | string;
  constructor(private _el: ElementRef) {}

  @HostListener('ion-input', ['$event']) onInputChange(event: any) {
    const initalValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initalValue
      .replace(/[^0-9]/g, '')
      // Replace extra dots
      .replace('.', '%FD%')
      .replace(/\./g, '')
      .replace('%FD%', '.');
    if (initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }

  @HostListener('keypress', ['$event']) onKeyPress(event: any) {
    if (this.isNumbersOnly !== false)
      return new RegExp(this.regexStructure).test(event.key);
    return;
  }

  @HostListener('paste', ['$event']) blockPaste(event: any) {
    if (this.isNumbersOnly !== false) this.validationFields(event);
  }

  validationFields(event: ClipboardEvent | any) {
    event.preventDefault();
    const pasteData = event.clipboardData
      .getData('text/plain')
      .replace(/[^0-9]/g, '')
      // Replace extra dots
      .replace('.', '%FD%')
      .replace(/\./g, '')
      .replace('%FD%', '.');
    document.execCommand('insertHTML', false, pasteData);
  }
}
