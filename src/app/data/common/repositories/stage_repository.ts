import { Stage } from 'app/models/stage';

export interface IProjectStageRepository{
    findStageById(id:number):Promise<Stage>;
    findStageByProject(projectId:number):Promise<Stage[]>;
    findStageByName(name:string):Promise<Stage[]>;
    insertStage(stage:Stage):Promise<number>;
    updateStage(stage:Stage):Promise<number>;
    removeStage(id:number):Promise<void>;
}