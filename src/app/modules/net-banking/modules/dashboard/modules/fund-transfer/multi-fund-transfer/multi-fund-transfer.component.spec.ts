import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiFundTransferComponent } from './multi-fund-transfer.component';

describe('MultiFundTransferComponent', () => {
  let component: MultiFundTransferComponent;
  let fixture: ComponentFixture<MultiFundTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiFundTransferComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiFundTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
