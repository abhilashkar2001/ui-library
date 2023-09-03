import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanUserPersonalDetailsComponent } from './loan-user-personal-details.component';

describe('LoanUserPersonalDetailsComponent', () => {
  let component: LoanUserPersonalDetailsComponent;
  let fixture: ComponentFixture<LoanUserPersonalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoanUserPersonalDetailsComponent]
    });
    fixture = TestBed.createComponent(LoanUserPersonalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
