import { Injectable } from '@angular/core';
import { StoreManager } from './data/common/store_manager';
import { LocalDataSource } from './data/local/source';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // TODO: zrobić to jakoś ciekawiej
  private static storeManager: StoreManager = new StoreManager(new LocalDataSource());

  constructor() { 
    
  }

  public static getStoreManager(){
    return this.storeManager;
  }
}