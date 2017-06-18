import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserConnectedComponent } from './user-connected.component';

describe('UserConnectedComponent', () => {
  let component: UserConnectedComponent;
  let fixture: ComponentFixture<UserConnectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserConnectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserConnectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
