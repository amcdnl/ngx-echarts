# ngx-echarts

Echarts bindings for Angular.

## Usage
To get started, lets install the package thru npm:

```
npm i @amcdnl/ngx-echarts --S
```

then include the effect in your module:

```TS
import { EChartsModule } from '@amcdnl/ngx-echarts';

@NgModule({
    imports: [EChartsModule]
})
export class MyModule {}
```

then use the component like:

```TS
<ngx-echarts
  [series]="series$ | async"
  (chartClick)="onChartClick($event)"
  (chartDblClick)="onChartDblClick($event)">
</ngx-echarts>
```
