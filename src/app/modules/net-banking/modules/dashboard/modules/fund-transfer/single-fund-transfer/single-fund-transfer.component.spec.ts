import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleFundTransferComponent } from './single-fund-transfer.component';

describe('SingleFundTransferComponent', () => {
  let component: SingleFundTransferComponent;
  let fixture: ComponentFixture<SingleFundTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleFundTransferComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SingleFundTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
