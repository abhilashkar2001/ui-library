import { Injectable, ViewContainerRef } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { DrawerContextData } from 'app/modules/loan/drawer-context-data';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  private panel: MatSidenav | undefined;
  private vcf: ViewContainerRef | undefined;

  setPanel(sidenav: MatSidenav) {
    this.panel = sidenav;
  }

  setContentVcf(viewContainerRef: ViewContainerRef) {
    this.vcf = viewContainerRef;
  }

  private createView(data: DrawerContextData) {
    this.vcf?.clear();
    console.log(data);
    const componentRef = this.vcf?.createComponent(data.component);
    if (componentRef) componentRef.instance.data = data.data;
  }

  open(data: DrawerContextData, openSlip?: boolean) {
    this.createView(data);
    if (openSlip == true) {
      this.setCustomeClass('panel-half-drawer');
    } else {
      this.setCustomeClass('panel-end-drawer');
    }
    return this.panel?.open();
  }

  openCustomWidth(data: DrawerContextData, className?: string) {
    this.createView(data);
    if (className) this.setCustomeClass(className);
    return this.panel?.open();
  }

  close() {
    return this.panel?.close();
  }

  toggle() {
    return this.panel?.toggle();
  }
  public sidePanelClass = new BehaviorSubject<string>('panel-end-drawer');
  public panelClass = this.sidePanelClass.asObservable();
  setCustomeClass(customClass: string) {
    this.sidePanelClass.next(customClass);
  }
}
