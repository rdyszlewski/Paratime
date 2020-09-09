import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectDetailsComponent } from './tasks/details-container/project-details/project-details.component';
import { PomodoroStatisticsComponent } from './summary/pomodoro-statistics/pomodoro-statistics.component';
import { TasksComponent } from './tasks/tasks-container/tasks/tasks.component';
import { ProjectsComponent } from './tasks/lists-container/projects/projects.component';
import { KanbanComponent } from './tasks/tasks-container/kanban/kanban.component';
import { MainComponent } from './core/main/main.component';
import { LabelsComponent } from './shared/side-container/labels/labels.component';
import { PomodoroComponent } from './pomodoro/pomodoro/component/pomodoro.component';


const routes: Routes = [
  {path: '', redirectTo: 'main', pathMatch: "full"},
  {path: 'main', component: MainComponent},
  {path: "tasks", component: TasksComponent},
  {path: 'projects', component: ProjectsComponent},
  {path: 'project_details', component: ProjectDetailsComponent},
  {path: 'labels', component:LabelsComponent},
  {path: 'pomodoro', component:PomodoroComponent},
  {path: 'pomodoro_statistics', component: PomodoroStatisticsComponent},
  {path: 'kanban', component: KanbanComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
