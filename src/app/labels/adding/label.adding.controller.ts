import { LabelAddingModel } from './label.adding.model';
import { LabelViewState } from '../common/label_view_state';
import { FocusHelper } from 'app/common/view_helper';
import { Label } from 'app/models/label';
import { DataService } from 'app/data.service';
import { EventEmitter } from '@angular/core';
import { EditInputHandler } from 'app/common/edit_input_handler';
import { LabelsModel } from '../common/list.model';

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
