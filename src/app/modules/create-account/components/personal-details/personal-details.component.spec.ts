import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountPersonalDetailsComponent } from './personal-details.component';

describe('AccountPersonalDetailsComponent', () => {
  let component: AccountPersonalDetailsComponent;
  let fixture: ComponentFixture<AccountPersonalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountPersonalDetailsComponent],
    });
    fixture = TestBed.createComponent(AccountPersonalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
