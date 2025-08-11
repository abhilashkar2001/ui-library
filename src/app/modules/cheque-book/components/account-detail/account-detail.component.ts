import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss']
})
export class AccountDetailComponent {
customerId: any;
  constructor(
    private router: Router
  ) {
  }

  // Method to open account type selection
  // This method can be implemented to navigate to the account type selection page
 openAccountType(){
   this.router.navigate(['/cheque-book/account-type']);
 }
}
