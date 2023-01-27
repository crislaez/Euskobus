import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardComponentModule } from '@euskobus/shared-ui/card/card.module';
import { InfiniteScrollComponentModule } from '@euskobus/shared-ui/infinite-scroll/infinite-scroll.module';
import { NoDataComponentModule } from '@euskobus/shared-ui/no-data/no-data.module';
import { SkeletonCardComponentModule } from '@euskobus/shared-ui/skeleton-card/skeleton-card.module';
import { ScheduleModule } from '@euskobus/shared/schedule/schedule.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SchedulePage } from './containers/schedule.page';
import { SchedulePageRoutingModule } from './schedule-routing.module';

const SHARED_MODULE = [
  ScheduleModule,
];

const SHARED_UI_MODULE = [
  CardComponentModule,
  NoDataComponentModule,
  SkeletonCardComponentModule,
  InfiniteScrollComponentModule,
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    ...SHARED_MODULE,
    ...SHARED_UI_MODULE,
    TranslateModule.forChild(),
    SchedulePageRoutingModule
  ],
  declarations: [SchedulePage]
})
export class SchedulePageModule {}
