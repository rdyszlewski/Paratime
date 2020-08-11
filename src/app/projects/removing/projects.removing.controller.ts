import { DataService } from 'app/data.service';
import { DialogHelper } from 'app/common/dialog';
import { EventEmitter } from '@angular/core';
import { Project } from 'app/models/project';
import { MatDialog } from '@angular/material/dialog';
import { ProjectsModel } from '../common/model';

export class ProjectsRemovingController{

    private removeEvent: EventEmitter<Project>;
    private dialog: MatDialog;
    private listModel: ProjectsModel;

    constructor(listModel: ProjectsModel, removeEvent: EventEmitter<Project>, dialog:MatDialog){
        this.listModel = listModel;
        this.removeEvent =removeEvent;
        this.dialog = dialog;
    }

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
          this.removeEvent.emit();
            // this.listModel.removeProject(project);
            // if(this.listModel.isSelectedProjectId(id)){
            // // send event to main component, that close tasks view for removed project
            // this.removeEvent.emit();
            // }
            // this.listModel.setProjectWithOpenMenu(null);
        });
    }

    private openRemoveConfirmationDialog(){
        const message = "Czy na pewno usunąć projekt?";
        return DialogHelper.openDialog(message, this.dialog);
    }

}
