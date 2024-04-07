import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllInOnePopupComponent } from './all-in-one-popup.component';

describe('AllInOnePopupComponent', () => {
  let component: AllInOnePopupComponent;
  let fixture: ComponentFixture<AllInOnePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllInOnePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllInOnePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
