import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnbilledTransactionComponent } from './unbilled-transaction.component';

describe('UnbilledTransactionComponent', () => {
  let component: UnbilledTransactionComponent;
  let fixture: ComponentFixture<UnbilledTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnbilledTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnbilledTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
