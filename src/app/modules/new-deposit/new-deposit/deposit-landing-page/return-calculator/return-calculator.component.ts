import { filter } from "rxjs/operators";
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
import { FdCalculatorServiceService } from "../../fd-calculator/fd-calculator-service.service";

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
  fdBasisId: any;
  isAutoRenew: boolean = false;
  basisId: any;
  depositeType: any;
  processCycleCode: any;
  rdProcessCycleCode: any;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private location: Location,
    private rdApi: CreateRdService,
    private tokenStore: TokenStorageService,
    private newDepositeService: FdCalculatorServiceService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.fdFlowData();
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
              this.rdBasisId = val[0].productDetails[0].basisId;
              this.rdProcessCycleCode =
                val[0].productDetails[0].processCycleCode;
            });
          }
        });
      else if (this.rdFdValue === "fdCalculator") {
        this.fdFlowData();
      }
      if (this.depositForm) this.depositForm.reset();
    }
  }

  // getSub Class list
  getSubClass(data) {
    return new Promise((resolve, reject) => {
      const rdClass = data.filter((item) =>
        item.basisClass.toLowerCase().includes("rd")
      );
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

  fdFlowData() {
    this.newDepositeService.getFdTypes().subscribe((resp) => {
      if (resp?.statusCode == 200) {
        this.newDepositeService
          .fetchSubClass(resp?.data[0]?.basisClass)
          .subscribe((resp) => {
            if (resp?.statusCode == 200) {
              this.fdBasisId = resp?.data[0]?.productDetails[0]?.basisId;
              this.processCycleCode =
                resp?.data[0]?.productDetails[0]?.processCycleCode;
            }
          });
      }
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
    this.depositeType = fdType;
    if (fdType == "FD") {
      const payload = this.originationModel(this.fdBasisId);
      const finalPayload = {
        originationModel: payload,
        customerInfo: [],
      };
      this.newDepositeService
        .saveFdOriginationMaster(finalPayload)
        .subscribe((resp) => {
          path = "/deposits/fdFlow/fdDetails";
          this.url = this.location.prepareExternalUrl(
            this.router.serializeUrl(this.router.createUrlTree([path]))
          );
          this.url = `${this.url}/${resp.data.fdRdMasterModel.fdRdMasterId}/${this.processCycleCode}`;
          window.open(`${this.url}`, "_blank");
        });
    } else {
      const payload = this.originationModel(this.rdBasisId);
      const finalPayload = {
        originationModel: payload,
        customerInfo: [],
      };
      this.rdApi.saveRdOriginationMaster(finalPayload).subscribe((resp) => {
        path = `/deposits/rdDeposit`;
        this.url = this.location.prepareExternalUrl(
          this.router.serializeUrl(this.router.createUrlTree([path]))
        );
        this.url = `${this.url}/${resp.data.fdRdMasterModel.fdRdMasterId}/${this.rdProcessCycleCode}`;
        window.open(`${this.url}`, "_blank");
      });
    }
  }

  originationModel(basisId) {
    return {
      ...this.depositForm.value,
      basisDetailsId: basisId,
      applicationDate: moment(new Date()).format("DD-MMM-YYYY"),
      branchCode: this.tokenStore.getUser().branchCode,
      depositeType: this.depositeType,
      autoRenew: this.isAutoRenew,
      amount: parseInt(this.depositForm.value.amount),
      maturityAmount: 3778, //need to change once flexCube data avilable.
      maturityDate: moment(this.depositForm.value.maturityDate).format(
        "DD-MMM-YYYY"
      ),
      typeOfCustomer: this.depositForm.value.typeOfCustomer,
      intrestRate: 677, //need to change once flexCube data avilable.
      scheme: "Normal or Tax saver",
    };
  }

  formatLoanLabel(value) {
    return `₹ ${value}`;
  }
}
