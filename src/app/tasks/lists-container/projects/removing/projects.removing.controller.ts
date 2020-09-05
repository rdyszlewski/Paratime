import { DataService } from 'app/data.service';
import { MatDialog } from '@angular/material/dialog';
import { ProjectsModel } from '../common/model';
import { EventBus, Subscribe } from 'eventbus-ts';
import { ProjectRemoveEvent } from '../events/project.event';
import { DialogHelper } from 'app/shared/common/dialog';

export class ProjectsRemovingController{

    private dialog: MatDialog;
    private listModel: ProjectsModel;

    constructor(listModel: ProjectsModel, dialog:MatDialog){
        this.listModel = listModel;
        this.dialog = dialog;
        EventBus.getDefault().register(this);
    }

    @Subscribe("ProjectRemoveEvent")
    public onRemoveProject(){
        return this.openRemoveConfirmationDialog().subscribe(result=>{
            if(result){
            this.removeProject();
            }
        });
    }

    private removeProject(){
        let project = this.listModel.getProjectWithOpenMenu();
        const id = project.getId();
        DataService.getStoreManager().getProjectStore().removeProject(id).then(updatedProjects=>{
          this.listModel.updateProjects(updatedProjects);
          EventBus.getDefault().post(new ProjectRemoveEvent(null))
        });
    }

    private openRemoveConfirmationDialog(){
        const message = "Czy na pewno usunąć projekt?";
        return DialogHelper.openDialog(message, this.dialog);
    }

}
