import { DataService } from 'app/data.service';
import { Command } from './command';

export abstract class DataCommand implements Command{


  protected _dataService: DataService;

  abstract execute();
  abstract unExecute();
  abstract getDescription(): string;

  public setDataService(dataService: DataService){
    this._dataService = dataService;
  }
}
