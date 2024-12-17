import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appHost]',
})
export class WebhostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
