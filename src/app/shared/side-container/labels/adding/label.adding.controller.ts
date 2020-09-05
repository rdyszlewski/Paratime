import { LabelAddingModel } from './label.adding.model';
import { LabelViewState } from '../common/label_view_state';
import { Label } from 'app/database/data/models/label';
import { DataService } from 'app/data.service';
import { EventEmitter } from '@angular/core';
import { LabelsModel } from '../common/list.model';
import { FocusHelper } from 'app/shared/common/view_helper';
import { EditInputHandler } from 'app/shared/common/edit_input_handler';

export class LabelAddingController {
  private LABEL_INPUT_ID = '#label';

  private updateEvent: EventEmitter<null>;
  private labelModel: LabelAddingModel = new LabelAddingModel();
  private state: LabelViewState;
  private listModel: LabelsModel;

  constructor(
    state: LabelViewState,
    listModel: LabelsModel,
    updateEvent: EventEmitter<null>
  ) {
    this.state = state;
    this.listModel = listModel;
    this.updateEvent = updateEvent;
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

  private saveNewLabel(labelToInsert: Label) {
    DataService.getStoreManager()
      .getLabelStore()
      .createLabel(labelToInsert)
      .then((updatedLabels) => {
        this.listModel.updateLabels(updatedLabels);
        this.cancelAddingLabel();
        this.updateEvent.emit();
      });
  }

  public handleKeysOnNewLabelInput(event: KeyboardEvent) {
    EditInputHandler.handleKeyEvent(
      event,
      () => this.addNewLabel(),
      () => this.cancelAddingLabel()
    );
  }
}
