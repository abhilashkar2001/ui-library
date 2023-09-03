import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalDetailsWithMultipleCustomerComponent } from './personal-details-with-multiple-customer.component';

describe('PersonalDetailsWithMultipleCustomerComponent', () => {
  let component: PersonalDetailsWithMultipleCustomerComponent;
  let fixture: ComponentFixture<PersonalDetailsWithMultipleCustomerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonalDetailsWithMultipleCustomerComponent]
    });
    fixture = TestBed.createComponent(PersonalDetailsWithMultipleCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
