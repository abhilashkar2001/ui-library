import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankCodePanelComponent } from './bank-code-panel.component';

describe('BankCodePanelComponent', () => {
  let component: BankCodePanelComponent;
  let fixture: ComponentFixture<BankCodePanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BankCodePanelComponent],
    });
    fixture = TestBed.createComponent(BankCodePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
