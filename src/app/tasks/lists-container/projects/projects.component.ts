import { Component, OnInit, ViewChild } from "@angular/core";
import { ProjectsModel } from "./common/model";
import { DataService } from "app/data.service";
import { MatDialog } from "@angular/material/dialog";
import { Status } from "app/database/shared/models/status";
import { ProjectType } from "app/database/shared/project/project_type";
import { ProjectsViewState } from "./common/state";
import { ProjectsFilteringController } from "./filtering/projects.filtering.controller";
import { ProjectsRemovingController } from "./removing/projects.removing.controller";
import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { EventBus } from "eventbus-ts";
import { ProjectLoadEvent, ProjectEditEvent } from "./events/project.event";
import { Project } from "app/database/shared/project/project";
import { CommandService } from "app/commands/manager/command.service";
import { ChangeProjectkOrderCommand } from "app/commands/data-command/project/command.change-project-order";
import { InsertingTemplateComponent } from 'app/tasks/shared/inserting-template/inserting-template.component';
import { CreateProjectCommand } from 'app/commands/data-command/project/command.create-project';

@Component({
  selector: "app-projects",
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.less"],
})
export class ProjectsComponent implements OnInit {

  @ViewChild(InsertingTemplateComponent)
  private insertingComponent: InsertingTemplateComponent;

  private model: ProjectsModel;
  private state: ProjectsViewState;
  private filteringController: ProjectsFilteringController;
  private removingController: ProjectsRemovingController;

  public status = Status;
  public type = ProjectType;

  constructor(
    public dialog: MatDialog,
    private dataService: DataService,
    private commandService: CommandService,
  ) {}

  ngOnInit(): void {
    this.model = new ProjectsModel();
    this.state = new ProjectsViewState();
    this.filteringController = new ProjectsFilteringController(this.model, this.dataService);
    this.removingController = new ProjectsRemovingController(
      this.model,
      this.dialog,
      this.commandService,
    );
    this.loadProjects();
  }

  public getModel(): ProjectsModel {
    return this.model;
  }

  public getState(): ProjectsViewState {
    return this.state;
  }

  public getFiltering(): ProjectsFilteringController {
    return this.filteringController;
  }

  public getRemoving(): ProjectsRemovingController {
    return this.removingController;
  }

  // loading projects from database
  private loadProjects() {
    this.dataService
      .getProjectService()
      .getAll()
      .then((projects) => {
        console.log("Projekty");
        console.log(projects);


        this.model.setProjects(projects);
      });
  }

  // update project on the list
  public updateProject(project: Project) {
    this.model.updateProject(project);
  }

  /// add project to projects list
  public addProject(project: Project): void {
    this.model.addProject(project);
  }

  /// select project on the list and open it
  public selectProject(project: Project) {
    this.model.setSelectedProject(project);
    this.onProjectClick(project);
  }

  // click events

  public onProjectClick(project: Project) {
    EventBus.getDefault().post(new ProjectLoadEvent(project));
  }

  public onProjectMenuClick(event: MouseEvent, project: Project) {
    let target = event.target as HTMLElement;
    target.parentElement.focus();
    event.stopPropagation();
    this.model.setProjectWithOpenMenu(project);
  }

  public onEditProject() {
    this.dataService
      .getProjectService()
      .getById(this.model.getProjectWithOpenMenu().id)
      .then((loadedProject) => {
        EventBus.getDefault().post(new ProjectEditEvent(loadedProject));
        this.model.setSelectedProject(this.model.getProjectWithOpenMenu());
      });
  }

  public openKanban() {
    // TODO: przerobić sposób przekazywania projektu podczas zdarzenia menu
    // this.kanbanEvent.emit(this.model.getProjectWithOpenMenu());
  }

  public onDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      this.changeTasksOrder(event.previousIndex, event.currentIndex);
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  private changeTasksOrder(previousIndex: number, currentIndex: number) {
    this.commandService.execute(
      new ChangeProjectkOrderCommand(currentIndex, previousIndex, this.model),
    );
  }

  public openInserting(){
    this.insertingComponent.open();
  }

  public addNewProject(name: string){
    const project = new Project();
    project.name = name;
    this.commandService.execute(new CreateProjectCommand(project, this.model));
  }
}
