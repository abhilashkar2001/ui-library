import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositLandingPageComponent } from './deposit-landing-page.component';

describe('DepositLandingPageComponent', () => {
  let component: DepositLandingPageComponent;
  let fixture: ComponentFixture<DepositLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepositLandingPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DepositLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
