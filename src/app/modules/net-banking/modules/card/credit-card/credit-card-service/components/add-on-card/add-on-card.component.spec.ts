import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOnCardComponent } from './add-on-card.component';

describe('AddOnCardComponent', () => {
  let component: AddOnCardComponent;
  let fixture: ComponentFixture<AddOnCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOnCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOnCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
