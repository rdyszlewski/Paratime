import { Project } from 'app/database/shared/project/project';
import { EventBus } from 'eventbus-ts';

export class ProjectUpdateEvent extends EventBus.Event<Project>{

}
