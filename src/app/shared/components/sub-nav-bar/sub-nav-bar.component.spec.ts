import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubNavBarComponent } from './sub-nav-bar.component';

describe('SubNavBarComponent', () => {
  let component: SubNavBarComponent;
  let fixture: ComponentFixture<SubNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubNavBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
