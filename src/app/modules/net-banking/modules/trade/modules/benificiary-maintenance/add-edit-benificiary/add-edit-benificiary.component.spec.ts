import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditBenificiaryComponent } from './add-edit-benificiary.component';

describe('AddEditBenificiaryComponent', () => {
  let component: AddEditBenificiaryComponent;
  let fixture: ComponentFixture<AddEditBenificiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditBenificiaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditBenificiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
