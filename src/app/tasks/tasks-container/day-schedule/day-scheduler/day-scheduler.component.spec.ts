import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DaySchedulerComponent } from './day-scheduler.component';

describe('DaySchedulerComponent', () => {
  let component: DaySchedulerComponent;
  let fixture: ComponentFixture<DaySchedulerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DaySchedulerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaySchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
