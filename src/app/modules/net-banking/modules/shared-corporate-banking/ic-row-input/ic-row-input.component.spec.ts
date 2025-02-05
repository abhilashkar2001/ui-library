import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcRowInputComponent } from './ic-row-input.component';

describe('IcRowInputComponent', () => {
  let component: IcRowInputComponent;
  let fixture: ComponentFixture<IcRowInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IcRowInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IcRowInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
