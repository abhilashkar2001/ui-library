import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appContentContainer]',
})
export class ContentContainerDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
