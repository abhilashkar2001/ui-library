import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { tap, map, catchError, of } from 'rxjs';
import { CardSerivce } from '../../card.service';
import { EmpAndFinInfoPayload } from '../../cardModel';

@Component({
  selector: 'app-employment-financial-details',
  templateUrl: './employment-financial-details.component.html',
  styleUrls: ['./employment-financial-details.component.scss'],
})
export class EmploymentFinancialDetailsComponent implements OnInit {
  employeeFinacialForm!: FormGroup;
  @Input() screenCode!: number;
  @Input() screenName!: string;
  prefixArray = [
    { id: 1, values: 'Salaried' },
    { id: 2, values: 'Self-Employed' },
    { id: 3, values: 'Farmer' },
  ];
  originationId!: number | null;

  constructor(
    private fb: FormBuilder,
    private sessionStorageService: SessionStorageService,
    private cardService: CardSerivce,
  ) {}

  ngOnInit() {
    this.originationId = this.sessionStorageService.getOriginationId();
    this.buildEmploymentFinancialDetails();
  }

  buildEmploymentFinancialDetails() {
    this.employeeFinacialForm = this.fb.group({
      id: [''],
      employmentStatusId: [null, Validators.required],
      occupation: [''],
      industrySectorId: [null, Validators.required],
      employerName: [''],
      employerActivity: ['', []],
      farmingActivity: ['', []],
      estimatedMonthIncomeId: [null, Validators.required],
      sourceOfFundsId: [null, Validators.required],
      incomeSourceDesc: ['', []],
    });
  }

  submitForm() {
    return this.handleSubmit().toPromise();
  }

  handleSubmit() {
    const payload: EmpAndFinInfoPayload = {
      id: this.originationId,
      screenCode: this.screenCode,
      empAndFinInfo: this.employeeFinacialForm.value,
    };

    return this.cardService.saveEmployeementFinancialDetails(payload).pipe(
      tap((res) => {
        console.log(res);
      }),
      map((res: any) =>
        res?.statusCode == 200 || res?.statusCode == 201
          ? ('success' as const)
          : ('failure' as const),
      ),
      catchError((_err) => {
        console.error(_err);
        return of('failure' as const);
      }),
    );
  }
}
