import { Directive , ViewContainerRef } from "@angular/core";

@Directive({
    selector:"[host]"
})
export class Webhost{
     constructor(public viewContainerRef:ViewContainerRef){}
}