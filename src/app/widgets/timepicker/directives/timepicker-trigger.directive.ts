import { Directive, Input, AfterContentInit, OnDestroy, Output, EventEmitter, HostBinding, ViewChild, ElementRef, HostListener } from '@angular/core';
import { TimepickerComponent } from '../timepicker.component';

@Directive({
  selector: '[paraTimepickerTrigger]'
})
export class TimepickerTriggerDirective implements AfterContentInit, OnDestroy{

  private _timepicker: TimepickerComponent;

  @Input('paraTimepickerTrigger')
  get timepicker(): TimepickerComponent{return this._timepicker};
  set timepicker(v: TimepickerComponent){
    this._timepicker = v;
  }

  @Output() readonly timepickerOpended: EventEmitter<void> = new EventEmitter<void>();

  @HostListener("click")
  click(event:MouseEvent):void{
    this.timepicker.open = true;
  }

  @HostListener("focusout")
  removeInputFocus():void{

  }

  constructor(protected elementRef: ElementRef<HTMLInputElement>) { }

  ngAfterContentInit(): void {
    this._timepicker.input = this.elementRef.nativeElement;
  }

  ngOnDestroy(): void {
    throw new Error("Method not implemented.");
  }

  public setValue(value:string){
    this.elementRef.nativeElement.value = value;
  }

}
