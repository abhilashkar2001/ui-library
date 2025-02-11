import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewDepositService } from '../../../new-deposit.service';
import { ActivatedRoute } from '@angular/router';
import { CreateRdService } from '../create-rd.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

@Component({
  selector: 'app-create-cd',
  templateUrl: './create-cd.component.html',
  styleUrls: ['./create-cd.component.scss'],
})
export class CreateCdComponent implements OnInit {
  createRdForm!: FormGroup;
  @Output() customCreatRdForm = new EventEmitter<any>();
  @Output() customSaveCreate = new EventEmitter<object>();

  selectedStep = 0;
  customBasicForm: any;
  isLinear = true;
  isEnabledEdit = false;
  saveTheEdit = false;
  staticData = {
    TYPESOFCUSTOMER: [],
    INTERESTPAYOUT: [],
    OWNERSHIP: [],
    PAYMENTTYPE: [],
  };
  typesOfCustomer: string[] | any;
  interestPayout: string[] | any;
  ownership: string[] | any;
  paymentType: string[] | any;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private rdApi: CreateRdService,
    private newDepositeService: NewDepositService,
    private sessionStorageService: SessionStorageService,
  ) {}

  ngOnInit(): void {
    this.getGenericDetails();
    console.log(this.route.snapshot);
    let id = this.route.snapshot.params['id'];
    console.log(id);
    // this.buildCreateRdForm();
    id = parseInt(id);
    if (id) {
      this.getRdById(id);
    } else {
      this.buildCreateRdForm();
      this.customCreatRdForm.emit(this.createRdForm);
    }
  }

  getGenericDetails() {
    this.newDepositeService
      .genericValue('website', Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.typesOfCustomer = resp.data['TYPESOFCUSTOMER'];
          this.interestPayout = resp.data['INTERESTPAYOUT'];
          this.ownership = resp.data['OWNERSHIP'];
          this.paymentType = resp.data['PAYMENTTYPE'];
        }
      });
  }

  getRdById(id: any) {
    console.log(id);
    this.rdApi.getRdDetails(id).subscribe((resp: any) => {
      if (resp?.statusCode === 200) {
        this.buildCreateRdForm(resp.data[0]);
      }
    });
  }

  customSelectionChange() {
    // this.isFixedDepositDetail = event.isFixedDepositDetail;
    // this.isPersonalDetails = event.isPersonalDetails;
    // this.isBookFd = event.isBookFd;
  }

  buildCreateRdForm(data?: any) {
    this.createRdForm = this.fb.group({
      amount: [data ? data.amount : '', Validators.required],
      maturityDate: [
        data ? new Date(data.maturityDate) : '',
        Validators.required,
      ],
      intrestRate: [data ? data.intrestRate : '', Validators.required],
      ownership: [data ? data.ownership : '', Validators.required],
      maturityAmount: [data ? data.maturityAmount : '', Validators.required],
      typeOfCustomer: [data ? data.typeOfCustomer : '', Validators.required],
      intrestPayout: [data ? data.intrestPayout : '', Validators.required],
      paymentType: [
        data?.paymentType ? data.paymentType : '',
        Validators.required,
      ],
      autoRenew: [data ? data.autoRenew : false],
      fdRdMasterId: data && data.fdRdMasterId,
      originationProductId: data && data.originationProductId,
    });
    this.customBasicForm = this.createRdForm;
    // setTimeout(() => {
    //   this.customCreatRdForm.emit(this.createRdForm);
    // }, 200);
  }

  submitCreateFd() {
    console.log(this.createRdForm.value);
    this.customCreatRdForm.emit(this.createRdForm);
    this.customSaveCreate.emit({
      satus: true,
      rdData: this.createRdForm.value,
    });
  }

  editRecord() {
    this.isEnabledEdit = true;
    this.saveTheEdit = true;
  }
  onExit() {
    window.close();
  }
  onPaymentTypeChange(e: any) {
    this.sessionStorageService.setPaymentType(e);
  }
}
