import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxBenefitsComponent } from './tax-benefits.component';

describe('TaxBenefitsComponent', () => {
  let component: TaxBenefitsComponent;
  let fixture: ComponentFixture<TaxBenefitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxBenefitsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxBenefitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
