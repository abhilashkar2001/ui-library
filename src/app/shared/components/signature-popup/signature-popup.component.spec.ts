import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignaturePopupComponent } from './signature-popup.component';

describe('SignaturePopupComponent', () => {
  let component: SignaturePopupComponent;
  let fixture: ComponentFixture<SignaturePopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignaturePopupComponent]
    });
    fixture = TestBed.createComponent(SignaturePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
