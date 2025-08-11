import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeBookLoginComponent } from './cheque-book-login.component';

describe('ChequeBookLoginComponent', () => {
  let component: ChequeBookLoginComponent;
  let fixture: ComponentFixture<ChequeBookLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChequeBookLoginComponent]
    });
    fixture = TestBed.createComponent(ChequeBookLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
