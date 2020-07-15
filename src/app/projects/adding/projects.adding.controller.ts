import { FocusHelper, ScrollBarHelper } from 'app/common/view_helper';
import { DataService } from 'app/data.service';
import { ProjectsViewState } from '../common/state';
import { ProjectsAddingModel } from './projects.adding.model';
import { EditInputHandler } from 'app/common/edit_input_handler';
import { Project } from 'app/models/project';
import { ProjectsModel } from '../common/model';
import { EventEmitter } from '@angular/core';

export class ProjectAddingController{

    private PROJECTS_LIST = "#projects-list";
    private PROJECT_NAME_INPUT = '#new-project-name';

    private loadEvent: EventEmitter<Project>;

    private model: ProjectsAddingModel = new ProjectsAddingModel();
    private state: ProjectsViewState;
    private listModel: ProjectsModel;

    constructor(state: ProjectsViewState, listModel: ProjectsModel, loadEvent: EventEmitter<Project>){
        this.state = state;
        this.listModel = listModel;
        this.loadEvent = loadEvent;
    }

    public getModel():ProjectsAddingModel{
        return this.model;
    }

    public onCreateProjectClick(){
        this.state.openAddingProject();
        FocusHelper.focus(this.PROJECT_NAME_INPUT);
        ScrollBarHelper.moveToBottom(this.PROJECTS_LIST);
    }

    public addNewProject(){
        this.saveProject();
    }

    public closeAddingNewProject(){
        this.model.setNewProjectName("");
        this.state.closeAddingProject();
    }

    public saveProject(){
        const project = new Project();
        project.setName(this.model.getNewProjectName());
        DataService.getStoreManager().getProjectStore().createProject(project).then(insertedProject=>{
            this.listModel.addProject(insertedProject);
            this.closeAddingNewProject();
            ScrollBarHelper.moveToBottom(this.PROJECTS_LIST);
            this.listModel.setSelectedProject(insertedProject);
            this.loadEvent.emit(insertedProject);
        });
    }

    public handleAddingNewProjectKeyUp(event:KeyboardEvent){
        EditInputHandler.handleKeyEvent(event, 
            ()=>this.addNewProject(),
            ()=>this.closeAddingNewProject()
        );
    }
}   