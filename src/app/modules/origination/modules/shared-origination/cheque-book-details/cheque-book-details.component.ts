import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminLayoutComponent } from 'app/layouts/admin-layout/admin-layout.component';
import { BankCodePanelComponent } from 'app/shared/components/bank-code-panel/bank-code-panel.component';

@Component({
  selector: 'app-cheque-book-details',
  templateUrl: './cheque-book-details.component.html',
  styleUrls: ['./cheque-book-details.component.scss'],
})
export class ChequeBookDetailsComponent {
  chequeBookForm: FormGroup | undefined;
  constructor(
    private fb: FormBuilder,
    private adminLayout: AdminLayoutComponent,
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
    this.adminLayout.openSidenavComponent(
      BankCodePanelComponent,
      { width: '40%' },
      false,
      // (selectedCompany) => {
      //   if (selectedCompany) {
      //     this.businessDetailsForm
      //       .get('parentCompanyId')
      //       ?.setValue(selectedCompany.name);
      //   }
      // },
    );
  }
  parentSearch() {}
}
