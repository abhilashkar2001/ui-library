import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLoanLandingPageComponent } from './create-loan-landing-page.component';

describe('CreateLoanLandingPageComponent', () => {
  let component: CreateLoanLandingPageComponent;
  let fixture: ComponentFixture<CreateLoanLandingPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateLoanLandingPageComponent]
    });
    fixture = TestBed.createComponent(CreateLoanLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
