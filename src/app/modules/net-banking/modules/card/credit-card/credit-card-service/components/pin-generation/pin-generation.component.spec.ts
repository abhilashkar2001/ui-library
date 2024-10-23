import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinGenerationComponent } from './pin-generation.component';

describe('PinGenerationComponent', () => {
  let component: PinGenerationComponent;
  let fixture: ComponentFixture<PinGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PinGenerationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PinGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
