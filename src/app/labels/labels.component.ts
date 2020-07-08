import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LabelsModel } from './model';
import { Tag } from 'app/models/tag';
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
    DataService.getStoreManager().getTagStore().getAllTags().then(labels=>{
      this.model.setLabels(labels);
    });
  }

  public openEditingLabel(label:Tag){
    // TODO: pozmieniać nazwy. Te są mylące
    this.model.setEditedLabel(label);
    this.model.setLabelEditing(false);
    FocusHelper.focus(this.getLabelItemId(label));
  }

  private getLabelItemId(label:Tag):string{
    return this.LABEL_ITEM_ID+label.getId();
  }

  private closeEditingLabel(){
    this.model.setEditedLabel(null);
  }

  public acceptEditingLabel(label:Tag){
    const newLabelName =$(this.getLabelItemId(label)).val();
    label.setName(newLabelName);
    this.updateLabel(label);
  }

  private updateLabel(label: Tag) {
    DataService.getStoreManager().getTagStore().updateTag(label).then(updatedLabel => {
      this.model.setEditedLabel(null);
      this.updateEvent.emit();
    });
  }

  public onRemoveLabel(label:Tag){
    const message = "Czy na pewno usunąć etykietę?";
    DialogHelper.openDialog(message, this.dialog).subscribe(result=>{
      if(result){
        this.removeLabel(label);
      }
    });
  }

  private removeLabel(label:Tag){
    DataService.getStoreManager().getTagStore().removeTag(label.getId()).then(()=>{
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
    const labelToInsert = new Tag(labelName);
    this.saveNewLabel(labelToInsert);
  }

  private saveNewLabel(labelToInsert: Tag) {
    DataService.getStoreManager().getTagStore().createTag(labelToInsert).then(insertedLabel => {
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

  public handleKeysOnEditLabel(event:KeyboardEvent, label:Tag){
    if(event.keyCode == KeyCode.ENTER) {
      this.acceptEditingLabel(label);
    } 
    if(event.keyCode == KeyCode.ESC){
      this.closeEditingLabel();
    }
  }
}
