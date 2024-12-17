import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursmentRequestComponent } from './disbursment-request.component';

describe('DisbursmentRequestComponent', () => {
  let component: DisbursmentRequestComponent;
  let fixture: ComponentFixture<DisbursmentRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisbursmentRequestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DisbursmentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
