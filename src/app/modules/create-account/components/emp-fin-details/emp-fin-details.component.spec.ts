import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpFinDetailsComponent } from './emp-fin-details.component';

describe('EmpFinDetailsComponent', () => {
  let component: EmpFinDetailsComponent;
  let fixture: ComponentFixture<EmpFinDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmpFinDetailsComponent],
    });
    fixture = TestBed.createComponent(EmpFinDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
