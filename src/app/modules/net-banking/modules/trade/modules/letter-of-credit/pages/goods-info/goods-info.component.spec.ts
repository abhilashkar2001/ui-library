import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsInfoComponent } from './goods-info.component';

describe('GoodsInfoComponent', () => {
  let component: GoodsInfoComponent;
  let fixture: ComponentFixture<GoodsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GoodsInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GoodsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
