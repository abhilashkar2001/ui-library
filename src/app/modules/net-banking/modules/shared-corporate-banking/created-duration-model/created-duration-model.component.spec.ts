import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedDurationModelComponent } from './created-duration-model.component';

describe('CreatedDurationModelComponent', () => {
  let component: CreatedDurationModelComponent;
  let fixture: ComponentFixture<CreatedDurationModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatedDurationModelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatedDurationModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
