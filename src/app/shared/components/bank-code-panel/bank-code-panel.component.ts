import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-bank-code-panel',
  templateUrl: './bank-code-panel.component.html',
  styleUrls: ['./bank-code-panel.component.scss'],
})
export class BankCodePanelComponent implements OnInit {
  bankForm: FormGroup | undefined;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildBankForm();
  }

  buildBankForm(data?: any) {
    this.bankForm = this.fb.group({
      bankCode: [data?.bankCode ?? ''],
      bankName: [data?.bankName ?? ''],
      branchName: [data?.branchName ?? ''],
    });
  }
}
