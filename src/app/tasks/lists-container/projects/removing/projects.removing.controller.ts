import { DataService } from 'app/data.service';
import { MatDialog } from '@angular/material/dialog';
import { ProjectsModel } from '../common/model';
import { EventBus, Subscribe } from 'eventbus-ts';

import { DialogHelper } from 'app/shared/common/dialog';

export class ProjectsRemovingController{

    constructor(private listModel: ProjectsModel,private dialog:MatDialog, private dataService: DataService){
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
        const id = project.getId();
        this.dataService.getProjectService().remove(id).then(updatedProjects=>{
          this.listModel.updateProjects(updatedProjects);
        });
    }

    private openRemoveConfirmationDialog(){
        const message = "Czy na pewno usunąć projekt?";
        return DialogHelper.openDialog(message, this.dialog);
    }

}
