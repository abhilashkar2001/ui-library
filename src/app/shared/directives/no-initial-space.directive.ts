import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNoInitialSpecialCharacters]',
})
export class NoInitialSpecialCharactersDirective {
  @Input() appNoInitialSpecialCharacters!: boolean | string;

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initialValue = this.el.nativeElement.value;
    const firstChar = initialValue.charAt(0);

    // Check if the first character is valid
    if (!this.isValidFirstChar(firstChar)) {
      const newValue = initialValue.slice(1); // Remove the first character
      this.el.nativeElement.value = newValue;
      event.stopPropagation(); // Prevent event bubbling
    }
  }

  private isValidFirstChar(char: string): boolean {
    // Define allowed characters for the first position
    const allowedChars = /^[a-zA-Z0-9]$/; // Only alphanumeric characters are allowed
    return allowedChars.test(char);
  }
}
