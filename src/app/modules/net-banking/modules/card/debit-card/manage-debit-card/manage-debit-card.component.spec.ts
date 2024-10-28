import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDebitCardComponent } from './manage-debit-card.component';

describe('ManageDebitCardComponent', () => {
  let component: ManageDebitCardComponent;
  let fixture: ComponentFixture<ManageDebitCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageDebitCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageDebitCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
