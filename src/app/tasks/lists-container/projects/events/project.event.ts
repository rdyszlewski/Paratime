
import {EventBus, Subscribe} from "eventbus-ts"
import { Project } from 'app/database/data/models/project'

export class ProjectEvent extends EventBus.Event<Project>{

  public getData(): Project{
    return this.data;
  }
}

export class ProjectEditEvent extends ProjectEvent{}
export class ProjectLoadEvent extends ProjectEvent{}
export class ProjectRemoveEvent extends ProjectEvent{}



// TODO: pomyśleć, czy są jakieś inne zadania
