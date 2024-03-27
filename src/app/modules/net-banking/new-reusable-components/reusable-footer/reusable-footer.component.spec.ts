import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableFooterComponent } from './reusable-footer.component';

describe('ReusableFooterComponent', () => {
  let component: ReusableFooterComponent;
  let fixture: ComponentFixture<ReusableFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReusableFooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReusableFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
