import { FocusHelper, ScrollBarHelper } from 'app/common/view_helper';
import { DataService } from 'app/data.service';
import { ProjectsViewState } from '../common/state';
import { ProjectsAddingModel } from './projects.adding.model';
import { EditInputHandler } from 'app/common/edit_input_handler';
import { Project } from 'app/database/data/models/project';
import { ProjectsModel } from '../common/model';
import { EventEmitter } from '@angular/core';
import { EventBus } from 'eventbus-ts';
import { ProjectLoadEvent } from '../events/project.event';

export class ProjectAddingController{

    private PROJECTS_LIST = "#projects-list";
    private PROJECT_NAME_INPUT = '#new-project-name';


    private model: ProjectsAddingModel = new ProjectsAddingModel();
    private state: ProjectsViewState;
    private listModel: ProjectsModel;

    constructor(state: ProjectsViewState, listModel: ProjectsModel){
        this.state = state;
        this.listModel = listModel;
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
        DataService.getStoreManager().getProjectStore().createProject(project).then(result=>{
          // this.listModel.addProject(result.insertedProject);
          this.listModel.updateProjects(result.updatedProjects);

          EventBus.getDefault().post(new ProjectLoadEvent(result.insertedProject));
        });
        // TODO: można wstawić jakąś zaślepkę, która będzie chowana dopiero po wstawieniu zadania
        this.closeAddingNewProject();
    }

    public handleAddingNewProjectKeyUp(event:KeyboardEvent){
        EditInputHandler.handleKeyEvent(event,
            ()=>this.addNewProject(),
            ()=>this.closeAddingNewProject()
        );
    }
}
