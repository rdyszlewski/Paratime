import { EventBus } from 'eventbus-ts';
import { Project } from 'app/database/data/models/project';

export class ProjectUpdateEvent extends EventBus.Event<Project>{

}
