import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewReusableMatTableComponent } from './new-reusable-mat-table.component';

describe('NewReusableMatTableComponent', () => {
  let component: NewReusableMatTableComponent;
  let fixture: ComponentFixture<NewReusableMatTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewReusableMatTableComponent],
    });
    fixture = TestBed.createComponent(NewReusableMatTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
