import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-employment-financial-details',
  templateUrl: './employment-financial-details.component.html',
  styleUrls: ['./employment-financial-details.component.scss'],
})
export class EmploymentFinancialDetailsComponent implements OnInit {
  employeeFinacialForm!: FormGroup;

  prefixArray = [
    { id: 1, values: 'Salaried' },
    { id: 2, values: 'Self-Employed' },
    { id: 3, values: 'Farmer' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildEmploymentFinancialDetails();
  }

  buildEmploymentFinancialDetails() {
    this.employeeFinacialForm = this.fb.group({
      prefixId: [null, Validators.required],
      occupation: [''],
      industrySector: [null, Validators.required],
      employerName: [''],
      employmentActivity: ['', []],
      farmingActivity: ['', []],
      estimatedMonthlyIncome: [null, Validators.required],
      sourceOfFunds: [null, Validators.required],
      incSrcDesp: ['', []],
    });
  }
}
