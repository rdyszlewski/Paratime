import { Component, OnInit, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { ProjectsModel } from './model';
import { Project } from 'app/models/project';
import { DataService } from 'app/data.service';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  model: ProjectsModel;
  private lastContextOpen: Project = null;
  
  @Output() editEmitter: EventEmitter<Project> = new EventEmitter();
  @Output() loadEmitter: EventEmitter<Project> = new EventEmitter();

  contextMenuPosition = { x: '0px', y: '0px' };

  constructor() { }

  ngOnInit(): void {
    this.model = new ProjectsModel();

    this.loadProjects();
    
  }

  private loadProjects(){
    DataService.getStoreManager().getProjectStore().getAllProjects().then(projects=>{
      projects.forEach(project=>{
        this.model.addProject(project);
      });
    });
  }

  projectClick(project:Project){
    DataService.getStoreManager().getProjectStore().getProjectById(project.getId()).then(loadedProject=>{
      console.log("Projekt");
      console.log(loadedProject);
      this.loadEmitter.emit(loadedProject);
    });
    this.model.setSelectedProject(project);

    // DataService.getStoreManager().getTaskStore().getTasksByProject(project.getId()).then(tasks=>{
    //   console.log("Zadania w projektcie");
    //   console.log(tasks);
    // });
   
  }

  createProjectClick(){
    this.editEmitter.emit(null);
  }

  // projectMenuClick(project:Project){
   
  // }

  projectMenuClick(event:MouseEvent, project:Project){
    // TODO; okazuje się, że focus nie działa
    let target = event.target as HTMLElement;
    target.parentElement.focus();
    event.stopPropagation();
    this.lastContextOpen = project;
      }

  filterProjects(filterValue: string):void{
    this.model.filterProject(filterValue);
  }

  isSelectedProject(project:Project):boolean{
    if(this.model.getSelectedProject()==null){
      return false;
    }
    return project.getId() == this.model.getSelectedProject().getId();
  }

  editProject(){
    DataService.getStoreManager().getProjectStore().getProjectById(this.lastContextOpen.getId()).then(loadedProject=>{
      this.editEmitter.emit(loadedProject);
      // TODO: sprawdzić to, bo trochę mi nie pasuje
      this.model.setSelectedProject(this.lastContextOpen);
    });
  }

  removeProject(){
    DataService.getStoreManager().getProjectStore().removeProject(this.lastContextOpen.getId()).then(()=>{
      // TODO: usunąć projekt z listy
      
    });

  }

  addProject(project:Project):void{
    this.model.addProject(project);
    // TODO: sprawdzić, jak to będzie reagować, jeżeli będzie wpisany jakiś filtr
  }

}
