import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeBookDetailComponent } from './cheque-book-detail.component';

describe('ChequeBookDetailsComponent', () => {
  let component: ChequeBookDetailComponent;
  let fixture: ComponentFixture<ChequeBookDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChequeBookDetailComponent],
    });
    fixture = TestBed.createComponent(ChequeBookDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
