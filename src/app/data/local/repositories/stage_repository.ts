import { IProjectStageRepository } from 'app/data/common/repositories/stage_repository';
import { Stage } from 'app/models/stage';

export class LocalProjectStageRepository implements IProjectStageRepository{

    private table: Dexie.Table<Stage, number>;

    constructor(table:Dexie.Table<Stage, number>){
        this.table = table;
    }
  

    public findStageById(id: number): Promise<Stage> {
        return this.table.get(id);
    }

    public findStageByProject(projectId: number): Promise<Stage[]> {
        return this.table.where("projectID").equals(projectId).toArray();
    }

    public findStageByName(name: string): Promise<Stage[]> {
        return this.table.where("name").startsWithIgnoreCase(name).toArray();
    }

    public insertStage(stage: Stage): Promise<number> {
        const stageToSave = this.getStageCopyToSave(stage);
        return this.table.add(stageToSave);
    }

    // TODO: być możę warto by było to gdzieś przenieść
    private getStageCopyToSave(stage:Stage){
        const newStage = new Stage();
        if(stage.getId()){
            newStage.setId(stage.getId());
        }
        newStage.setName(stage.getName());
        newStage.setDescription(stage.getDescription());
        newStage.setEndDate(stage.getEndDate());
        newStage.setStatus(stage.getStatus());
        newStage.setProjectID(stage.getProjectID());

        return newStage;
    }

    public updateStage(stage: Stage): Promise<number> {
        const stageToUpdate = this.getStageCopyToSave(stage);
        return this.table.update(stageToUpdate.getId(), stageToUpdate);
    }

    public removeStage(id: number): Promise<void> {
        return this.table.delete(id);
    }

    // TODO: prawdopodobnie będize można przenieść do 
    
}