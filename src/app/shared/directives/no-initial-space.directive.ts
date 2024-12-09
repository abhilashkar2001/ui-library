import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  selector: "[noInitialSpecialCharacters]"
})
export class NoInitialSpecialCharactersDirective {
  constructor(private el: ElementRef) {}

  @HostListener("input", ["$event"]) onInputChange(event: Event) {
    const inputValue = this.el.nativeElement.value;

    // Check if the input value starts with a special character or space
    if (/^[!@#$%^&*(),.?":;_+';/={}|<>-\s]/.test(inputValue)) {
      // If it starts with a special character or space, prevent the input
      event.preventDefault();
      this.el.nativeElement.value = inputValue.replace(
        /^[!@#$%^&*(),.?":;_+';/={}|<>-\s]+/,
        ""
      );
    }
  }

  @HostListener("paste", ["$event"]) onPaste(event: ClipboardEvent | any) {
    // Get the pasted text from the clipboard
    const pastedText: any = event.clipboardData.getData("text");

    // Check if the pasted text starts with a special character or space
    if (/^[!@#$%^&*(),.?":;_+';/={}|<>-\s]/.test(pastedText)) {
      // If it starts with a special character or space, prevent the paste
      event.preventDefault();
    }
  }
}
