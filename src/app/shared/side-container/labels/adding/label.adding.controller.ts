import { LabelAddingModel } from './label.adding.model';
import { LabelViewState } from '../common/label_view_state';
import { Label } from 'app/database/shared/label/label';
import { LabelsModel } from '../common/list.model';
import { FocusHelper } from 'app/shared/common/view_helper';
import { EditInputHandler } from 'app/shared/common/edit_input_handler';
import { CommandService } from 'app/commands/manager/command.service';
import { CreateLabelCommand } from 'app/commands/data-command/label/command.create-label';

export class LabelAddingController {
  private LABEL_INPUT_ID = '#label';

  private labelModel: LabelAddingModel = new LabelAddingModel();


  constructor(
    private state: LabelViewState,
    private listModel: LabelsModel,
    private commandService: CommandService
  ) {
    this.state = state;
    this.listModel = listModel;
  }

  public getModel() {
    return this.labelModel;
  }

  public isAddingOpen() {
    return this.state.isAddingLabel();
  }

  public openAddingNewLabel() {
    this.state.openAddingLabel();
    FocusHelper.focus(this.LABEL_INPUT_ID);
  }

  public cancelAddingLabel() {
    this.labelModel.setNewLabelName('');
    this.state.closeAddingLabel();
  }

  public addNewLabel() {
    const labelName = this.labelModel.getNewLabelName();
    const labelToInsert = new Label(labelName);
    this.saveNewLabel(labelToInsert);
  }

  private saveNewLabel(label: Label) {
    this.commandService.execute(new CreateLabelCommand(label, this.listModel));
    this.cancelAddingLabel();
  }

  public handleKeysOnNewLabelInput(event: KeyboardEvent) {
    EditInputHandler.handleKeyEvent(
      event,
      () => this.addNewLabel(),
      () => this.cancelAddingLabel()
    );
  }
}
