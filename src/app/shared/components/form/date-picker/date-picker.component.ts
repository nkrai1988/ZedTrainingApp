
import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import flatpickr from 'flatpickr';
import { LabelComponent } from '../label/label.component';

@Component({
  selector: 'app-date-picker',
  imports: [LabelComponent],
  templateUrl: './date-picker.component.html',
  styles: ``
})
export class DatePickerComponent implements AfterViewInit, OnDestroy, OnChanges {

  @Input() id!: string;
  @Input() mode: 'single' | 'multiple' | 'range' | 'time' = 'single';
  @Input() defaultDate?: string | Date | string[] | Date[];
  @Input() maxDate?: string | Date;
  @Input() minDate?: string | Date;
  @Input() label?: string;
  @Input() labelrequired?: boolean;
  @Input() placeholder?: string;
  @Output() dateChange = new EventEmitter<any>();

  @ViewChild('dateInput', { static: false }) dateInput!: ElementRef<HTMLInputElement>;

  private flatpickrInstance: flatpickr.Instance | undefined;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['defaultDate'] && this.flatpickrInstance) {
      this.flatpickrInstance.setDate(this.defaultDate ?? '', false);
    }
  }

  ngAfterViewInit() {
    this.flatpickrInstance = flatpickr(this.dateInput.nativeElement, {
      mode: this.mode,
      static: true,
      monthSelectorType: 'static',
      dateFormat: 'm-d-Y',
      defaultDate: this.defaultDate,
      maxDate: this.maxDate,
      minDate: this.minDate,
      onChange: (selectedDates, dateStr, instance) => {
        this.dateChange.emit({ selectedDates, dateStr, instance });
      }
    });
  }

  ngOnDestroy() {
    if (this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
    }
  }
}
