import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PomodoroStatisticsComponent } from './pomodoro-statistics.component';

describe('PomodoroStatisticsComponent', () => {
  let component: PomodoroStatisticsComponent;
  let fixture: ComponentFixture<PomodoroStatisticsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PomodoroStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PomodoroStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
