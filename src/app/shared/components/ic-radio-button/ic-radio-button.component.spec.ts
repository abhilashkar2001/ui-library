import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcRadioButtonComponent } from './ic-radio-button.component';

describe('IcRadioButtonComponent', () => {
  let component: IcRadioButtonComponent;
  let fixture: ComponentFixture<IcRadioButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IcRadioButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IcRadioButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
