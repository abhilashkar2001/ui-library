import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericBuyerCreditComponent } from './generic-buyer-credit.component';

describe('GenericBuyerCreditComponent', () => {
  let component: GenericBuyerCreditComponent;
  let fixture: ComponentFixture<GenericBuyerCreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericBuyerCreditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericBuyerCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
