import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCreditCardComponent } from './manage-credit-card.component';

describe('ManageCreditCardComponent', () => {
  let component: ManageCreditCardComponent;
  let fixture: ComponentFixture<ManageCreditCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCreditCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCreditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
