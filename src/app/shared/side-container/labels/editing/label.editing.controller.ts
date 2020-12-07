import { Label } from 'app/database/shared/label/label';
import { LabelEditingModel } from './label.editing.model';
import { LabelViewState } from '../common/label_view_state';
import { EditInputHandler } from 'app/shared/common/edit_input_handler';
import { FocusHelper } from 'app/shared/common/view_helper';
import { CommandService } from 'app/commands/manager/command.service';
import { UpdateLabeLCommand } from 'app/commands/data-command/label/command.update-label';

export class LabelEditingController{

    private LABEL_ITEM_ID = "#label-name-input-";

    private model: LabelEditingModel = new LabelEditingModel();

    constructor(private state: LabelViewState, private commandService: CommandService){
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
      this.commandService.execute(new UpdateLabeLCommand(label));
      this.state.closeEditingLabel();
    }

    public handleKeysOnEditLabel(event:KeyboardEvent, label:Label){
        EditInputHandler.handleKeyEvent(event,
            ()=>this.acceptEditingLabel(label),
            ()=>this.closeEditingLabel()
        );
    }
}
