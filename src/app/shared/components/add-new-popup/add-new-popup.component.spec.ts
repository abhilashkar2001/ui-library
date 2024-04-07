import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPopupComponent } from './add-new-popup.component';

describe('AddNewPopupComponent', () => {
  let component: AddNewPopupComponent;
  let fixture: ComponentFixture<AddNewPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
