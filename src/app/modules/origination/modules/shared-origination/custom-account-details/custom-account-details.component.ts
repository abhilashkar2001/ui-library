import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AccountService } from 'app/shared/services/account.service';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-custom-account-details',
  templateUrl: './custom-account-details.component.html',
  styleUrls: ['./custom-account-details.component.scss'],
})
export class CustomAccountDetailsComponent {
  @Input() accountDetailsForm!: FormGroup;
  @Output() accountSummaryEmit = new EventEmitter();
  @Input() createAccountDetailsSummaryArr: any;
  genericValue: any | undefined;
  staticData = {
    HOLDERTYPE: [],
  };
  currencyArr: any[] = [];
  accountBranchArr: any[] = [];
  customerCategoryArr: any[] = [];
  subscriptions: Subscription[] = [];
  valueChangesSubscription: Subscription | any;
  tenureErrorMessage: string | undefined;
  min: any;
  max: any;
  @Input() isEdit = true;
  @Input() screenCode = '';
  selectedAccountType: string = '';
  data: any;
  basisClass!: string | null;
  countryArr: any;

  constructor(
    private genericValueService: GenericValueService,
    private accountService: AccountService,
  ) {}

  ngOnInit() {
    this.fetchGenericValues();
    this.fetchBranch();
    this.fetchCurrency();
    this.fetchCustomerCategory();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isEdit']) {
      console.log('Edit mode ON');
    }
  }

  // fetch Generic Method
  fetchGenericValues() {
    this.genericValueService
      .loadGenericValue(Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.genericValue = resp?.data;
          console.log(this.genericValue);
        }
      });
  }

  fetchBranch() {
    this.accountService.fetchBranch().subscribe((resp: any) => {
      this.accountBranchArr = Array.isArray(resp.data)
        ? resp.data
        : Object.values(resp.data);

      console.log(this.accountBranchArr);
    });
  }

  fetchCurrency() {
    this.accountService.fetchCurrency().subscribe((resp: any) => {
      this.currencyArr = resp?.data ?? [];
    });
  }

  fetchCustomerCategory() {
    this.accountService.fetchCustomerCategory().subscribe((resp: any) => {
      this.customerCategoryArr = resp?.data ?? [];
    });
  }

  get originationModel() {
    return this.accountDetailsForm?.get('originationModel') as FormGroup;
  }

  get customerAccountInitialFunding() {
    return this.accountDetailsForm.get(
      'customerAccountInitialFunding',
    ) as FormGroup;
  }

  ngOnDestroy() {
    this.valueChangesSubscription?.unsubscribe();
  }
}
