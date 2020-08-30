import { Label } from 'app/data/models/label';
import { MatDialog } from '@angular/material/dialog';
import { DialogHelper } from 'app/common/dialog';
import { DataService } from 'app/data.service';
import { LabelsModel } from '../common/list.model';
import { EventEmitter } from '@angular/core';

export class LabelRemovingController {
  private dialog: MatDialog;
  private listModel: LabelsModel;
  private updateEvent: EventEmitter<null>;

  constructor(
    listModel: LabelsModel,
    dialog: MatDialog,
    updateEvent: EventEmitter<null>
  ) {
    this.listModel = listModel;
    this.dialog = dialog;
    this.updateEvent = updateEvent;
  }

  public onRemoveLabel(label: Label) {
    const message = 'Czy na pewno usunąć etykietę?';
    DialogHelper.openDialog(message, this.dialog).subscribe((result) => {
      if (result) {
        this.removeLabel(label);
      }
    });
  }

  private removeLabel(label: Label) {
    DataService.getStoreManager()
      .getLabelStore()
      .removeLabel(label.getId())
      .then((updatedLabels) => {
        this.listModel.updateLabels(updatedLabels);
        this.updateEvent.emit();
      });
  }
}
