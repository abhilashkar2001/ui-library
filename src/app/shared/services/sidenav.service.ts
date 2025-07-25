import { Injectable, Type, ViewContainerRef } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BankCodePanelComponent } from '../components/bank-code-panel/bank-code-panel.component';
import { AddCollateralComponent } from '../../modules/loan/components/collateral-details/add-collateral/add-collateral.component';
import { EmiCalculatorDrawerComponent } from 'app/modules/loan/emi-calculator/emi-calculator-drawer/emi-calculator-drawer.component';
import { DocumentDetailsComponent } from 'app/modules/loan/components/document-details/document-details.component';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  private panel: MatSidenav | undefined;
  private vcr: ViewContainerRef | undefined;

  setPanel(sidenav: MatSidenav) {
    this.panel = sidenav;
  }

  setContainer(viewContainerRef: ViewContainerRef) {
    this.vcr = viewContainerRef;
  }

  open(containerData: ContainerContextData) {
    this.vcr?.clear();
    const componentRef = this.vcr?.createComponent(containerData?.component);
    if (componentRef) componentRef.setInput('data', containerData.data);
    return this.panel?.open();
  }

  close() {
    this.vcr?.clear();
    return this.panel?.close();
  }

  toggle() {
    return this.panel?.toggle();
  }
}

export interface ContainerContextData {
  component: Type<
    | BankCodePanelComponent
    | AddCollateralComponent
    | DocumentDetailsComponent
    | EmiCalculatorDrawerComponent
  >;
  data: Record<string, any> | string | number | boolean | undefined | null;
}
