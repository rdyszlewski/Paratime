import { Stage } from 'app/database/data/models/stage';

export class StageDetailsModel{

    private stage:Stage = new Stage();
    private originStage: Stage;

    public setStage(stage:Stage):void{
        this.stage = stage;
        this.originStage = this.copyStage(stage);
    }

    private copyStage(stage:Stage):Stage{
        const newStage = new Stage();
        newStage.setId(stage.getId());
        newStage.setName(stage.getName());
        newStage.setDescription(stage.getDescription());
        newStage.setEndDate(stage.getEndDate());

        return newStage;
    }

    public getStage():Stage{
        return this.stage;
    }

    public isNameValid(){
        return this.stage.getName() != null && this.stage.getName() != "";
    }

    public isNameChanged(){
        if(this.stage != null && this.originStage != null){
            return this.stage.getName() != this.originStage.getName() != null;
        }
        return false;
    }

    public isValid(){
        return this.isNameValid();
    }
}
