import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepaidBlockCardComponent } from './prepaid-block-card.component';

describe('PrepaidBlockCardComponent', () => {
  let component: PrepaidBlockCardComponent;
  let fixture: ComponentFixture<PrepaidBlockCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrepaidBlockCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrepaidBlockCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
