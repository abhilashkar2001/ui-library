import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryAccountComponent } from './salary-account.component';

describe('SalaryAccountComponent', () => {
  let component: SalaryAccountComponent;
  let fixture: ComponentFixture<SalaryAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
