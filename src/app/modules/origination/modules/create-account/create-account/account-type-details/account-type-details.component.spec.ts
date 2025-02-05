import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTypeDetailsComponent } from './account-type-details.component';

describe('AccountTypeDetailsComponent', () => {
  let component: AccountTypeDetailsComponent;
  let fixture: ComponentFixture<AccountTypeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountTypeDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountTypeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
