import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LabelsModel } from './list.model';
import { DataService } from 'app/data.service';
import { MatDialog } from '@angular/material/dialog';
import { LabelEditingManager } from './editing/label.editing.manager';
import { LabelAddingManager } from './adding/label.adding.manager';
import { LabelViewState } from './label_view_state';
import { LabelRemovingManager } from './removing/label.removing.manager';

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

  private editingManager: LabelEditingManager;
  private addingManager: LabelAddingManager;
  private removingManager: LabelRemovingManager;

  constructor(public dialog:MatDialog) { 
   
  }

  ngOnInit(): void {
    this.editingManager = new LabelEditingManager(this.state, this.updateEvent);
    this.addingManager = new LabelAddingManager(this.state, this.model, this.updateEvent);
    this.removingManager = new LabelRemovingManager(this.model, this.dialog, this.updateEvent);
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

