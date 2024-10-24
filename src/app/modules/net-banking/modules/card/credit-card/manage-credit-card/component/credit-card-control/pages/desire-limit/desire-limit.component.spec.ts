import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesireLimitComponent } from './desire-limit.component';

describe('DesireLimitComponent', () => {
  let component: DesireLimitComponent;
  let fixture: ComponentFixture<DesireLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesireLimitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesireLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
