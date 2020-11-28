import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DayScheduleComponent } from './tasks-container/day-schedule/day-schedule.component';
import { MiniCalendarComponent } from './tasks-container/day-schedule/mini-calendar/mini-calendar.component';
import { TasksListComponent } from './tasks-container/day-schedule/tasks-list/tasks-list.component';

@NgModule({
  declarations: [DayScheduleComponent, MiniCalendarComponent, TasksListComponent],
  imports: [
    CommonModule
  ]
})
export class TasksModule { }
