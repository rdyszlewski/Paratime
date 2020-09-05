import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { StageDetailsModel } from './model';
import { Status } from 'app/database/data/models/status';
import { Stage } from 'app/database/data/models/stage';
import { DataService } from 'app/data.service';

@Component({
  selector: 'app-stage-details',
  templateUrl: './stage-details.component.html',
  styleUrls: ['./stage-details.component.css']
})
export class StageDetailsComponent implements OnInit {

  @Output() closeEvent: EventEmitter<null> = new EventEmitter();
  @Output() updateEvent: EventEmitter<Stage> = new EventEmitter();

  public status = Status;
  public model: StageDetailsModel = new StageDetailsModel();

  constructor() { }

  ngOnInit(): void {

  }

  public setStage(stage:Stage){
    this.model.setStage(stage);
  }

  public updateStage(){
    if(this.model.isValid()){
      DataService.getStoreManager().getStageStore().updateStage(this.model.getStage()).then(updatedStage=>{
        this.updateEvent.emit(updatedStage);
      });
    }
  }

  public closeView(){
    this.closeEvent.emit();
  }

}
