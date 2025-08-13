import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankCodePanelComponent } from 'app/shared/components/bank-code-panel/bank-code-panel.component';
import {
  ContainerContextData,
  SidenavService,
} from 'app/shared/services/sidenav.service';

@Component({
  selector: 'app-cheque-book-details',
  templateUrl: './cheque-book-details.component.html',
  styleUrls: ['./cheque-book-details.component.scss'],
})
export class ChequeBookDetailsComponent {
  chequeBookForm: FormGroup | undefined;
  constructor(
    private fb: FormBuilder,
    private sidenavService: SidenavService,
  ) {}
  ngOnInit() {
    this.buildBasicForm();
  }
  buildBasicForm() {
    this.chequeBookForm = this.fb.group({
      chequeBookSize: ['', Validators.required],
      accountNo: ['', Validators.required],
      chequeBookType: ['', Validators.required],
      deliveryLocation: ['My Address', Validators.required],
      deliveryAddress: ['Communication Address'],
      branchName: [''],
      branchCode: [''],
    });
  }
  branchCodeFinder() {
    const contextData: ContainerContextData = {
      component: BankCodePanelComponent,
      data: '',
    };
    const { componentRef } = this.sidenavService.openCustom(contextData);
    console.log(componentRef);
  }
}
