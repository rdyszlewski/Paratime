import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import {MatExpansionModule} from '@angular/material/expansion';
import { TooltipModule } from 'ng2-tooltip-directive';
import { MatDialogModule } from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatTabsModule} from '@angular/material/tabs';
import { MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatCheckboxModule} from '@angular/material/checkbox';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DetailsContainerComponent } from './tasks/details-container/details-container.component';
import { TaskDetailsComponent } from './tasks/details-container/task-details/task-details.component';
import { StageDetailsComponent } from './tasks/details-container/stage-details/stage-details.component';
import { ProjectDetailsComponent } from './tasks/details-container/project-details/project-details.component';
import { PomodoroStatisticsComponent } from './summary/pomodoro-statistics/pomodoro-statistics.component';
import { KanbanComponent } from './tasks/tasks-container/kanban/kanban.component';
import { ListsContainerComponent } from './tasks/lists-container/lists-container.component';
import { TasksContainerComponent } from './tasks/tasks-container/tasks-container.component';
import { SpecialListsComponent } from './tasks/lists-container/special-lists/special-lists.component';
import { TasksComponent } from './tasks/tasks-container/tasks/tasks.component';
import { ProjectsComponent } from './tasks/lists-container/projects/projects.component';
import { LabelsComponent } from './shared/side-container/labels/labels.component';
import { DialogComponent } from './ui/widgets/dialog/dialog.component';
import { SideContainerComponent } from './shared/side-container/side-container.component';
import { WidgetsModule } from './ui/widgets/widgets.module';
import { MainComponent } from './core/main/main.component';
import { PomodoroComponent } from './shared/side-container/pomodoro/pomodoro.component';
import { PomodoroSettingsComponent } from './shared/side-container/pomodoro/pomodoro-settings/pomodoro-settings.component';
import { CalendarComponent } from './tasks/tasks-container/calendar/calendar.component';
import { CreatingDialogComponent } from './tasks/creating-dialog/creating-dialog.component';
import { DayScheduleComponent } from './tasks/tasks-container/day-schedule/day-schedule.component';
import { MiniCalendarComponent } from './tasks/tasks-container/day-schedule/mini-calendar/mini-calendar.component';
import { TasksListComponent } from './tasks/tasks-container/day-schedule/tasks-list/tasks-list.component';
import { DaySchedulerComponent } from './tasks/tasks-container/day-schedule/day-scheduler/day-scheduler.component';
import { InsertingTemplateComponent } from './tasks/shared/inserting-template/inserting-template.component';

@NgModule({
  declarations: [
    AppComponent,
    TasksComponent,
    MainComponent,
    ProjectsComponent,
    TaskDetailsComponent,
    ProjectDetailsComponent,
    LabelsComponent,
    DialogComponent,
    StageDetailsComponent,
    PomodoroComponent,
    PomodoroStatisticsComponent,
    KanbanComponent,
    ListsContainerComponent,
    TasksContainerComponent,
    SideContainerComponent,
    SpecialListsComponent,
    DetailsContainerComponent,
    PomodoroSettingsComponent,
    CalendarComponent,
    CreatingDialogComponent,
    DayScheduleComponent,
    MiniCalendarComponent,
    TasksListComponent,
    DaySchedulerComponent,
    InsertingTemplateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    FormsModule,
    MatTooltipModule,
    MatExpansionModule,
    TooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    DragDropModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatCheckboxModule,
    NgbModule,
    WidgetsModule,
    MatTabsModule,
  ],
  entryComponents:[
    DialogComponent
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pl-PL'},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(){

  }
}
