import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-generic-emp-fin-details',
  templateUrl: './generic-emp-fin-details.component.html',
  styleUrls: ['./generic-emp-fin-details.component.scss'],
})
export class GenericEmpFinDetailsComponent {
  @Input() detailsForGeneric: any;
  @Output() genericForm = new EventEmitter();

  empStatus: any = [];
  indSector: any = [];
  monthlyIncome: any = [];
  srcFunds: any = [];

  empFinDetails: FormGroup | any;
  validationConfig = {
    individual: {
      empStatus: [Validators.required],
      industrySector: [Validators.required],
      estMonthlyIncome: [Validators.required],
      srcOfFunds: [Validators.required],
    },
    joint: {
      empStatus: [Validators.required],
      industrySector: [Validators.required],
      estMonthlyIncome: [Validators.required],
      srcOfFunds: [Validators.required],
    },
    minor: {
      empStatus: [Validators.required],
      industrySector: [Validators.required],
      estMonthlyIncome: [Validators.required],
      srcOfFunds: [Validators.required],
    },
    corporate: {
      empStatus: [Validators.required],
      industrySector: [Validators.required],
      estMonthlyIncome: [Validators.required],
      srcOfFunds: [Validators.required],
    },
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.createEmpFinDetailsForm();
    this.onCreateGroupFormValueChange();
  }

  onCreateGroupFormValueChange() {
    this.empFinDetails.valueChanges.subscribe(() => {
      this.genericForm.emit(this.empFinDetails);
    });
  }

  createEmpFinDetailsForm() {
    this.empFinDetails = this.fb.group({
      empStatus: ['', []],
      occupation: ['', []],
      industrySector: ['', []],
      employerName: ['', []],
      empActivity: ['', []],
      farmingActivity: ['', []],
      estMonthlyIncome: ['', []],
      srcOfFunds: ['', []],
      incSrcDesp: ['', []],
    });
    this.addUpdateValidators();
  }

  addUpdateValidators() {
    const accountType = this.detailsForGeneric
      .accountType as keyof typeof this.validationConfig;
    const configForType = this.validationConfig[accountType] || {};
    this.applyValidators(configForType);
  }

  applyValidators(config: any) {
    Object.keys(this.empFinDetails.controls).forEach((field) => {
      const control = this.empFinDetails.get(field);
      if (control) {
        const validators = config[field] || [];
        control.setValidators(validators);
        control.updateValueAndValidity();
      }
    });
  }

  onSave() {
    console.log(this.empFinDetails);
    if (this.empFinDetails.invalid) {
      this.empFinDetails.markAllAsTouched();
    }
  }
}
