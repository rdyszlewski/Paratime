import { Label } from 'app/database/data/models/label';
import { DataService } from 'app/data.service';
import { LabelEditingModel } from './label.editing.model';
import { LabelViewState } from '../common/label_view_state';
import { EditInputHandler } from 'app/shared/common/edit_input_handler';
import { FocusHelper } from 'app/shared/common/view_helper';
import { EventBus } from 'eventbus-ts';
import { LabelsUpdateEvent } from '../events/update.event';

export class LabelEditingController{

    private LABEL_ITEM_ID = "#label-name-input-";

    private model: LabelEditingModel = new LabelEditingModel();
    private state: LabelViewState;

    constructor(state: LabelViewState){
      this.state = state;
    }

    public getModel():LabelEditingModel{
      return this.model;
    }

    public isEditingOpen(label:Label){
      return this.state.isEditingLabel(label);
    }

    public openEditingLabel(label:Label){
        this.model.setEditingLabelName(label.getName());
        this.state.openEditingLabel(label);
        FocusHelper.focus(this.getLabelItemId(label));
    }

    // TODO: ta metoda pojawia się kilka razy
    private getLabelItemId(label:Label):string{
        return this.LABEL_ITEM_ID+label.getId();
    }

    private closeEditingLabel(){
      this.state.closeEditingLabel();
    }

    public acceptEditingLabel(label:Label){
        label.setName(this.model.getEditingLabelName());
        this.updateLabel(label);
    }

    private updateLabel(label: Label) {
        DataService.getStoreManager().getLabelStore().updateLabel(label).then(updatedLabel => {
            this.state.closeEditingLabel();
            EventBus.getDefault().post(new LabelsUpdateEvent(null));
        });
    }

    public handleKeysOnEditLabel(event:KeyboardEvent, label:Label){
        EditInputHandler.handleKeyEvent(event,
            ()=>this.acceptEditingLabel(label),
            ()=>this.closeEditingLabel()
        );
    }
}
