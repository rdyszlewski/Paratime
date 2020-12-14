import { Injectable } from '@angular/core';
import { DataService } from 'app/data.service';
import Stack from "ts-data.stack"
import { Command } from '../command';
import { DataCommand } from '../data-commnad';

@Injectable({
  providedIn: 'root'
})
export class CommandService {

  private _undoItems: Stack<Command>;
  private _redoItems: Stack<Command>

  constructor(private _dataService: DataService){
    // TODO: to z pewnością sporo ułatwi, ale może zrobić kod trochę nieczytelnym
    this._undoItems = new Stack();
    this._redoItems = new Stack();
  }

  public undo() {
    throw new Error('Method not implemented.');
  }

  public redo() {
    throw new Error('Method not implemented.');
  }

  public execute(command: Command){
    if(command instanceof DataCommand){
      command.setDataService(this._dataService);
    }
    this._undoItems.push(command);
    console.log(command.getDescription());
    command.execute();
  }
}
