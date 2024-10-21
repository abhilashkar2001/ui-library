import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarTitleComponent } from './toolbar-title.component';

describe('ToolbarTitleComponent', () => {
  let component: ToolbarTitleComponent;
  let fixture: ComponentFixture<ToolbarTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolbarTitleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
