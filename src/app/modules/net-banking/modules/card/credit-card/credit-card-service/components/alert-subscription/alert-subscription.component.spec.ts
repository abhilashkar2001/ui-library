import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertSubscriptionComponent } from './alert-subscription.component';

describe('AlertSubscriptionComponent', () => {
  let component: AlertSubscriptionComponent;
  let fixture: ComponentFixture<AlertSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertSubscriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
