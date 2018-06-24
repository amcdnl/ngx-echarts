import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  HostListener
} from '@angular/core';
import * as echarts from 'echarts';
import { ECharts, EChartTitleOption } from 'echarts';
import { take, distinctUntilChanged, debounceTime, takeUntil } from 'rxjs/operators';
import { fromEvent, Subject } from 'rxjs';

@Component({
  selector: 'ngx-echarts',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ngx-echarts]': 'true'
  }
})
export class EChartsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() theme: string;
  @Input() title: EChartTitleOption;
  @Input() tooltip: any;
  @Input() legend: any;
  @Input() series: any;
  @Input() loading: boolean;
  @Input() xAxis: any;
  @Input() yAxis: any;
  @Input() visualMap: any;
  @Input() animation: boolean;

  @Output() chartClick = new EventEmitter<any>();
  @Output() chartDblClick = new EventEmitter<any>();
  @Output() chartMouseDown = new EventEmitter<any>();
  @Output() chartMouseUp = new EventEmitter<any>();
  @Output() chartMouseOver = new EventEmitter<any>();
  @Output() chartMouseOut = new EventEmitter<any>();
  @Output() chartGlobalOut = new EventEmitter<any>();
  @Output() chartContextMenu = new EventEmitter<any>();
  @Output() chartDataZoom = new EventEmitter<any>();

  private _chart: ECharts;
  private _loaded = false;
  private _destroy$ = new Subject();

  constructor(private _elementRef: ElementRef, private _ngZone: NgZone) {}

  ngOnInit() {
    // Wait for stabalization so the viewport is rendered
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this._createChart());

    this._ngZone.runOutsideAngular(() => {
      fromEvent(window, 'resize')
        .pipe(
          distinctUntilChanged(),
          debounceTime(10),
          takeUntil(this._destroy$)
        )
        .subscribe(() => this.resize());
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this._chart && this._loaded) {
      const result = {};
      for (const change in changes) {
        if (this[change]) {
          result[change] = changes[change].currentValue;
        }
      }
      this.setOptions(result);
    }
  }

  ngOnDestroy() {
    if (this._chart) {
      this._chart.dispose();
      this._chart = null;
    }

    this._destroy$.next();
    this._destroy$.complete();
  }

  resize() {
    if (this._chart) {
      this._chart.resize();
    }
  }

  setOptions(changes: any) {
    this._chart.setOption(changes);
  }

  private _createChart() {
    this._ngZone.runOutsideAngular(() => {
      this._chart = echarts.init(this._elementRef.nativeElement, this.theme);

      this._chart.on('click', e => this._ngZone.run(() => this.chartClick.emit(e)));
      this._chart.on('dblClick', e => this._ngZone.run(() => this.chartDblClick.emit(e)));
      this._chart.on('mousedown', e => this._ngZone.run(() => this.chartMouseDown.emit(e)));
      this._chart.on('mouseup', e => this._ngZone.run(() => this.chartMouseUp.emit(e)));
      this._chart.on('mouseover', e => this._ngZone.run(() => this.chartMouseOver.emit(e)));
      this._chart.on('mouseout', e => this._ngZone.run(() => this.chartMouseOut.emit(e)));
      this._chart.on('globalout', e => this._ngZone.run(() => this.chartGlobalOut.emit(e)));
      this._chart.on('contextmenu', e => this._ngZone.run(() => this.chartContextMenu.emit(e)));
      this._chart.on('datazoom', e => this._ngZone.run(() => this.chartDataZoom.emit(e)));

      this.setOptions({
        visualMap: this.visualMap,
        title: this.title,
        tooltip: this.tooltip,
        legend: this.legend,
        series: this.series,
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        animation: this.animation
      });

      this._loaded = true;
    });
  }
}
