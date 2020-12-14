import { Component, OnInit } from '@angular/core';

export enum ListType{
  SPECIAL,
  PROJECTS
}

@Component({
  selector: 'app-lists-container',
  templateUrl: './lists-container.component.html',
  styleUrls: ['./lists-container.component.less']
})
export class ListsContainerComponent implements OnInit {

  public type = ListType;

  private _listType: ListType = ListType.PROJECTS;

  public get listType():ListType{
    return this._listType;
  }

  constructor() { }

  ngOnInit(): void {
  }

  public openLists(type: ListType){
    // TODO: otwieranie list
    if(this._listType == type){
      this._listType = null;
    } else {
      this._listType = type;
    }
  }

}
