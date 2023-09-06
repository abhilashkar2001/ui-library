import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NewDepositService } from "../../../new-deposit.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CreateRdService } from "../create-rd.service";

@Component({
  selector: "app-create-cd",
  templateUrl: "./create-cd.component.html",
  styleUrls: ["./create-cd.component.scss"],
})
export class CreateCdComponent implements OnInit {
  createRdForm: FormGroup;
  @Output() customCreatRdForm = new EventEmitter<any>();
  @Output() customSaveCreate = new EventEmitter<{}>();

  selectedStep: number = 0;
  customBasicForm: any;
  isLinear = true;
  isEnabledEdit: boolean = false;
  saveTheEdit: boolean = false;
  constructor(
    private fb: FormBuilder,
    private fdApi: NewDepositService,
    private route: ActivatedRoute,
    private rdApi: CreateRdService,
    private router: Router
  ) {}

  ngOnInit(): void {
    var id = this.route.snapshot.params["id"];
    // this.buildCreateRdForm();
    var depositId = parseInt(sessionStorage.getItem("recurringDepositId"));
    if (id) {
      this.getRdById(depositId);
    } else {
      this.buildCreateRdForm();
      this.customCreatRdForm.emit(this.createRdForm);
    }
  }
  getRdById(id) {
    console.log(id);
    this.rdApi.getRdfromId(id).subscribe((resp: any) => {
      if (resp?.statusCode === 200) this.buildCreateRdForm(resp.data[0]);
    });
  }

  customSelectionChange(event) {
    // this.isFixedDepositDetail = event.isFixedDepositDetail;
    // this.isPersonalDetails = event.isPersonalDetails;
    // this.isBookFd = event.isBookFd;
  }

  buildCreateRdForm(data?) {
    this.createRdForm = this.fb.group({
      depositAmmount: [data ? data.amount : "", Validators.required],
      maturityDate: [data ? data.typeOfCustomer : "", Validators.required],
      interestRate: [data ? data.intrestRate : "", Validators.required],
      ownerShip: [data ? data.ownerShip : "", Validators.required],
      maturityAmount: [data ? data.maturityAmount : "", Validators.required],
      typeOfCustomer: [data ? data.typeOfCustomer : "", Validators.required],
      intrestPayout: [data ? data.intrestPayout : "", Validators.required],
      paymentType: [
        data?.paymentType ? data.paymentType : "",
        Validators.required,
      ],
      autoRenew: [data ? data.autoRenew : false],
      recurringDepositId: data && data.recurringDepositId,
    });
    this.customBasicForm = this.createRdForm;
    // setTimeout(() => {
    //   this.customCreatRdForm.emit(this.createRdForm);
    // }, 200);
  }

  submitCreateFd() {
    console.log(this.createRdForm.value);
    this.customCreatRdForm.emit(this.createRdForm);
    this.customSaveCreate.emit({ satus: true });
  }

  editRecord() {
    this.isEnabledEdit = true;
    this.saveTheEdit = true;
  }
  onExit() {
    window.close();
  }
}
