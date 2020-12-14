import { MatDialog } from '@angular/material/dialog';
import { ProjectsModel } from '../common/model';
import { EventBus, Subscribe } from 'eventbus-ts';
import { DialogHelper } from 'app/shared/common/dialog';
import { CommandService } from 'app/commands/manager/command.service';
import { RemoveProjectCommand } from 'app/commands/data-command/project/command.remove-project';

export class ProjectsRemovingController{

    constructor(private listModel: ProjectsModel,private dialog:MatDialog, private commandService: CommandService){
        this.listModel = listModel;
        this.dialog = dialog;
        EventBus.getDefault().register(this);
    }

    @Subscribe("ProjectRemoveEvent")
    public onRemoveProject(){
        return this.openRemoveConfirmationDialog().subscribe(result=>{
            if(result!=null){
              this.removeProject();
            }
        });
    }

    private removeProject(){
        let project = this.listModel.getProjectWithOpenMenu();
        this.commandService.execute(new RemoveProjectCommand(project, this.listModel));
    }

    private openRemoveConfirmationDialog(){
        const message = "Czy na pewno usunąć projekt?";
        return DialogHelper.openDialog(message, this.dialog);
    }
}
