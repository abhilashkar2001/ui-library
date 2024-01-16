import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignPadComponent } from './sign-pad.component';

describe('SignPadComponent', () => {
  let component: SignPadComponent;
  let fixture: ComponentFixture<SignPadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignPadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignPadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
