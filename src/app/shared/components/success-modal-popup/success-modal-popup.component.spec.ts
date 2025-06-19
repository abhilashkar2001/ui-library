import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessModalPopupComponent } from './success-modal-popup.component';

describe('SuccessModalPopupComponent', () => {
  let component: SuccessModalPopupComponent;
  let fixture: ComponentFixture<SuccessModalPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuccessModalPopupComponent]
    });
    fixture = TestBed.createComponent(SuccessModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
