import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTypeSelectorDialogComponent } from './customer-type-selector-dialog.component';

describe('CustomerTypeSelectorDialogComponent', () => {
  let component: CustomerTypeSelectorDialogComponent;
  let fixture: ComponentFixture<CustomerTypeSelectorDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerTypeSelectorDialogComponent],
    });
    fixture = TestBed.createComponent(CustomerTypeSelectorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
