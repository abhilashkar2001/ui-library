import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterInfo } from './account-detail.model';

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
  routeInfo!: RouterInfo;
  selectedAccCardTitle = [
    'Account Type',
    'Account Description',
    'Business Product Name',
    'Product Description',
  ];
  constructor(
    private router: Router,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.accounts = history.state.accounts || [];
    console.log('Received Accounts:', this.accounts);
    this.routeInfo = { url: this.router.url };
    this.buildForm();
  }

  openAccountType() {
    if (this.routeInfo.url.includes('card')) {
      this.router.navigate(['/apply-card/account-type'], {
        state: this.routeInfo,
      });
    } else if (this.routeInfo.url.includes('cheque')) {
      this.router.navigate(['/cheque-book/account-type']);
    }
  }

  buildForm() {
    this.accountDetailsForm = this.fb.group({
      amount: [''],
      accountBranch: [''],
      accountCurrency: [''],
      holderType: [''],
      initialFunding: [''],
      // the below control names are used only for the common seciton
      commonAccountBranch: ['', Validators.required],
      commonAccountCurrency: ['', Validators.required],
      commonHolderType: ['', Validators.required],
      commonInitialFunding: [''],
      commonOverdraftRequired: [''],
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
