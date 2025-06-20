import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDocSidePanelComponent } from './view-doc-side-panel.component';

describe('ViewDocSidePanelComponent', () => {
  let component: ViewDocSidePanelComponent;
  let fixture: ComponentFixture<ViewDocSidePanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewDocSidePanelComponent]
    });
    fixture = TestBed.createComponent(ViewDocSidePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
