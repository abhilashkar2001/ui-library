import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewEefcComponent } from './add-new-eefc.component';

describe('AddNewEefcComponent', () => {
  let component: AddNewEefcComponent;
  let fixture: ComponentFixture<AddNewEefcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewEefcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewEefcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
