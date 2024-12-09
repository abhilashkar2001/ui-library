import { Directive, HostListener, ElementRef } from "@angular/core";

@Directive({
  selector: "[alphabetWithSpace]"
})
export class AlphaBetSpaceDirective {
  regexStr = "^[a-zA-Z ]*$";

  constructor(private el: ElementRef) {}

  @HostListener("keypress", ["$event"]) onKeyPress(event: any) {
    if (event.target.selectionStart === 0 && event.key === " ") {
      event.preventDefault();
    }
    return new RegExp(this.regexStr).test(event.key);
  }

  @HostListener("paste", ["$event"]) blockPaste(event: ClipboardEvent) {
    this.validateFields(event);
  }

  validateFields(event: any) {
    setTimeout(() => {
      const currentValue = this.el.nativeElement.value;
      const newValue = currentValue.replace(/[^A-Za-z ]/g, "");

      if (currentValue.startsWith(" ")) {
        this.el.nativeElement.value = newValue.trimLeft();
      } else {
        this.el.nativeElement.value = newValue;
      }

      event.preventDefault();
    }, 100);
  }
}
