import { Label } from "app/database/shared/label/label";
import { OrderableItem } from "app/database/shared/models/orderable.item";
import { LocalDTO } from "../task/local.dto";

export class DexieLabelDTO extends OrderableItem implements LocalDTO<Label>{


  public name: string;

  constructor(label: Label){
    super();
    this.update(label);
  }

  public getModel(): Label {
    let label = new Label();
    label.id = this.id;
    label.name = this.name;
    return label;
  }

  public update(label: Label) {
    this.id = label.id;
    this.name = label.name;
  }

  public get containerId(): number {
    return null;
  }

  public set containerId(id: number) {

  }


}
