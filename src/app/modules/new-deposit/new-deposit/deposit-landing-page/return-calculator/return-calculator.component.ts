import { filter } from 'rxjs/operators';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { InfoPopupComponent } from "./info-popup/info-popup.component";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CreateRdService } from "../../rd-calculator/create-rd.service";
import { Location } from "@angular/common";
import * as moment from "moment";
import { TokenStorageService } from "app/shared/token-storage.service";

@Component({
  selector: "app-return-calculator",
  templateUrl: "./return-calculator.component.html",
  styleUrls: ["./return-calculator.component.scss"],
})
export class ReturnCalculatorComponent implements OnInit {
  max = 100000;
  min = 1000;
  ammountValue = 0;
  depositForm: FormGroup;
  @Input() rdFdValue;
  @Input() fdName;
  @Output() customCalculatorValues = new EventEmitter<any>();

  amount = new FormControl("");
  email = new FormControl("");
  thumbLabel: boolean = true;
  name = "Angular 5";
  calculatorValues;
  flexDetails = {
    maturityAmount: 10000,
    intrestRate: 1.9,
    maturityDate: "2023-02-21",
    autoRenew: false,
    monthlySavings: "2023-08-21",
  };
  url: string = "";
  rdBasisId: any;
  isAutoRenew: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private location: Location,
    private rdApi: CreateRdService,
    private tokenStore: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    console.log(this.rdFdValue, this.fdName);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.rdFdValue) {
      localStorage.removeItem("rdBasisId");
      this.rdFdValue = changes.rdFdValue.currentValue;
      console.log(this.rdFdValue);
      if (this.rdFdValue === "rdCalculator")
        this.rdApi.getBusinessSuite("Deposit Service").subscribe((resp) => {
          if (resp?.statusCode === 200) {
            this.getSubClass(resp.data).then((val) => {
              this.rdBasisId = val[0].productDetails[0]?.basisId;
        localStorage.setItem("rdBasisId", val[0].productDetails[0]?.basisId);
        localStorage.setItem('rdBasisDetails', JSON.stringify(val[0].productDetails[0]));
             })
         
          }
        });
      else if (this.rdFdValue === "fdCalculator") return;
      if (this.depositForm) this.depositForm.reset();
    }
  }

  // getSub Class list
getSubClass(data) {
  return new Promise((resolve, reject) => {
    const rdClass = data.filter((item) => item.basisClass.toLowerCase().includes('rd'));
    let rdResp = {};
    
    this.rdApi.getBasisClass(rdClass[0].basisClass).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        rdResp = resp.data;
        resolve(rdResp);
      } else {
      }
    });
  });
}

  onSliderChange(e) {
    this.ammountValue = e.value;
    this.depositForm.get("amount").setValue(e.value);
    console.log(this.depositForm.value);
  }
  buildForm() {
    this.depositForm = this.fb.group({
      amount: 0,
      tenureYear: "",
      tenureMonth: "",
      tenureDays: "",
      scheme: "",
      ownership: "",
      intrestPayout: "",
      typeOfCustomer: "",
      monthlySavings: "",
    });
  }
  updateDeposit() {
    console.log(this.depositForm.value);
    this.customCalculatorValues.emit(this.depositForm.value);
  }
  resetform() {
    this.depositForm.reset();
  }

  openInterestDialog(): void {
    const dialogRef = this.dialog.open(InfoPopupComponent, {
      width: "700px",
      height: "400px",
    });
  }

  openLink(fdType) {
    let path;
    if (fdType == "FD") {
      path = "/deposits/fdFlow/fdDetails";
      this.url = this.location.prepareExternalUrl(
        this.router.serializeUrl(this.router.createUrlTree([path]))
      );
      window.open(`${this.url}`, "_blank");
    } else {
      const payload = this.originationModel(this.rdBasisId);
      const finalPayload = {
        originationModel: payload,
         customerInfo: [],
      }

      this.rdApi.saveRdOriginationMaster(finalPayload).subscribe((resp) => {
         path = `/deposits/rdDeposit`;
          this.url = this.location.prepareExternalUrl(
            this.router.serializeUrl(this.router.createUrlTree([path]))
          );
          this.url = `${this.url}/${resp.data.fdRdMasterModel.fdRdMasterId}`;
          window.open(`${this.url}`, "_blank");
      })
    }
  }

  originationModel(basisId) {
    return {
      ...this.depositForm.value,
      basisDetailsId: basisId,
      applicationDate: moment(new Date()).format("YYYY-MMM-DD"),
      branchCode: this.tokenStore.getUser().branchCode,
      depositeType: "FD Deposite",
      autoRenew:this.isAutoRenew,
      amount: parseInt(this.depositForm.value.amount),
      maturityAmount: 3778, //need to change once flexCube data avilable.
      maturityDate: moment(this.depositForm.value.maturityDate).format(
        "YYYY-MMM-DD"
      ),
      typeOfCustomer: '',
      intrestRate: 677, //need to change once flexCube data avilable.
      scheme: "Normal or Tax saver",
    };
  }

  formatLoanLabel(value) {
    return `₹ ${value}`;
  }
}
