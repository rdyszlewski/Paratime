import { IProjectStageRepository } from '../repositories/stage_repository';
import { Stage } from 'app/models/stage';

export class StageStore{

    private stageRepository: IProjectStageRepository;

    
    constructor(stageRepository: IProjectStageRepository){
        this.stageRepository = stageRepository;
    }

    public getStageById(id:number):Promise<Stage>{
        // TODO: można uzupełnić projekt jeśli będzie taka potrzeba
        return this.stageRepository.findStageById(id);
    }

    public getStagesByProject(projectId:number):Promise<Stage[]>{
        return this.stageRepository.findStageByProject(projectId);
    }

    public getStagesByName(name:string):Promise<Stage[]>{
        return this.stageRepository.findStageByName(name);
    }

    public createStage(stage:Stage):Promise<Stage>{
        return this.stageRepository.insertStage(stage).then(insertedId=>{
            return this.getStageById(insertedId);
        })
    }

    public updateStage(stage:Stage):Promise<Stage>{
        return this.stageRepository.updateStage(stage).then(result=>{
            return Promise.resolve(stage);
        });
    }

    public removeStage(stageId:number):Promise<void>{
        return this.stageRepository.removeStage(stageId);
    }

    public removeStagesFromProject(projectId: number): Promise<void> {
        // TODO: przetestować to
        // TODO: podczas usuwania projektu usunąć wszystkie etapy
        return this.getStagesByProject(projectId).then(results=>{
            return results.forEach(stage=>{
                this.removeStage(stage.getId());;
            })
        });
    }
}