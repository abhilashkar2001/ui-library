import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountsComponent } from './account-mobile-verification.component';

describe('AccountDetailsComponent', () => {
  let component: CreateAccountsComponent;
  let fixture: ComponentFixture<CreateAccountsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateAccountsComponent]
    });
    fixture = TestBed.createComponent(CreateAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
