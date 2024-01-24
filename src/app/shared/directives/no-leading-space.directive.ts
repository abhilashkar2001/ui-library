import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  selector: "[appNoLeadingSpace]",
})
export class NoLeadingSpaceDirective {
  regexStr = "^[a-zA-Z0-9_]*$";
  constructor(private el: ElementRef) {}

  @HostListener("input", ["$event"]) onInput(event: InputEvent) {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    const inputValue = inputElement.value;

    if (inputValue.length === 1 && inputValue.trim() === "") {
      inputElement.value = ""; // Clear the input if the first character is a space
      event.preventDefault(); // Prevent the space character from being added
    }
  }
  @HostListener("keypress", ["$event"]) onKeyPress(event) {
    return new RegExp(this.regexStr).test(event.key);
  }
}
