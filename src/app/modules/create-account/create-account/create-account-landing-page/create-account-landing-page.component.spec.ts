import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountLandingPageComponent } from './create-account-landing-page.component';

describe('CreateAccountLandingPageComponent', () => {
  let component: CreateAccountLandingPageComponent;
  let fixture: ComponentFixture<CreateAccountLandingPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateAccountLandingPageComponent]
    });
    fixture = TestBed.createComponent(CreateAccountLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
