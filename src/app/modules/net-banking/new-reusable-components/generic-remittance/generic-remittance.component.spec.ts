import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericRemittanceComponent } from './generic-remittance.component';

describe('GenericRemittanceComponent', () => {
  let component: GenericRemittanceComponent;
  let fixture: ComponentFixture<GenericRemittanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericRemittanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericRemittanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
