import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCollateralComponent } from './add-collateral.component';

describe('AddCollateralComponent', () => {
  let component: AddCollateralComponent;
  let fixture: ComponentFixture<AddCollateralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCollateralComponent]
    });
    fixture = TestBed.createComponent(AddCollateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
