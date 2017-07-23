import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LotteryIconComponent } from './lottery-icon.component';

describe('LotteryIconComponent', () => {
  let component: LotteryIconComponent;
  let fixture: ComponentFixture<LotteryIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LotteryIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LotteryIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
