import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TasksComponent } from './tasks-container/tasks/tasks.component';
import { ProjectsComponent } from './lists-container/projects/projects.component';
import { MainComponent } from './main/main.component';
import { LabelsComponent } from './side-container/labels/labels.component';
import { PomodoroStatisticsComponent } from './pomodoro-statistics/pomodoro-statistics.component';
import { KanbanComponent } from './tasks-container/kanban/kanban.component';
import { PomodoroComponent } from './side-container/pomodoro/pomodoro.component';
import { ProjectDetailsComponent } from './details-container/project-details/project-details.component';


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
