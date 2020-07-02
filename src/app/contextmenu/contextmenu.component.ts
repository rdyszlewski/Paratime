import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'contextmenu',
  templateUrl: './contextmenu.component.html',
  styleUrls: ['./contextmenu.component.css']
})
export class ContextmenuComponent implements OnInit {

  @Input() x = 0;
  @Input() y = 0;

  private 

  constructor() { }

  ngOnInit(): void {
  }

}
