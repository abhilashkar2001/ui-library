import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appAppHost]',
})
export class AppHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
