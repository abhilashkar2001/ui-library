import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DobVerificationComponent } from './dob-verification.component';

describe('DobVerificationComponent', () => {
  let component: DobVerificationComponent;
  let fixture: ComponentFixture<DobVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DobVerificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DobVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
