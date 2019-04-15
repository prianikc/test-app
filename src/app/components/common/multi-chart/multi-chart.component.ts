import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import * as d3 from 'd3';
import * as moment from 'moment';
import {el} from '@angular/platform-browser/testing/src/browser_util';
import {scaleBand} from 'd3';

@Component({
  selector: 'app-multi-chart',
  templateUrl: './multi-chart.component.html',
  styleUrls: ['./multi-chart.component.scss']
})
export class MultiChartComponent implements OnInit, OnChanges {

  @ViewChild('multiChart') multiChart: ElementRef;
  @Input() data: any[];
  @Input() multiData: any;
  @Input() range: any[];
  @Input() type: string;
  @Input() name: string;
  @Input() width: number;
  @Input() height: number;
  @Input() chartColor: string;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.drawChart(this.data, this.width, this.height, this.range, this.name, this.type, this.chartColor);
    }
  }

  ngOnInit() {
  }

  drawChart(data: any[], width: number, height: number, range: string[], name: string, type?: string, color?: string) {

    ///////////////////////////
    ///// Chart Variables /////
    ///////////////////////////
    const element = this.multiChart.nativeElement;
    if (!data && !width && !height && !range) {
      return;
    }
    type = type ? type : 'bar-chart';
    color = color ? color : '#80CBC4';
    name = name + '-chart';

    const contextHeight = 100;
    const contextWidth = width * .5;

    let margin = {top: 10, right: 20, bottom: 20, left: 30};
    if (type === 'multi-area-chart') {
      margin = {top: 10, right: 40, bottom: 150, left: 70};
    }
    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;

    //////////////////////
    ///// Remove Svg /////
    //////////////////////
    d3.select('.' + name).remove();

    /////////////////////
    ///// Chart Svg /////
    /////////////////////

    const svg = d3.select(element)
      .append('svg')
      .classed(name, true)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    ///////////////////////
    ///// Chart Scale /////
    ///////////////////////
    if (type === 'line-chart' || type === 'bar-chart') {

      const xScale = d3
        .scaleBand()
        .rangeRound([0, width])
        .domain(range)
        .padding(0.1);

      const yScale = d3
        .scaleLinear()
        .domain([d3.min(data) > 0 ? 0 : d3.min(data), d3.max(data)])
        .rangeRound([height, 0])
        .nice();

      //////////////////////
      ///// Chart Axis /////
      //////////////////////

      const xAxis = d3.axisBottom(xScale)
        .tickSize(0)
        .tickFormat(() => '');
      const yAxis = d3.axisLeft(yScale)
        .ticks(5)
        .tickFormat(d => {
          return d < 0 ? `-${d}C` : `${d}C`;
        })
        .tickPadding(2);

      const callAxisY = svg.append('g')
        .style('font-size', 8)
        .classed(`${name}-axis-y`, true)
        .call(yAxis)
        .call(g => g.select('.domain').remove());
      const callAxisX = svg.append('g')
        .classed(`${name}-axis-x`, true)
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis)
        .call(g => g.select('.domain').remove());


      //////////////////////////
      ///// Draw Bar Chart /////
      //////////////////////////
      const drawBarChart = () => {
        d3.select('.' + `${name}-line-path`).remove();
        d3.select('.' + `${name}-line-area`).remove();
        const barChartData = data.map((row, i) => {
          return {
            date: range[i],
            value: row
          };
        });
        const barChart = svg.selectAll('rect')
          .data(barChartData)
          .enter()
          .append('rect')
          .classed(`${name}-rect`, true)
          .attr('x', (d, i) => xScale(d.date))
          .attr('y', d => yScale(d.value))
          .attr('width', xScale.bandwidth())
          .attr('height', d => {
            return height - yScale(d.value);
          })
          .attr('fill', color);

      };
      ///////////////////////////
      ///// Draw line Chart /////
      ///////////////////////////
      const drawLineChart = () => {

        d3.selectAll('.' + `${name}-rect`).remove();

        const xScaleLinear = d3.scaleLinear()
          .domain([0, range.length])
          .range([0, width]);

        const line = d3.line<any>()
          .x((d, i) => xScaleLinear(i))
          .y((d: any) => yScale(d.value));
        const lineChartData = data.map(row => {
          return {value: row};
        });

        svg.append('path')
          .datum(lineChartData)
          .classed(`${name}-line-path`, true)
          .attr('fill', 'none')
          .attr('stroke', color)
          .attr('stroke-width', 1.5)
          .attr('d', line);

        const area = d3.area<any>()
          .x((d, i) => xScaleLinear(i))
          .y0(height)
          .y1((d: any) => yScale(d.value));

        svg.append('path')
          .datum(lineChartData)
          .classed(`${name}-line-area`, true)
          .attr('fill', color)
          .attr('d', area);
      };
      if (type === 'bar-chart') {
        drawBarChart();
      }

      if (type === 'line-chart') {
        drawLineChart();
      }

      ///////////////////////////////////////
      ///// Draw Chart By Type On Click /////
      ///////////////////////////////////////
      d3.select(element).on('click', () => {
        type = type === 'bar-chart' ? 'line-chart' : 'bar-chart';
        if (type === 'bar-chart') {
          drawBarChart();
        } else {
          drawLineChart();
        }
      });
    }
    ////////////////////////////
    ///// Draw Multi Chart /////
    ////////////////////////////

    const drawMultiChart = () => {
      const multiData = this.multiData;
      console.log(multiData);
      const start = multiData.start_date;
      const end = multiData.end_date;

      const xScaleTime = d3.scaleTime()
        .domain([new Date(start), new Date(end)])
        .rangeRound([0, width])
        .nice();

      const array = Object.keys(multiData).map((key, i) => {
        if (key !== 'start_date' && key !== 'end_date') {
          return {
            name: key,
            values: multiData[key]
          };
        }

      });
      const newArray = array.filter(row => row);
      console.log(newArray);

      const xAxisTime = d3.axisBottom(xScaleTime);
      svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxisTime);
      const weatherDataNames = ['temperature', 'humidity', 'pressure'];

      const yScaleBand = scaleBand()
        .domain(weatherDataNames)
        .rangeRound([height, 0])
        .padding(0.1);

      const yAxisBand = d3.axisLeft(yScaleBand);
      svg.append('g')
        .attr('transform', 'translate(0, 0)')
        .call(yAxisBand);

      const yScaleLinear = d3.scaleLinear()
        .domain([])
        .rangeRound([yScaleBand.bandwidth(), 0]);

      const area = d3.area<any>()
        .x((d, i) => xScaleTime(d.range))
        .y0(yScaleBand.bandwidth)
        .y1((d) => yScaleLinear(d));
    };

    //////////////////////////////
    ///// Draw Chart By Type /////
    //////////////////////////////


    if (type === 'multi-area-chart') {
      drawMultiChart();
    }
  }
}
