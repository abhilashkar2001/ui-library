import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportLoanDetailsComponent } from './export-loan-details.component';

describe('ExportLoanDetailsComponent', () => {
  let component: ExportLoanDetailsComponent;
  let fixture: ComponentFixture<ExportLoanDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportLoanDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportLoanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
