import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillSectionCValuesComponent } from './bill-section-c-values.component';

describe('BillSectionCValuesComponent', () => {
  let component: BillSectionCValuesComponent;
  let fixture: ComponentFixture<BillSectionCValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillSectionCValuesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillSectionCValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
