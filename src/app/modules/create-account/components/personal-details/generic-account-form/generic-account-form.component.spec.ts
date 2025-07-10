import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericAccountFormComponent } from './generic-account-form.component';

describe('GenericAccountFormComponent', () => {
  let component: GenericAccountFormComponent;
  let fixture: ComponentFixture<GenericAccountFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenericAccountFormComponent]
    });
    fixture = TestBed.createComponent(GenericAccountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
