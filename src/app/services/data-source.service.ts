import {Injectable} from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DataSourceService {


  constructor() {
  }

  private static getRandomRoundNumbers(min, max) {
    return Math.round((Math.random() * (max - min) + min));
  }

  private static getRange(start?, end?) {
    start = start ? moment(start) : moment('2019-01-01');
    end = end ? moment(end) : moment('2019-01-31');
    const range = [];
    let cloneStart = start.clone();
    while (cloneStart.isSameOrBefore(end)) {
      range.push(cloneStart.clone());
      cloneStart = cloneStart.add(1, 'days');
    }
    return range;
  }

  public generateData(range?) {
    const start = range ? range.start : null;
    const end = range ? range.end : null;
    const rangeArray = DataSourceService.getRange(start, end);
    const temperatureData = rangeArray.map(() => {
      return DataSourceService.getRandomRoundNumbers(-35, 45);
    });
    const humidityData = rangeArray.map(() => {
      return DataSourceService.getRandomRoundNumbers(43, 98);
    });
    const pressureData = rangeArray.map(() => {
      return DataSourceService.getRandomRoundNumbers(991, 1051);
    });
    const rangeData = rangeArray.map(row => {
      return moment(row).format('D MMMM YYYY');
    });
    const startDate = rangeData[0];
    const endDate = rangeData[rangeData.length - 1];

    return {
      temperature: temperatureData,
      humidity: humidityData,
      pressure: pressureData,
      range: rangeData,
      start_date: startDate,
      end_date: endDate
    };
  }
}
