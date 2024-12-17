import { Component, OnInit } from '@angular/core';
import { LoanDashboardConstant } from '../../loan-dashboard/loan-dashboard.constant';

@Component({
  selector: 'app-loan-service-dashboard',
  templateUrl: './loan-service-dashboard.component.html',
  styleUrls: ['./loan-service-dashboard.component.scss'],
})
export class LoanServiceDashboardComponent implements OnInit {
  transactionCard = LoanDashboardConstant.transactionCard;
  serviceLinks = LoanDashboardConstant.Links;

  constructor() {}

  ngOnInit(): void {}
}
