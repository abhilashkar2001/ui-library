import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHeaderTopComponent } from './user-header-top.component';

describe('UserHeaderTopComponent', () => {
  let component: UserHeaderTopComponent;
  let fixture: ComponentFixture<UserHeaderTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserHeaderTopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserHeaderTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
