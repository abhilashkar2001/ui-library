import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanDetailsModel } from 'app/shared/models/loan-details.model';
import { loanServiceStore } from '../../../loan-tabs';
import { LoanService } from 'app/shared/services/net-loan-service/loan.service';
import { IcHttpResponseModel } from 'app/shared/models/ic-http-response.model';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { IconService } from 'app/shared/services/icon.service';
import { handleDownload } from 'app/shared/helpers/utils';

@Component({
  selector: 'app-view-statement',
  templateUrl: './view-statement.component.html',
  styleUrls: ['./view-statement.component.scss']
})
export class ViewStatementComponent implements OnInit {
  viewStatementForm: FormGroup;
  viewStatementHeadingsArr = loanServiceStore.viewStatementHeadings;
  fetchStatement: boolean = false;
  loanDetails: LoanDetailsModel[];
  //need to remove the static data
  loanViewOptionArr = [
    { value: "ONEDAY", label: "Today" },
    { value: "ONEWEEK", label: "Last 7 days" },
    { value: "CURRENTMONTH", label: "Current Month" },
    { value: "LASTTHREEMONTH", label: "Last 3 Month" },
    { value: "DATERANGE", label: "Select Date Range" },
  ];
  fetchedData: any;

  constructor(private fb: FormBuilder, private loanService: LoanService, private sessionStorageService: SessionStorageService, private iconService: IconService) {
    this.iconService
      .addIconIfNotExists(
        "blue-download",
        "assets/images/blue-download.svg"
      )
      .subscribe((_) => { });
  }

  ngOnInit(): void {
    this.loanDetails = this.sessionStorageService.getLoanInfo()
    this.buildViewStatementForm()
  }

  buildViewStatementForm() {
    this.viewStatementForm = this.fb.group({
      statementOption: ["Active Loan"],
      loanAccNo: ["", [Validators.required]],
      viewOption: [""],
    });
  }


  onClick() {
    this.fetchStatement = true;
    this.loanService
      .fetchViewStatement(this.viewStatementForm.value.loanAccNo)
      .subscribe((res: IcHttpResponseModel<any>) => {
        if (res?.statusCode == 200 && res?.data) {
          this.fetchedData = res?.data;
        }
      });
  }

  download() {
    this.loanService
      .downloadViewStatement(this.viewStatementForm.value.loanAccNo)
      .subscribe((res: Blob) => {
        handleDownload(res, "View Statement");
      });
  }
}
