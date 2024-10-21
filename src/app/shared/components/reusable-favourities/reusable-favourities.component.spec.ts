import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableFavouritiesComponent } from './reusable-favourities.component';

describe('ReusableFavouritiesComponent', () => {
  let component: ReusableFavouritiesComponent;
  let fixture: ComponentFixture<ReusableFavouritiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReusableFavouritiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReusableFavouritiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
