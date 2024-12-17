import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSuccessPopupComponent } from './custom-success-popup.component';

describe('CustomSuccessPopupComponent', () => {
  let component: CustomSuccessPopupComponent;
  let fixture: ComponentFixture<CustomSuccessPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomSuccessPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomSuccessPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
