import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimepickerComponent } from './timepicker/timepicker.component';
import { TimepickerTriggerDirective } from './timepicker/directives/timepicker-trigger.directive';
import { FormsModule } from '@angular/forms'


@NgModule({
  declarations: [TimepickerComponent, TimepickerTriggerDirective],
  exports:[TimepickerComponent, TimepickerTriggerDirective],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class WidgetsModule { }
