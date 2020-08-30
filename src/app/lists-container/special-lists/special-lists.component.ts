import { Component, OnInit } from '@angular/core';
import { SpecialList } from 'app/lists-container/projects/common/special_list';
import { EventBus } from 'eventbus-ts';
import { SpecialListEvent } from './events/special.list.event';


@Component({
  selector: 'app-special-lists',
  templateUrl: './special-lists.component.html',
  styleUrls: ['./special-lists.component.css']
})
export class SpecialListsComponent implements OnInit {

  public type = SpecialList;

  constructor() { }

  ngOnInit(): void {
  }

  public openList(type: SpecialList){
    // TODO: wysłanie zdarzenia o otwarciu listy
    EventBus.getDefault().post(new SpecialListEvent(type));
  }

}
