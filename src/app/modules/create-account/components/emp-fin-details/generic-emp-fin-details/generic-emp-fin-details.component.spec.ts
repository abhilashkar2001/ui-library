import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericEmpFinDetailsComponent } from './generic-emp-fin-details.component';

describe('GenericEmpFinDetailsComponent', () => {
  let component: GenericEmpFinDetailsComponent;
  let fixture: ComponentFixture<GenericEmpFinDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenericEmpFinDetailsComponent],
    });
    fixture = TestBed.createComponent(GenericEmpFinDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
