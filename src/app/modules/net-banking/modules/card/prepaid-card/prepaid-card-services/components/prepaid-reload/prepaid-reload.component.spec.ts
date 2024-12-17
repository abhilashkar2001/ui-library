import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepaidReloadComponent } from './prepaid-reload.component';

describe('PrepaidReloadComponent', () => {
  let component: PrepaidReloadComponent;
  let fixture: ComponentFixture<PrepaidReloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrepaidReloadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrepaidReloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
