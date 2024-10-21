import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmendementInfoComponent } from './amendement-info.component';

describe('AmendementInfoComponent', () => {
  let component: AmendementInfoComponent;
  let fixture: ComponentFixture<AmendementInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmendementInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmendementInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
