import { Component, OnInit, Output, EventEmitter, Input, HostListener, SimpleChanges } from '@angular/core';
import { TimeModel } from './time_model';
import { TimepickerTriggerDirective } from './directives/timepicker-trigger.directive';
import { Observable } from 'rxjs';



@Component({
  selector: 'para-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.css']
})
export class TimepickerComponent implements OnInit {

  public minHours:number = 0;
  public maxHours:number = 23;
  public minMinutes:number = 0;
  public maxMinutes:number = 59

  private _open:boolean = false;
  get open(){return this._open};
  set open(isOpen:boolean){this._open = isOpen};

  private _model: TimeModel = new TimeModel();
  get model(){return this._model};
  set model(v:TimeModel){this._model = v;}

  private _input: HTMLInputElement;
  get input(){return this._input};
  set input(v:HTMLInputElement) {
    this._input = v;
    this.updateText();
  }

  private insideClick:boolean = false;

  @Input("paraTimepickerTrigger") trigger: TimepickerTriggerDirective;
  // @Input() time: Observable<string>;
  @Input("time") time: string;


  @Output() onClose: EventEmitter<null> = new EventEmitter();
  @Output() timeChange: EventEmitter<string> = new EventEmitter();

  @HostListener('document:click', ['$event']) clickedOutside($event){
    if(event.target != this.input){
      this.open = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateText();

}

  public clickedInside(event:MouseEvent){
    event.stopPropagation();
  }

  constructor() { }

  ngOnInit(): void {
    this.updateText();
  }

  private  updateText(){
    console.log("UpdateText");
    console.log(this.time);
    const value = this.time.split(":");
    this.model.hours = Number.parseInt(value[0]);
    this.model.minutes = Number.parseInt(value[1]);
    const text = this.getTimeText();
    this.input.value = text;
  }

  public increaseHours(){
    if(this.model.hours != this.maxHours){
      this.model.hours++;
    } else {
      this.model.hours = this.minHours;
    }
  }

  public decreaseHours(){
    if(this.model.hours != this.minHours){
      this.model.hours--;
    } else {
      this.model.hours = this.maxHours;
    }
  }

  public increaseMinutes(){
    if(this.model.minutes != this.maxMinutes){
      this.model.minutes++;
    } else {
      this.model.minutes = this.minMinutes;
    }
  }

  public decreaseMinutes(){
    if(this.model.minutes != this.minMinutes){
      this.model.minutes--;
    } else {
      this.model.minutes = this.maxMinutes;
    }
  }

  public cancel(){
    this.onClose.emit();
    this.open = false;
  }

  public setTime(){
    if(this.validate()){
      const time = this.getTimeText();
      this._input.value = time;
      this.timeChange.emit(time);
      this.open = false;
    }
    else
    {
      // TODO: wyświetlić informacje o niepoprawnych danych
    }
  }

  private getTimeText():string{
    return this.formatTime(this.model.hours) + ":" + this.formatTime(this.model.minutes);
  }

  private formatTime(number:number):string{
    // TODO: chyba istnieje łatwiejszy sposób na zrobienie tego
    const size = 2;
    let s = number+"";
    while (s.length < size) s = "0" + s;
    return s;
  }

  private validate():boolean{
    const hours = this.model.hours;
    const minutes = this.model.minutes;
    return hours >= this.minHours && hours <= this.maxHours && minutes >= this.minMinutes && minutes <= this.maxMinutes
  }
}
