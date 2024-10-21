import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankCodePopupComponent } from './bank-code-popup.component';

describe('BankCodePopupComponent', () => {
  let component: BankCodePopupComponent;
  let fixture: ComponentFixture<BankCodePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankCodePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankCodePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
