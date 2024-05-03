import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillSectionAComponent } from './bill-section-a.component';

describe('BillSectionAComponent', () => {
  let component: BillSectionAComponent;
  let fixture: ComponentFixture<BillSectionAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillSectionAComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillSectionAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
