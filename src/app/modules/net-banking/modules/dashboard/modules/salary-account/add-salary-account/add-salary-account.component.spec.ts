import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSalaryAccountComponent } from './add-salary-account.component';

describe('AddSalaryAccountComponent', () => {
  let component: AddSalaryAccountComponent;
  let fixture: ComponentFixture<AddSalaryAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddSalaryAccountComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddSalaryAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
