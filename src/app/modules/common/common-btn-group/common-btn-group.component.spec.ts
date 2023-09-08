import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonBtnGroupComponent } from './common-btn-group.component';

describe('CommonBtnGroupComponent', () => {
  let component: CommonBtnGroupComponent;
  let fixture: ComponentFixture<CommonBtnGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonBtnGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonBtnGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
