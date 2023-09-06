import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileVerificationComponent } from './mobile-verification.component';

describe('MobileVerificationComponent', () => {
  let component: MobileVerificationComponent;
  let fixture: ComponentFixture<MobileVerificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MobileVerificationComponent]
    });
    fixture = TestBed.createComponent(MobileVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
