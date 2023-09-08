import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "environments/environment";

@Component({
  selector: "app-loan-products",
  templateUrl: "./loan-products.component.html",
  styleUrls: ["./loan-products.component.scss"],
})
export class LoanProductsComponent implements OnInit {
  @Input() subLoanList;
  @Output() customApply = new EventEmitter<any>();
  selectedLoan: any;
  endPoints = environment.microServiceURL;

  constructor(private route: Router) {}

  ngOnInit(): void {
    console.log(this.selectedLoan);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    this.subLoanList = changes.subLoanList.currentValue;
  }

  goForCalculator(subAccount) {
    this.selectedLoan = subAccount;
    console.log(this.selectedLoan);
    if (this.selectedLoan?.productDetails?.length > 1) {
      console.log("multiply product");
      this.customApply.emit({
        selectedLoan: this.selectedLoan,
        isShowCalculator: false,
        subClass: this.selectedLoan?.subClass,
      });
    } else if (this.selectedLoan?.productDetails?.length == 1) {
      console.log("one product");
      const payload = JSON.stringify({
        processCycleCode: this.selectedLoan?.productDetails[0].processCycleCode,
        basisName: this.selectedLoan?.productDetails[0].basisName,
        basisId: this.selectedLoan?.productDetails[0].basisId,
      });
      sessionStorage.setItem("loanBasisDetails", payload);
      this.customApply.emit({
        selectedLoan: this.selectedLoan,
        isShowCalculator: true,
      });
    } else {
      console.log(".,");
      const payload = JSON.stringify({
        processCycleCode: this.selectedLoan?.processCycleCode,
        basisName: this.selectedLoan?.basisName,
        basisId: this.selectedLoan?.basisId,
      });
      sessionStorage.setItem("loanBasisDetails", payload);
      this.customApply.emit({
        selectedLoan: this.selectedLoan,
        isShowCalculator: true,
        subClass: this.selectedLoan?.basisName,
      });
    }
  }
  getFileUrl(url) {
    if (url.includes("https")) {
      return "assets/images/normal_loan.svg";
    } else {
      return `${this.endPoints}${url}`;
    }
  }
}
