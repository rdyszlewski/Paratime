import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LabelsModel } from './common/list.model';
import { DataService } from 'app/data.service';
import { MatDialog } from '@angular/material/dialog';
import { LabelEditingController } from './editing/label.editing.controller';
import { LabelAddingController } from './adding/label.adding.controller';
import { LabelViewState } from './common/label_view_state';
import { LabelRemovingController } from './removing/label.removing.controller';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.css']
})
export class LabelsComponent implements OnInit {

  

  @Output() closeEvent: EventEmitter<null> = new EventEmitter();
  @Output() updateEvent: EventEmitter<null> = new EventEmitter();

  public model: LabelsModel = new LabelsModel();
  public state: LabelViewState = new LabelViewState();

  private editingManager: LabelEditingController;
  private addingManager: LabelAddingController;
  private removingManager: LabelRemovingController;

  constructor(public dialog:MatDialog) { 
   
  }

  ngOnInit(): void {
    this.editingManager = new LabelEditingController(this.state, this.updateEvent);
    this.addingManager = new LabelAddingController(this.state, this.model, this.updateEvent);
    this.removingManager = new LabelRemovingController(this.model, this.dialog, this.updateEvent);
    this.loadLabels();
  }

  public getEditing(){
    return this.editingManager;
  }

  public getAdding(){
    return this.addingManager;
  }

  public getRemoving(){
    return this.removingManager;
  }

  private loadLabels(){
    DataService.getStoreManager().getLabelStore().getAllLabel().then(labels=>{
      this.model.setLabels(labels);
    });
  }
  
  public closeView(){
    this.closeEvent.emit();
  }

  

  
}

