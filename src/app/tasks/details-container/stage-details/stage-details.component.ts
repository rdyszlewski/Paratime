import { Component, OnInit } from "@angular/core";
import { StageDetailsModel } from "./model";
import { Status } from "app/database/data/models/status";
import { Stage } from "app/database/data/models/stage";
import { DataService } from "app/data.service";
import { EventBus } from "eventbus-ts";
import { StageUpdateEvent } from "./events/update.event";
import { StageDetailsCloseEvent } from "./events/close.event";

@Component({
  selector: "app-stage-details",
  templateUrl: "./stage-details.component.html",
  styleUrls: ["./stage-details.component.css"],
})
export class StageDetailsComponent implements OnInit {
  public status = Status;
  public model: StageDetailsModel = new StageDetailsModel();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {}

  public setStage(stage: Stage) {
    this.model.setStage(stage);
  }

  public updateStage() {
    if (this.model.isValid()) {
      this.dataService
        .getStageService()
        .update(this.model.getStage())
        .then((updatedStage) => {
          EventBus.getDefault().post(new StageUpdateEvent(updatedStage));
        });
    }
  }

  public closeView() {
    EventBus.getDefault().post(new StageDetailsCloseEvent(null));
  }
}
