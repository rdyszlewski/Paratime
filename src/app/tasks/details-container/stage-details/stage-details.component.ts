import { Component, OnInit } from "@angular/core";
import { StageDetailsModel } from "./model";
import { Status } from "app/database/shared/models/status";
import { Stage } from "app/database/shared/stage/stage";
import { EventBus } from "eventbus-ts";
import { StageDetailsCloseEvent } from "./events/close.event";
import { CommandService } from 'app/commands/manager/command.service';
import { UpdateStageCommand } from 'app/commands/data-command/stage/command.update-stage';

@Component({
  selector: "app-stage-details",
  templateUrl: "./stage-details.component.html",
  styleUrls: ["./stage-details.component.less"],
})
export class StageDetailsComponent implements OnInit {
  public status = Status;
  public model: StageDetailsModel = new StageDetailsModel();

  constructor(private commandService: CommandService) {}

  ngOnInit(): void {}

  public setStage(stage: Stage) {
    this.model.setStage(stage);
  }

  public updateStage() {
    if (this.model.isValid()) {
     this.commandService.execute(new UpdateStageCommand(this.model.getStage()));
    }
  }

  public closeView() {
    EventBus.getDefault().post(new StageDetailsCloseEvent(null));
  }
}
