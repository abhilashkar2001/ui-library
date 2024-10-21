import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcActionButtonComponent } from './ic-action-button.component';

describe('IcActionButtonComponent', () => {
  let component: IcActionButtonComponent;
  let fixture: ComponentFixture<IcActionButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IcActionButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IcActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
