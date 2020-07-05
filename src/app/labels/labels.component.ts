import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LabelsModel } from './model';
import { Tag } from 'app/models/tag';
import * as $ from 'jquery';
import { DataService } from 'app/data.service';
import { KeyCode } from 'app/common/key_codes';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'app/dialog/dialog.component';
import { resourceUsage } from 'process';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.css']
})
export class LabelsComponent implements OnInit {

  private LABEL_INPUT_ID = "#label";
  private LABEL_ITEM_ID = "#label-name-input-";

  private insertLabelInput;
  public model: LabelsModel = new LabelsModel();

  @Output() closeEvent: EventEmitter<null> = new EventEmitter();
  @Output() updateEvent: EventEmitter<null> = new EventEmitter();

  constructor(public dialog:MatDialog) { }

  ngOnInit(): void {
    this.insertLabelInput = $(this.LABEL_INPUT_ID);
    this.init();
    // this.insertMockTags();
  }

  private init(){
    DataService.getStoreManager().getTagStore().getAllTags().then(labels=>{
      this.model.setLabels(labels);
    });
  }

  private insertMockTags(){
    let tag1 = new Tag("Jeden");
    tag1.setId(1);
    let tag2 = new Tag("Dwa");
    tag2.setId(2);
    let tag3 = new Tag("Trzy");
    tag3.setId(3);

    this.model.setLabels([tag1, tag2, tag3]);
  }

  public filterLabels(tagValue: string):void{
    this.model.filterLabels(tagValue);
  }

  public editLabel(label:Tag){
    this.model.setEditedLabel(label);
    this.model.setLabelEditing(false);
    this.setFocusOnInput(this.LABEL_ITEM_ID+label.getId());
  }

  private setFocusOnInput(id:string){
    setTimeout(()=>{ 
      $(id).focus();
    },0);
  }

  private removeLabel(label:Tag){
    DataService.getStoreManager().getTagStore().removeTag(label.getId()).then(()=>{
      this.model.removeLabel(label);
      this.updateEvent.emit();
    });
  }

  public acceptEditing(label:Tag){
    const newLabelName =$(this.LABEL_ITEM_ID+label.getId()).val();
    label.setName(newLabelName);
    DataService.getStoreManager().getTagStore().updateTag(label).then(updatedLabel=>{
      this.model.setEditedLabel(null);
      this.updateEvent.emit();
    });
  }

  public startAddingNewLabel(){
    this.model.setLabelEditing(true);
    this.model.setEditedLabel(null);
    this.setFocusOnInput(this.LABEL_INPUT_ID);
  }

  public cancelAddingLabel(){
    this.insertLabelInput.val("");
    this.model.setLabelEditing(false);
  }

  public saveNewLabel(){
    const labelName = this.insertLabelInput.val();
    const labelToInsert = new Tag(labelName);
    DataService.getStoreManager().getTagStore().createTag(labelToInsert).then(insertedLabel=>{
      this.model.addLabel(insertedLabel);
      this.cancelAddingLabel();
      this.updateEvent.emit();
    });
  }

  public closePanel(){
    this.closeEvent.emit();
  }

  public handleKeysOnNewLabelInput(event:KeyboardEvent){
    if(event.keyCode== KeyCode.ENTER){
      this.saveNewLabel();
    }
    if(event.keyCode == KeyCode.ESC){
      this.cancelAddingLabel();
    }
  }

  public handleKeysOnEditLabel(event:KeyboardEvent, label:Tag){
    if(event.keyCode == KeyCode.ENTER) {
      this.acceptEditing(label);
    } 
    if(event.keyCode == KeyCode.ESC){
      this.cancelAddingLabel();
    }
    // TODO: prawdopodobnie będzie zapobiec dalczemu przesyłaniu zdarzenia
  }

  // TODO: znaleźć jakiś sposób, żeby nie musieć powtarzać tego kodu
  public openDialog(){
    const dialogRef = this.dialog.open(DialogComponent, 
      {width:"350px", data: "Czy na pewno usunąć etykietę?"});
    return dialogRef.afterClosed();
  }

  public onRemoveLabel(label:Tag){
    this.openDialog().subscribe(result=>{
      if(result){
        this.removeLabel(label);
      }
    });
  }
}
