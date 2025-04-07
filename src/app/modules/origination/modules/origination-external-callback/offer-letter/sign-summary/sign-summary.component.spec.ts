import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignSummaryComponent } from './sign-summary.component';

describe('SignSummaryComponent', () => {
  let component: SignSummaryComponent;
  let fixture: ComponentFixture<SignSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignSummaryComponent],
    });
    fixture = TestBed.createComponent(SignSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
