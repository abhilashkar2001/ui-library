import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculateEmiComponent } from './calculate-emi.component';

describe('CalculateEmiComponent', () => {
  let component: CalculateEmiComponent;
  let fixture: ComponentFixture<CalculateEmiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculateEmiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculateEmiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
