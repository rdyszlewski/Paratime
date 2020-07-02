import { BrowserModule } from '@angular/platform-browser';
import { NgModule, SystemJsNgModuleLoader } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TasksComponent } from './tasks/tasks.component';
import { MainComponent } from './main/main.component';
import { ProjectsComponent } from './projects/projects.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { ContextmenuComponent } from './contextmenu/contextmenu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    TasksComponent,
    MainComponent,
    ProjectsComponent,
    TaskDetailsComponent,
    ProjectDetailsComponent,
    ContextmenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatIconModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
  constructor(){

  }
}
