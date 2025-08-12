import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAccountDetailsComponent } from './custom-account-details.component';

describe('CustomAccountDetailsComponent', () => {
  let component: CustomAccountDetailsComponent;
  let fixture: ComponentFixture<CustomAccountDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomAccountDetailsComponent]
    });
    fixture = TestBed.createComponent(CustomAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
