import {Component, OnInit} from '@angular/core';
import {DataSourceService} from '../../services/data-source.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private data;
  public temperature;
  public humidity;
  public pressure;
  public range;

  constructor(private dataSource: DataSourceService) {
  }

  ngOnInit() {
    this.data = this.dataSource.generateData();
    this.setData();
  }

  setData() {
    this.pressure = this.data.pressure;
    this.humidity = this.data.humidity;
    this.temperature = this.data.temperature;
    this.range = this.data.range;
  }

  setRange(e) {
    this.data = this.dataSource.generateData(e);
    this.setData();
  }
}
