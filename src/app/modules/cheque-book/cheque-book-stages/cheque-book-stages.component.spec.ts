import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeBookStagesComponent } from './cheque-book-stages.component';

describe('ChequeBookStagesComponent', () => {
  let component: ChequeBookStagesComponent;
  let fixture: ComponentFixture<ChequeBookStagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChequeBookStagesComponent]
    });
    fixture = TestBed.createComponent(ChequeBookStagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
