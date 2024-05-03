import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillSectionBComponent } from './bill-section-b.component';

describe('BillSectionBComponent', () => {
  let component: BillSectionBComponent;
  let fixture: ComponentFixture<BillSectionBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillSectionBComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillSectionBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
