import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss'],
})
export class AccountDetailComponent {
  customerId: any;
  accounts: any[] = [];
  accountDetailsForm!: FormGroup;
  branches: any[] = [];
  isEdit = true;

  constructor(
    private router: Router,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.accounts = history.state.accounts || [];
    console.log('Received Accounts:', this.accounts);

    this.buildForm();
  }

  openAccountType() {
    this.router.navigate(['/cheque-book/account-type']);
  }

  buildForm() {
    this.accountDetailsForm = this.fb.group({
      amount: [''],
      accountBranch: [''],
      accountCurrency: [''],
      holderType: [''],
      initialFunding: [''],
    });
  }

  cancel() {}
  onSubmit() {
    if (this.accountDetailsForm.valid) {
      console.log('Form submitted:', this.accountDetailsForm.value);
      this.isEdit = false;
      this.accountDetailsForm.disable();
    }
  }
}
