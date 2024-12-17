import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewReusableFilterComponent } from './new-reusable-filter.component';

describe('NewReusableFilterComponent', () => {
  let component: NewReusableFilterComponent;
  let fixture: ComponentFixture<NewReusableFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewReusableFilterComponent],
    });
    fixture = TestBed.createComponent(NewReusableFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
