import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewErrorPopupComponent } from './new-error-popup.component';

describe('NewErrorPopupComponent', () => {
  let component: NewErrorPopupComponent;
  let fixture: ComponentFixture<NewErrorPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewErrorPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewErrorPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
