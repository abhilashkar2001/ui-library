import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { InfoPopupComponent } from './info-popup/info-popup.component';
import { Router } from '@angular/router';
import { CreateRdService } from '../../rd-calculator/create-rd.service';
import { Location } from '@angular/common';
import * as moment from 'moment';
import {
  AppState,
  LocaleData,
  selectLocaleData,
  selectUser,
  User,
} from '@onerumango/utils';
import { FdCalculatorServiceService } from '../../fd-calculator/fd-calculator-service.service';
import { NewDepositService } from 'app/modules/origination/modules/new-deposit/new-deposit.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-return-calculator',
  templateUrl: './return-calculator.component.html',
  styleUrls: ['./return-calculator.component.scss'],
})
export class ReturnCalculatorComponent implements OnInit, OnChanges {
  max = 100000;
  min = 1000;
  ammountValue = 0;
  depositForm!: FormGroup;
  @Input() rdFdValue: any;
  @Input() fdName: any;
  @Output() customCalculatorValues = new EventEmitter<any>();

  amount = new FormControl('');
  email = new FormControl('');
  thumbLabel: boolean | any = true;
  name = 'Angular 5';
  url = '';
  rdBasisId: any;
  fdBasisId: any;
  isAutoRenew = false;
  basisId: any;
  depositeType: any;
  processCycleCode: any;
  rdProcessCycleCode: any;
  staticData = {
    TYPESOFCUSTOMER: [],
    INTERESTPAYOUT: [],
    MONTHLYSAVINGS: [],
    OWNERSHIP: [],
    SCHEME: [],
  };
  typesOfCustomer: string[] | any;
  interestPayout: string[] | any;
  monthlySavings: string[] | any;
  ownership: string[] | any;
  scheme: string[] | any;
  otherUserInfo: LocaleData | undefined;
  currentUser: User | undefined;
  subscriptions: Subscription[] = [];
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private location: Location,
    private rdApi: CreateRdService,
    private FdCalculatorServiceService: FdCalculatorServiceService,
    private newDepositeService: NewDepositService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private store: Store<AppState>,
  ) {
    this.matIconRegistry.addSvgIcon(
      `info-outlined-gray`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/info-circle-gray.svg',
      ),
    );
  }

  ngOnInit(): void {
    this.getGenericDetails();
    this.buildForm();
    this.fdFlowData();
    const loadUserProfileSub = this.store
      .select(selectUser)
      .subscribe((result) => {
        if (result) this.currentUser = result;
      });

    const localeDataSub = this.store
      .select(selectLocaleData)
      .subscribe((result) => {
        if (result) this.otherUserInfo = result;
      });

    this.subscriptions.push(loadUserProfileSub);
    this.subscriptions.push(localeDataSub);
  }
  getGenericDetails() {
    this.newDepositeService
      .genericValue('website', Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.typesOfCustomer = resp.data['TYPESOFCUSTOMER'];
          this.interestPayout = resp.data['INTERESTPAYOUT'];
          this.monthlySavings = resp.data['MONTHLYSAVINGS'];
          this.ownership = resp.data['OWNERSHIP'];
          this.scheme = resp.data['SCHEME'];
        }
      });
  }
  ngOnChanges(changes: SimpleChanges | any) {
    if (changes.rdFdValue) {
      localStorage.removeItem('rdBasisId');
      this.rdFdValue = changes.rdFdValue.currentValue;
      console.log(this.rdFdValue);
      if (this.rdFdValue === 'rdCalculator')
        this.rdApi.getBusinessSuite('Deposit Service').subscribe((resp) => {
          if (resp?.statusCode === 200) {
            this.getSubClass(resp.data).then((val: any) => {
              this.rdBasisId = val[0].productDetails[0].basisId;
              this.rdProcessCycleCode =
                val[0].productDetails[0].processCycleCode;
            });
          }
        });
      else if (this.rdFdValue === 'fdCalculator') {
        this.fdFlowData();
      }
      if (this.depositForm) this.depositForm.reset();
    }
  }

  // getSub Class list
  getSubClass(data: any) {
    return new Promise((resolve) => {
      const rdClass = data.filter((item: any) =>
        item.basisClass.toLowerCase().includes('rd'),
      );
      let rdResp = {};
      this.rdApi.getBasisClass(rdClass[0].basisClass).subscribe((resp) => {
        if (resp?.statusCode === 200) {
          rdResp = resp.data;
          resolve(rdResp);
        } else {
          return;
        }
      });
    });
  }

  fdFlowData() {
    this.FdCalculatorServiceService.getFdTypes().subscribe((resp: any) => {
      if (resp?.statusCode == 200) {
        this.FdCalculatorServiceService.fetchSubClass(
          resp?.data[0]?.basisClass,
        ).subscribe((resp) => {
          if (resp?.statusCode == 200) {
            this.fdBasisId = resp?.data[0]?.productDetails[0]?.basisId;
            this.processCycleCode =
              resp?.data[0]?.productDetails[0]?.processCycleCode;
          }
        });
      }
    });
  }

  onSliderChange(e: any) {
    console.log(e);
    this.ammountValue = e.srcElement.ariaValueText;
    this.depositForm.get('amount')?.setValue(this.ammountValue);
  }
  buildForm() {
    this.depositForm = this.fb.group({
      amount: 0,
      tenureYear: '',
      tenureMonth: '',
      tenureDays: '',
      scheme: '',
      ownership: '',
      intrestPayout: '',
      typeOfCustomer: '',
      monthlySavings: '',
    });
  }
  updateDeposit() {
    console.log(this.depositForm.value);
    this.customCalculatorValues.emit(this.depositForm.value);
  }

  openInterestDialog(): void {
    this.dialog.open(InfoPopupComponent, {
      width: '700px',
      height: '400px',
    });
  }

  openLink(fdType: string) {
    let path;
    this.depositeType = fdType;
    if (fdType == 'FD') {
      const payload = this.originationModel(this.fdBasisId);
      const finalPayload = {
        originationModel: payload,
        customerInfo: [],
      };
      this.FdCalculatorServiceService.saveFdOriginationMaster(
        finalPayload,
      ).subscribe((resp) => {
        path = '/deposits/fdFlow/fdDetails';
        this.url = this.location.prepareExternalUrl(
          this.router.serializeUrl(this.router.createUrlTree([path])),
        );
        this.url = `${this.url}/${resp.data.fdRdMasterModel.fdRdMasterId}/${this.processCycleCode}`;
        window.open(`${this.url}`, '_blank');
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
          this.router.serializeUrl(this.router.createUrlTree([path])),
        );
        this.url = `${this.url}/${resp.data.fdRdMasterModel.fdRdMasterId}/${this.rdProcessCycleCode}`;
        window.open(`${this.url}`, '_blank');
      });
    }
  }

  originationModel(basisId: number) {
    return {
      ...this.depositForm.value,
      basisDetailsId: basisId,
      applicationDate: moment(new Date()).format('DD-MMM-YYYY'),
      branchCode: this.currentUser?.branchId,
      depositeType: this.depositeType,
      autoRenew: this.isAutoRenew,
      amount: parseInt(this.depositForm.value.amount),
      maturityAmount: 3778, //need to change once flexCube data avilable.
      maturityDate: moment(this.depositForm.value.maturityDate).format(
        'DD-MMM-YYYY',
      ),
      typeOfCustomer: this.depositForm.value.typeOfCustomer,
      intrestRate: 677, //need to change once flexCube data avilable.
      scheme: 'Normal or Tax saver',
    };
  }
}
