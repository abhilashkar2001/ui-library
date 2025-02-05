import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorNotifierPopupComponent } from './error-notifier-popup.component';

describe('ErrorNotifierPopupComponent', () => {
  let component: ErrorNotifierPopupComponent;
  let fixture: ComponentFixture<ErrorNotifierPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorNotifierPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorNotifierPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
