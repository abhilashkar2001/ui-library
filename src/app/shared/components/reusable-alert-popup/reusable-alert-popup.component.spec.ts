import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableAlertPopupComponent } from './reusable-alert-popup.component';

describe('ReusableAlertPopupComponent', () => {
  let component: ReusableAlertPopupComponent;
  let fixture: ComponentFixture<ReusableAlertPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReusableAlertPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReusableAlertPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
