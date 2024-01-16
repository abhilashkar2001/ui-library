import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignLaterComponent } from './sign-later.component';

describe('SignLaterComponent', () => {
  let component: SignLaterComponent;
  let fixture: ComponentFixture<SignLaterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignLaterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignLaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
