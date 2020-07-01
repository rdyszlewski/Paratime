import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TasksComponent } from './tasks/tasks.component';
import { componentFactoryName } from '@angular/compiler';
import { ProjectsComponent } from './projects/projects.component';
import { MainComponent } from './main/main.component';


const routes: Routes = [
  {path: 'main', component: MainComponent},
  {path: "tasks", component: TasksComponent},
  {path: 'projects', component: ProjectsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
