import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertToEmiComponent } from './convert-to-emi.component';

describe('ConvertToEmiComponent', () => {
  let component: ConvertToEmiComponent;
  let fixture: ComponentFixture<ConvertToEmiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConvertToEmiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConvertToEmiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
