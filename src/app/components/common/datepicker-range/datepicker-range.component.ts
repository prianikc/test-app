import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgbDate, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
@Component({
  selector: 'app-datepicker-range',
  templateUrl: './datepicker-range.component.html',
  styleUrls: ['./datepicker-range.component.scss']
})
export class DatepickerRangeComponent implements OnInit {
  @Output() emitRange: EventEmitter<any> = new EventEmitter();
  hoveredDate: NgbDate;

  fromDate: NgbDate;
  toDate: NgbDate;

  constructor(calendar: NgbCalendar) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  ngOnInit() {
  }

  log(e) {
    console.log(e);
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    if (this.fromDate && this.toDate) {
      const obj = {
        start: new Date((this.fromDate.year + '-' + this.fromDate.month + '-' + this.fromDate.day)),
        end:  new Date((this.toDate.year + '-' + this.toDate.month + '-' + this.toDate.day)),
      };
      this.emitRange.emit(obj);
    }

  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }


}
