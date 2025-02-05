import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsSubmitDialogComponent } from './savings-submit-dialog.component';

describe('SavingsSubmitDialogComponent', () => {
  let component: SavingsSubmitDialogComponent;
  let fixture: ComponentFixture<SavingsSubmitDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SavingsSubmitDialogComponent],
    });
    fixture = TestBed.createComponent(SavingsSubmitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
