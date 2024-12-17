import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcToggleSlideComponent } from './ic-toggle-slide.component';

describe('IcToggleSlideComponent', () => {
  let component: IcToggleSlideComponent;
  let fixture: ComponentFixture<IcToggleSlideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IcToggleSlideComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IcToggleSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
