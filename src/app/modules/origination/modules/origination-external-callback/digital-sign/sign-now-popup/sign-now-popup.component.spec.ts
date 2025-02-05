import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignNowPopupComponent } from './sign-now-popup.component';

describe('SignNowPopupComponent', () => {
  let component: SignNowPopupComponent;
  let fixture: ComponentFixture<SignNowPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignNowPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SignNowPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
