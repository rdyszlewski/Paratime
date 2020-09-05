import { Component, OnInit} from '@angular/core';
import { LabelsModel } from './common/list.model';
import { DataService } from 'app/data.service';
import { MatDialog } from '@angular/material/dialog';
import { LabelEditingController } from './editing/label.editing.controller';
import { LabelAddingController } from './adding/label.adding.controller';
import { LabelViewState } from './common/label_view_state';
import { LabelRemovingController } from './removing/label.removing.controller';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.css'],
})
export class LabelsComponent implements OnInit {

  public model: LabelsModel = new LabelsModel();
  public state: LabelViewState = new LabelViewState();

  private editingManager: LabelEditingController;
  private addingManager: LabelAddingController;
  private removingManager: LabelRemovingController;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.editingManager = new LabelEditingController(
      this.state
    );
    this.addingManager = new LabelAddingController(this.state, this.model );
    this.removingManager = new LabelRemovingController(this.model, this.dialog);
    this.loadLabels();
  }

  public getEditing() {
    return this.editingManager;
  }

  public getAdding() {
    return this.addingManager;
  }

  public getRemoving() {
    return this.removingManager;
  }

  private loadLabels() {
    DataService.getStoreManager()
      .getLabelStore()
      .getAllLabel()
      .then((labels) => {
        this.model.setLabels(labels);
      });
  }

  public onDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      this.changeLabelsOrder(event.previousIndex, event.currentIndex);
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  private changeLabelsOrder(previousIndex: number, currentIndex: number) {
    if (previousIndex == currentIndex) {
      return;
    }
    const previousLabel = this.model.getLabelByIndex(previousIndex);
    const currentlabel = this.model.getLabelByIndex(currentIndex);
    DataService.getStoreManager()
      .getLabelStore()
      .move(previousLabel, currentlabel, previousIndex > currentIndex)
      .then((updatedLabels) => {
        this.model.updateLabels(updatedLabels);
      });
  }
}
