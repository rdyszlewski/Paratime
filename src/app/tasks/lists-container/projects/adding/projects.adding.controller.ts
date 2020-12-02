import { DataService } from 'app/data.service';
import { ProjectsViewState } from '../common/state';
import { ProjectsAddingModel } from './projects.adding.model';
import { Project } from 'app/database/data/models/project';
import { ProjectsModel } from '../common/model';
import { EventBus } from 'eventbus-ts';
import { ProjectLoadEvent } from '../events/project.event';
import { FocusHelper, ScrollBarHelper } from 'app/shared/common/view_helper';
import { EditInputHandler } from 'app/shared/common/edit_input_handler';

export class ProjectAddingController{

    private PROJECTS_LIST = "#projects-list";
    private PROJECT_NAME_INPUT = '#new-project-name';


    private model: ProjectsAddingModel = new ProjectsAddingModel();

    constructor(private state: ProjectsViewState,private listModel: ProjectsModel, private dataService: DataService){
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
        this.dataService.getProjectService().create(project).then(result=>{
          console.log(result);
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
