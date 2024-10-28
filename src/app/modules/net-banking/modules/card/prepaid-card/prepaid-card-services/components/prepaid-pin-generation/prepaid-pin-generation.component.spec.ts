import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepaidPinGenerationComponent } from './prepaid-pin-generation.component';

describe('PrepaidPinGenerationComponent', () => {
  let component: PrepaidPinGenerationComponent;
  let fixture: ComponentFixture<PrepaidPinGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrepaidPinGenerationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrepaidPinGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
