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
import { CommandService } from 'app/commands/manager/command.service';
import { ChangeLabelsOrderCommand } from 'app/commands/data-command/label/command.change-labels-order';

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

  constructor(public dialog: MatDialog, private dataService: DataService, private commandService: CommandService) {}

  ngOnInit(): void {
    this.editingManager = new LabelEditingController(this.state, this.commandService);
    this.addingManager = new LabelAddingController(this.state, this.model, this.commandService);
    this.removingManager = new LabelRemovingController(this.model, this.dialog, this.commandService);
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
    this.dataService.getLabelService().getAll().then(labels=>{
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
    this.commandService.execute(new ChangeLabelsOrderCommand(currentIndex, previousIndex, this.model));
  }
}
