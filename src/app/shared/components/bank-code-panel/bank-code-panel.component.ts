import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BranchService } from 'app/shared/services/branch.service';

@Component({
  selector: 'app-bank-code-panel',
  templateUrl: './bank-code-panel.component.html',
  styleUrls: ['./bank-code-panel.component.scss'],
})
export class BankCodePanelComponent implements OnInit {
  @Input() data: any;
  bankForm: FormGroup | undefined;
  branchList: any;
  fetchedData = [
    {
      bankName: 'Demo Bank - Whitefiled',
      bankCode: 'Bank Code - DEMO45678',
    },
    {
      bankName: 'Demo Bank - Whitefiled',
      bankCode: 'Bank Code - DEMO45678',
    },
    {
      bankName: 'Demo Bank - Whitefiled',
      bankCode: 'Bank Code - DEMO45678',
    },
  ];
  constructor(
    private fb: FormBuilder,
    private branchService: BranchService,
  ) {}

  ngOnInit(): void {
    this.buildBankForm();
    this.fetchBranchDetails();
    console.log(this.data);
  }

  buildBankForm(data?: any) {
    this.bankForm = this.fb.group({
      bankCode: [data?.bankCode ?? ''],
      bankName: [data?.bankName ?? ''],
      branchName: [data?.branchName ?? ''],
    });
  }

  fetchBranchDetails() {
    this.branchService.fetchBranch().subscribe((res: any) => {
      if (res?.statusCode == 200 && res?.data) {
        this.branchList = res.data;
      }
    });
  }
}
