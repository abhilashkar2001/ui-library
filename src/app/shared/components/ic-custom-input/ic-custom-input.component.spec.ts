import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcCustomInputComponent } from './ic-custom-input.component';

describe('IcCustomInputComponent', () => {
  let component: IcCustomInputComponent;
  let fixture: ComponentFixture<IcCustomInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IcCustomInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IcCustomInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
