import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountServicesComponent } from './account-services.component';

describe('AccountServicesComponent', () => {
  let component: AccountServicesComponent;
  let fixture: ComponentFixture<AccountServicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountServicesComponent]
    });
    fixture = TestBed.createComponent(AccountServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
