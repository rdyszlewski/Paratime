import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LabelsModel } from './model';
import { Label } from 'app/models/label';
import * as $ from 'jquery';
import { DataService } from 'app/data.service';
import { KeyCode } from 'app/common/key_codes';
import { MatDialog } from '@angular/material/dialog';
import { FocusHelper } from 'app/common/view_helper';
import { DialogHelper } from 'app/common/dialog';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.css']
})
export class LabelsComponent implements OnInit {

  private LABEL_INPUT_ID = "#label";
  private LABEL_ITEM_ID = "#label-name-input-";

  @Output() closeEvent: EventEmitter<null> = new EventEmitter();
  @Output() updateEvent: EventEmitter<null> = new EventEmitter();

  public model: LabelsModel = new LabelsModel();

  private insertLabelInput;

  constructor(public dialog:MatDialog) { }

  ngOnInit(): void {
    this.insertLabelInput = $(this.LABEL_INPUT_ID);
    this.loadLabels();
  }

  private loadLabels(){
    DataService.getStoreManager().getLabelStore().getAllLabel().then(labels=>{
      this.model.setLabels(labels);
    });
  }

  public openEditingLabel(label:Label){
    // TODO: pozmieniać nazwy. Te są mylące
    this.model.setEditedLabel(label);
    this.model.setLabelEditing(false);
    FocusHelper.focus(this.getLabelItemId(label));
  }

  private getLabelItemId(label:Label):string{
    return this.LABEL_ITEM_ID+label.getId();
  }

  private closeEditingLabel(){
    this.model.setEditedLabel(null);
  }

  public acceptEditingLabel(label:Label){
    const newLabelName =$(this.getLabelItemId(label)).val();
    label.setName(newLabelName);
    this.updateLabel(label);
  }

  private updateLabel(label: Label) {
    DataService.getStoreManager().getLabelStore().updateLabel(label).then(updatedLabel => {
      this.model.setEditedLabel(null);
      this.updateEvent.emit();
    });
  }

  public onRemoveLabel(label:Label){
    const message = "Czy na pewno usunąć etykietę?";
    DialogHelper.openDialog(message, this.dialog).subscribe(result=>{
      if(result){
        this.removeLabel(label);
      }
    });
  }

  private removeLabel(label:Label){
    DataService.getStoreManager().getLabelStore().removeLabel(label.getId()).then(()=>{
      this.model.removeLabel(label);
      this.updateEvent.emit();
    });
  }

  public openAddingNewLabel(){
    this.model.setLabelEditing(true);
    this.model.setEditedLabel(null);
    FocusHelper.focus(this.LABEL_INPUT_ID);
  }

  public cancelAddingLabel(){
    this.insertLabelInput.val("");
    this.model.setLabelEditing(false);
  }

  public addNewLabel(){
    const labelName = this.insertLabelInput.val();
    const labelToInsert = new Label(labelName);
    this.saveNewLabel(labelToInsert);
  }

  private saveNewLabel(labelToInsert: Label) {
    DataService.getStoreManager().getLabelStore().createLabel(labelToInsert).then(insertedLabel => {
      this.model.addLabel(insertedLabel);
      this.cancelAddingLabel();
      this.updateEvent.emit();
    });
  }

  public closeView(){
    this.closeEvent.emit();
  }

  public handleKeysOnNewLabelInput(event:KeyboardEvent){
    if(event.keyCode== KeyCode.ENTER){
      this.addNewLabel();
    }
    if(event.keyCode == KeyCode.ESC){
      this.cancelAddingLabel();
    }
  }

  public handleKeysOnEditLabel(event:KeyboardEvent, label:Label){
    if(event.keyCode == KeyCode.ENTER) {
      this.acceptEditingLabel(label);
    } 
    if(event.keyCode == KeyCode.ESC){
      this.closeEditingLabel();
    }
  }
}
