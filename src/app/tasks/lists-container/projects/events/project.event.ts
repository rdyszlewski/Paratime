
import { Project } from 'app/database/shared/project/project';
import {EventBus, Subscribe} from "eventbus-ts"

export class ProjectEvent extends EventBus.Event<Project>{

  public getData(): Project{
    return this.data;
  }
}

export class ProjectEditEvent extends ProjectEvent{}
export class ProjectLoadEvent extends ProjectEvent{}
export class ProjectRemoveEvent extends ProjectEvent{}



// TODO: pomyśleć, czy są jakieś inne zadania
