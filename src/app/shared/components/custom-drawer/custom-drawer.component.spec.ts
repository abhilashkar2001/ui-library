import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDrawerComponent } from './custom-drawer.component';

describe('CustomDrawerComponent', () => {
  let component: CustomDrawerComponent;
  let fixture: ComponentFixture<CustomDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomDrawerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
