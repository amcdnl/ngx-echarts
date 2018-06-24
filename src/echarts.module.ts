import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EChartsComponent } from './echarts.component';

@NgModule({
  imports: [CommonModule],
  declarations: [EChartsComponent],
  exports: [EChartsComponent]
})
export class EChartsModule {}
