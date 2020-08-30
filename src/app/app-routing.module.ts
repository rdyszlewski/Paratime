import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TasksComponent } from './tasks-container/tasks/tasks.component';
import { ProjectsComponent } from './lists-container/projects/projects.component';
import { MainComponent } from './main/main.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { LabelsComponent } from './side-container/labels/labels.component';
import { StageDetailsComponent } from './stage-details/stage-details.component';
import { PomodoroStatisticsComponent } from './pomodoro-statistics/pomodoro-statistics.component';
import { KanbanComponent } from './tasks-container/kanban/kanban.component';
import { PomodoroComponent } from './side-container/pomodoro/pomodoro.component';


const routes: Routes = [
  {path: '', redirectTo: 'main', pathMatch: "full"},
  {path: 'main', component: MainComponent},
  {path: "tasks", component: TasksComponent},
  {path: 'projects', component: ProjectsComponent},
  {path: 'project_details', component: ProjectDetailsComponent},
  {path: 'task_details', component: TaskDetailsComponent},
  {path: 'labels', component:LabelsComponent},
  {path: 'stage_details', component:StageDetailsComponent},
  {path: 'pomodoro', component:PomodoroComponent},
  {path: 'pomodoro_statistics', component: PomodoroStatisticsComponent},
  {path: 'kanban', component: KanbanComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
