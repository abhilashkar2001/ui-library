import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkPayeeSideBarComponent } from './link-payee-side-bar.component';

describe('LinkPayeeSideBarComponent', () => {
  let component: LinkPayeeSideBarComponent;
  let fixture: ComponentFixture<LinkPayeeSideBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkPayeeSideBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkPayeeSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
