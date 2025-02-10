import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninTrackComponent } from './signin-track.component';

describe('SigninTrackComponent', () => {
  let component: SigninTrackComponent;
  let fixture: ComponentFixture<SigninTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SigninTrackComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SigninTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
