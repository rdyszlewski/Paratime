import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { EditInputHandler } from 'app/shared/common/edit_input_handler';
import { FocusHelper, ScrollBarHelper } from 'app/shared/common/view_helper';

@Component({
  selector: 'inserting-template',
  templateUrl: './inserting-template.component.html',
  styleUrls: ['./inserting-template.component.less'],
})
export class InsertingTemplateComponent implements OnInit {
  private PROJECTS_LIST = "#projects-list";
  private PROJECT_NAME_INPUT = '#new-project-name';

  @Output() acceptEvent: EventEmitter<string> = new EventEmitter();

  private _visible: boolean = false;
  private _taskName: string;

  public get visible():boolean{
    return this._visible;
  }

  public get taskName():string{
    return this._taskName;
  }

  public set taskName(name: string){
    this._taskName = name;
  }

  public handleKeyUp(event:KeyboardEvent){
    EditInputHandler.handleKeyEvent(event,
        ()=>this.accept(),
        ()=>this.close()
    );
  }

  public accept(){
    this.acceptEvent.emit(this._taskName);
    this.close();
  }

  public close(){
    this._visible = false;
    this._taskName = "";
  }

  public open(){
    this._visible = true;
    FocusHelper.focus(this.PROJECT_NAME_INPUT);
    ScrollBarHelper.moveToBottom(this.PROJECTS_LIST);
  }

  ngOnInit(): void {
  }
}
