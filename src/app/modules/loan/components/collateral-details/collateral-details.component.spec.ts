import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollateralDetailsComponent } from './collateral-details.component';

describe('CollateralDetailsComponent', () => {
  let component: CollateralDetailsComponent;
  let fixture: ComponentFixture<CollateralDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollateralDetailsComponent],
    });
    fixture = TestBed.createComponent(CollateralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
