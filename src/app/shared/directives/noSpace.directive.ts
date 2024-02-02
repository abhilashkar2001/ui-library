import { Directive, HostListener } from "@angular/core";

@Directive({
  selector: "[noSpace]",
})
export class NoSpaceDirective {
  @HostListener("keydown", ["$event"])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === " ") {
      event.preventDefault();
    }
  }
}
