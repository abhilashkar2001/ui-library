import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectNewCardPopupComponent } from './select-new-card-popup.component';

describe('SelectNewCardPopupComponent', () => {
  let component: SelectNewCardPopupComponent;
  let fixture: ComponentFixture<SelectNewCardPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectNewCardPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectNewCardPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
