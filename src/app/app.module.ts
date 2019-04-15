import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {DataSourceService} from './services/data-source.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { DatepickerRangeComponent } from './components/common/datepicker-range/datepicker-range.component';
import {MultiChartComponent} from './components/common/multi-chart/multi-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    DatepickerRangeComponent,
    MultiChartComponent
  ],
  imports: [
    BrowserModule,
    NgbModule
  ],
  providers: [
    DataSourceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
