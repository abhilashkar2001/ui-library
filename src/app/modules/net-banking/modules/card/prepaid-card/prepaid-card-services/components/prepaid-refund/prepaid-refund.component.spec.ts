import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepaidRefundComponent } from './prepaid-refund.component';

describe('PrepaidRefundComponent', () => {
  let component: PrepaidRefundComponent;
  let fixture: ComponentFixture<PrepaidRefundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrepaidRefundComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrepaidRefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
