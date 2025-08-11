import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeBookDetailsComponent } from './cheque-book-details.component';

describe('ChequeBookDetailsComponent', () => {
  let component: ChequeBookDetailsComponent;
  let fixture: ComponentFixture<ChequeBookDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChequeBookDetailsComponent]
    });
    fixture = TestBed.createComponent(ChequeBookDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
