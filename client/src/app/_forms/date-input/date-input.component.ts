import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.css']
})
export class DateInputComponent implements ControlValueAccessor {

@Input() label!: string;
@Input() maxDate?: Date;
@Input() minDate?: Date;
bsConfig?: Partial<BsDatepickerConfig>;
  constructor(@Self() public ngControl: NgControl) { 

    this.ngControl.valueAccessor = this;
    this.bsConfig ={
      containerClass: 'theme-dark-blue',
      dateInputFormat: 'DD MMMM YYYY'
    }
  }

  get control(){
    return this.ngControl.control as FormControl;
  }
  writeValue(obj: any): void {

  }
  registerOnChange(fn: any): void {

  }
  registerOnTouched(fn: any): void {

  }

  

}
