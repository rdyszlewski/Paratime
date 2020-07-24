import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TasksComponent } from './tasks/tasks.component';
import { MainComponent } from './main/main.component';
import { ProjectsComponent } from './projects/projects.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
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
import { LabelsComponent } from './labels/labels.component';
import { TooltipModule } from 'ng2-tooltip-directive';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { StageDetailsComponent } from './stage-details/stage-details.component';
import { PomodoroComponent } from './pomodoro/pomodoro.component';
import {DragDropModule} from "@angular/cdk/drag-drop";
import { PomodoroStatisticsComponent } from './pomodoro-statistics/pomodoro-statistics.component';
import {MatTabsModule} from '@angular/material/tabs';
import { MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { KanbanComponent } from './kanban/kanban.component' ;
import {MatCheckboxModule} from '@angular/material/checkbox';

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
    MatCheckboxModule
  ],
  entryComponents:[
    DialogComponent
  ],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'pl-PL'},],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
  constructor(){

  }
}
