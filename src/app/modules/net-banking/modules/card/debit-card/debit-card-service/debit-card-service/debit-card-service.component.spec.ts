import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitCardServiceComponent } from './debit-card-service.component';

describe('DebitCardServiceComponent', () => {
  let component: DebitCardServiceComponent;
  let fixture: ComponentFixture<DebitCardServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebitCardServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebitCardServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
