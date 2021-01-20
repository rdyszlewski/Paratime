import { Stage } from 'app/database/shared/stage/stage';

export class StageDetailsModel{

    private stage:Stage = new Stage();
    private originStage: Stage;

    public setStage(stage:Stage):void{
        this.stage = stage;
        this.originStage = this.copyStage(stage);
    }

    private copyStage(stage:Stage):Stage{
        const newStage = new Stage();
        newStage.id = stage.id;
        newStage.name = stage.name;
        newStage.description = stage.description;
        newStage.endDate = stage.endDate;

        return newStage;
    }

    public getStage():Stage{
        return this.stage;
    }

    public isNameValid(){
        return this.stage.name != null && this.stage.name != "";
    }

    public isNameChanged(){
        if(this.stage != null && this.originStage != null){
            return this.stage.name != this.originStage.name != null;
        }
        return false;
    }

    public isValid(){
        return this.isNameValid();
    }
}
