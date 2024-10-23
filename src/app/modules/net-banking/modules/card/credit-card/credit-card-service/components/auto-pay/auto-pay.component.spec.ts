import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoPayComponent } from './auto-pay.component';

describe('AutoPayComponent', () => {
  let component: AutoPayComponent;
  let fixture: ComponentFixture<AutoPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoPayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
