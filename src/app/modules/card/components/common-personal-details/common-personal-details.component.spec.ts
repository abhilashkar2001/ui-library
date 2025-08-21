import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonPersonalDetailsComponent } from './common-personal-details.component';

describe('CommonPersonalDetailsComponent', () => {
  let component: CommonPersonalDetailsComponent;
  let fixture: ComponentFixture<CommonPersonalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommonPersonalDetailsComponent],
    });
    fixture = TestBed.createComponent(CommonPersonalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
