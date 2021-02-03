import { ProjectsViewState } from '../common/state';
import { ProjectsAddingModel } from './projects.adding.model';
import { ProjectsModel } from '../common/model';
import { FocusHelper, ScrollBarHelper } from 'app/shared/common/view_helper';
import { EditInputHandler } from 'app/shared/common/edit_input_handler';
import { Project } from 'app/database/shared/project/project';
import { CreateProjectCommand } from 'app/commands/data-command/project/command.create-project';
import { CommandService } from 'app/commands/manager/command.service';

export class ProjectAddingController{

    private PROJECTS_LIST = "#projects-list";
    private PROJECT_NAME_INPUT = '#new-project-name';


    private model: ProjectsAddingModel = new ProjectsAddingModel();

    constructor(private state: ProjectsViewState,private listModel: ProjectsModel, private commandService: CommandService){
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
        project.name = this.model.getNewProjectName();
        this.commandService.execute(new CreateProjectCommand(project, this.listModel));
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
