import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common-service/common.service';
import { LoanService } from 'app/shared/services/loan/loan.service';

@Component({
  selector: 'app-loans-landing',
  templateUrl: './loans-landing.component.html',
  styleUrls: ['./loans-landing.component.scss']
})
export class LoansLandingComponent implements OnInit {
  carowselData = [];

  constructor(private router: Router, 
    private commonService: CommonService, 
    private loanService: LoanService) {

  }

  ngOnInit(): void {
    //please dont'remove from here
    this.updateCurrentRoute();
    this.getLoanServices();
  }

  updateCurrentRoute() {
    this.commonService.updateData(this.router.url);
  }

  getLoanServices() {
    this.loanService.getLoanTypes().subscribe((response: any) => {
      this.carowselData = response.data;
    });
  }
}
