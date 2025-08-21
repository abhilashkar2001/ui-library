import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterInfo } from '../account-detail/account-detail.model';

@Component({
  selector: 'app-account-type',
  templateUrl: './account-type.component.html',
  styleUrls: ['./account-type.component.scss'],
})
export class AccountTypeComponent {
  routerStateData: RouterInfo | undefined;
  accounts: any[] = [
    {
      title: "Women's Savings Account",
      description:
        'A Savings Account is a basic deposit account that helps you securely store your money while earning interest. It allows easy access to your funds, supports digital transactions, and is ideal for everyday banking needs.',
      businessProductName: 'Resident Account',
      productDescription:
        'Safegaurd your money and Pays a certain amount of interest',
      selected: false,
      highlight: true,
    },
    {
      title: 'Zero Balance Savings Account',
      description:
        'A Savings Account is a basic deposit account that helps you securely store your money while earning interest. It allows easy access to your funds, supports digital transactions, and is ideal for everyday banking needs.',
      selected: false,
    },
    {
      title: 'Digital Savings Account',
      description:
        'A Savings Account is a basic deposit account that helps you securely store your money while earning interest. It allows easy access to your funds, supports digital transactions, and is ideal for everyday banking needs.',
      selected: false,
    },
    {
      title: 'Regular Savings Account',
      description:
        'A Savings Account is a basic deposit account that helps you securely store your money while earning interest. It allows easy access to your funds, supports digital transactions, and is ideal for everyday banking needs.',
      selected: false,
    },
    {
      title: "Children's Savings Account",
      description:
        'A Savings Account is a basic deposit account that helps you securely store your money while earning interest. It allows easy access to your funds, supports digital transactions, and is ideal for everyday banking needs.',
      selected: false,
    },
  ];

  accountTypes: string[] = [
    'Savings Account',
    'Current Account',
    'Salary Account',
    'Corporate Account',
  ];

  selectedAccountsMap: { [key: string]: Set<number> } = {};
  constructor(
    private cd: ChangeDetectorRef,
    private router: Router,
  ) {
    let state = this.router.getCurrentNavigation()?.extras?.state as RouterInfo;
    if (state) {
      this.routerStateData = state;
    }
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  toggleSelection(index: number, type: string) {
    if (!this.selectedAccountsMap[type]) {
      this.selectedAccountsMap[type] = new Set<number>();
    }

    if (this.selectedAccountsMap[type]!.has(index)) {
      this.selectedAccountsMap[type]!.delete(index);
    } else {
      this.selectedAccountsMap[type]!.add(index);
    }
  }

  isSelected(account: any, type: string): boolean {
    return (
      this.selectedAccountsMap[type]?.has(this.accounts.indexOf(account)) ||
      false
    );
  }

  get selectedAccounts() {
    const result: any[] = [];
    for (const type in this.selectedAccountsMap) {
      const indices = this.selectedAccountsMap[type];
      if (indices) {
        indices.forEach((i) => {
          result.push(this.accounts[i]);
        });
      }
    }
    return result;
  }

  removeAccount(account: any) {
    account.selected = false;
    for (const type in this.selectedAccountsMap) {
      if (this.selectedAccountsMap[type]) {
        this.selectedAccountsMap[type]!.delete(this.accounts.indexOf(account));
      }
    }
    this.cd.detectChanges();
  }

  onClickAction() {
    console.log('Selected Accounts being sent:', this.selectedAccounts);
    if (this.routerStateData?.url.includes('card')) {
      this.router.navigate(['/apply-card/stages'], {
        state: { accounts: this.selectedAccounts },
      });
    } else if (this.routerStateData?.url.includes('cheque')) {
      this.router.navigate(['/cheque-book/stages'], {
        state: { accounts: this.selectedAccounts },
      });
    }
  }
}
