import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EefcComponent } from './eefc.component';

describe('EefcComponent', () => {
  let component: EefcComponent;
  let fixture: ComponentFixture<EefcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EefcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EefcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
