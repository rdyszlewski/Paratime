import { Project } from 'app/models/project';
import { Stage } from 'app/models/stage';
import { Status } from 'app/models/status';

export class ProjectDetails{

    private project:Project = new Project();

    constructor(){
        this.project.setName("Dominika");

        let stage1 = new Stage();
        stage1.setName("Etap 1");
        stage1.setDescription("To jest pierwszy etap");
        stage1.setStatus(Status.STARTED);
        stage1.setEndDate(new Date());

        let stage2 = new Stage();
        stage2.setName("Etap 2");

        this.project.addStage(stage1);
        this.project.addStage(stage2);
    }

    public getProject(){
        // TODO: odpowiednie ustawianie dat
        return this.project;
    }

    public setProject(project:Project){
        if(project){
            this.project = project;
        }
    }

    public getName():Project{
        if(this.project){
            return this.getName();
        }
        return null;
    }

    public getStartDate(){
        if(this.project){
            return this.getStartDate();
        }
        return null;
    }

}