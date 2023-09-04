import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingProfileComponent } from './landing-profile.component';

describe('LandingProfileComponent', () => {
  let component: LandingProfileComponent;
  let fixture: ComponentFixture<LandingProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
