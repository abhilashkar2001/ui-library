import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestStatementComponent } from './interest-statement.component';

describe('InterestStatementComponent', () => {
  let component: InterestStatementComponent;
  let fixture: ComponentFixture<InterestStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterestStatementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterestStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
