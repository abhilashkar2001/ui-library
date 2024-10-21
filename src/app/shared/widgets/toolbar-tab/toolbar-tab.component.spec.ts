import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarTabComponent } from './toolbar-tab.component';

describe('ToolbarTabComponent', () => {
  let component: ToolbarTabComponent;
  let fixture: ComponentFixture<ToolbarTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolbarTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
