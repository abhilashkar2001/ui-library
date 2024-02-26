import { Directive, HostListener, ElementRef, Input } from "@angular/core";
@Directive({
  selector: "[specialIsAlphaNumeric]",
})
export class AlphaNumericDirective {
  regexStr = "^[a-zA-Z0-9_]*$";
  @Input() isAlphaNumeric: boolean;

  constructor(private el: ElementRef) {}

  @HostListener("keypress", ["$event"]) onKeyPress(event) {
    return new RegExp(this.regexStr).test(event.key);
  }

  @HostListener("paste", ["$event"]) blockPaste(event: ClipboardEvent) {
    event.preventDefault();
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedData = clipboardData.getData("text");
    const validPastedData = pastedData.replace(/[^a-zA-Z0-9_.-]/g, "");
    // Check for validity before updating the field
    if (new RegExp(this.regexStr).test(validPastedData)) {
      // Insert the cleaned data into the input field
      document.execCommand("insertText", false, validPastedData);
    }
  }
}
