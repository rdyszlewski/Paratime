import { BrowserModule } from '@angular/platform-browser';
import { NgModule, SystemJsNgModuleLoader } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TasksComponent } from './tasks/tasks.component';
import { MainComponent } from './main/main.component';
import { ProjectsComponent } from './projects/projects.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';


@NgModule({
  declarations: [
    AppComponent,
    TasksComponent,
    MainComponent,
    ProjectsComponent,
    TaskDetailsComponent,
    ProjectDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
  constructor(){

  }
}
