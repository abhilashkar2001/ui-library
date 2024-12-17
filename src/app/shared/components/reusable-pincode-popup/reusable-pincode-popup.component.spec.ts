import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusablePincodePopupComponent } from './reusable-pincode-popup.component';

describe('ReusablePincodePopupComponent', () => {
  let component: ReusablePincodePopupComponent;
  let fixture: ComponentFixture<ReusablePincodePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReusablePincodePopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReusablePincodePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
