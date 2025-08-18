import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-employment-financial-details',
  templateUrl: './employment-financial-details.component.html',
  styleUrls: ['./employment-financial-details.component.scss'],
})
export class EmploymentFinancialDetailsComponent implements OnInit {
  employeeFinacialForm!: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildEmploymentFinancialDetails();
  }

  buildEmploymentFinancialDetails() {
    this.employeeFinacialForm = this.fb.group({});
  }
}
