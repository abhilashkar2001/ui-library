import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcCustomPayFromComponent } from './ic-custom-pay-from.component';

describe('IcCustomPayFromComponent', () => {
  let component: IcCustomPayFromComponent;
  let fixture: ComponentFixture<IcCustomPayFromComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IcCustomPayFromComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IcCustomPayFromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
