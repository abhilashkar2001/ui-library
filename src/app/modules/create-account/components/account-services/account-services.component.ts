import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankCodePanelComponent } from 'app/shared/components/bank-code-panel/bank-code-panel.component';
import { ContainerContextData, SidenavService } from 'app/shared/services/sidenav.service';

@Component({
  selector: 'app-account-services',
  templateUrl: './account-services.component.html',
  styleUrls: ['./account-services.component.scss']
})
export class AccountServicesComponent {
  serviceForm: FormGroup | undefined;
    isChequeChecked = false;
    isDebitCardChecked = false;
    isInternetBankingChecked = false;
    isMobileBankingChecked = false;

    constructor(
        private fb: FormBuilder,
        private sidenavService: SidenavService,
      ) {}
      ngOnInit() {
        this.buildBasicForm();
      }
    
      buildBasicForm(data?: any) {
        this.serviceForm = this.fb.group({
          accService: [data?.accService ?? ''],
          chequeBookDetails: this.fb.group({
            chequeBookSize: ['', Validators.required],
            accountNo: ['', Validators.required],
            chequeBookType: ['', Validators.required],
            deliveryLocation: ['My Address', Validators.required],
            deliveryAddress: ['Communication Address'],
            branchName: [''],
            branchCode: [''],
          }),
          debitCardDetails: this.fb.group({}),
          internetBankingDetails: this.fb.group({}),
          mobileBankingDetails: this.fb.group({}),
        });
      }
      onChequeBook() {
        this.isChequeChecked = !this.isChequeChecked;
      }
      onDebitCard() {
        this.isDebitCardChecked = !this.isDebitCardChecked;
      }
      onInternetBanking() {
        this.isInternetBankingChecked = !this.isInternetBankingChecked;
      }
      onMobileBanking() {
        this.isMobileBankingChecked = !this.isMobileBankingChecked;
      }
      get chequeBook() {
        return this.serviceForm?.get('chequeBookDetails');
      }
      branchCodeFinder() {
        const contextData: ContainerContextData = {
          component: BankCodePanelComponent,
          data: '',
        };
        const { componentRef } = this.sidenavService.openCustom(contextData);
        console.log(componentRef)
      }

}
