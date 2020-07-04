import { Component, OnInit } from '@angular/core';
import { LabelsModel } from './model';
import { Tag } from 'app/models/tag';
import * as $ from 'jquery';
import { DataService } from 'app/data.service';

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

  constructor() { }

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

  public removeLabel(label:Tag){
    DataService.getStoreManager().getTagStore().removeTag(label.getId()).then(()=>{
      this.model.removeLabel(label);
    });
  }

  public acceptEditing(label:Tag){
    const newLabelName =$(this.LABEL_ITEM_ID+label.getId()).val();
    label.setName(newLabelName);
    DataService.getStoreManager().getTagStore().updateTag(label).then(updatedLabel=>{
      this.model.setEditedLabel(null);
    });
  }

  public startAddingNewLabel(){
    this.model.setLabelEditing(true);
    this.model.setEditedLabel(null);
    this.setFocusOnInput(this.LABEL_INPUT_ID);
  }

  public cancelEditingLabel(){
    this.insertLabelInput.val("");
    this.model.setLabelEditing(false);
  }

  public saveNewLabel(){
    const labelName = this.insertLabelInput.val();
    const labelToInsert = new Tag(labelName);
    DataService.getStoreManager().getTagStore().createTag(labelToInsert).then(insertedLabel=>{
      this.model.addLabel(insertedLabel);
      this.insertLabelInput.val("");
      this.model.setLabelEditing(false);
    });
  }
}
