import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExportSwBillComponent } from './add-export-sw-bill.component';

describe('AddExportSwBillComponent', () => {
  let component: AddExportSwBillComponent;
  let fixture: ComponentFixture<AddExportSwBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddExportSwBillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddExportSwBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
