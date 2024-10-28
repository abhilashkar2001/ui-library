import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitCardDashboardComponent } from './debit-card-dashboard.component';

describe('DebitCardDashboardComponent', () => {
  let component: DebitCardDashboardComponent;
  let fixture: ComponentFixture<DebitCardDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebitCardDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebitCardDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
