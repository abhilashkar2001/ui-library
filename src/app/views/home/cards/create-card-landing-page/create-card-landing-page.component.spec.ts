import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCardLandingPageComponent } from './create-card-landing-page.component';

describe('CreateCardLandingPageComponent', () => {
  let component: CreateCardLandingPageComponent;
  let fixture: ComponentFixture<CreateCardLandingPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateCardLandingPageComponent]
    });
    fixture = TestBed.createComponent(CreateCardLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
