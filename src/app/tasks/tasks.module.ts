import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DayScheduleComponent } from './tasks-container/day-schedule/day-schedule.component';
import { MiniCalendarComponent } from './tasks-container/day-schedule/mini-calendar/mini-calendar.component';
import { TasksListComponent } from './tasks-container/day-schedule/tasks-list/tasks-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DaySchedulerComponent } from './tasks-container/day-schedule/day-scheduler/day-scheduler.component';
import { InsertingTemplateComponent } from './shared/inserting-template/inserting-template.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DayScheduleComponent, MiniCalendarComponent, TasksListComponent, DaySchedulerComponent, InsertingTemplateComponent],
  imports: [
    CommonModule,
    DragDropModule,
    FormsModule
  ],
  exports: [InsertingTemplateComponent]
})
export class TasksModule { }
