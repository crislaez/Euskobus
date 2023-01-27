import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardComponentModule } from '@euskobus/shared-ui/card/card.module';
import { InfiniteScrollComponentModule } from '@euskobus/shared-ui/infinite-scroll/infinite-scroll.module';
import { NoDataComponentModule } from '@euskobus/shared-ui/no-data/no-data.module';
import { SkeletonCardComponentModule } from '@euskobus/shared-ui/skeleton-card/skeleton-card.module';
import { StationModule } from '@euskobus/shared/station/station.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { StationPage } from './containers/station.page';
import { StationPageRoutingModule } from './station-routing.module';

const SHARED_MODULE = [
  StationModule,
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
    StationPageRoutingModule
  ],
  declarations: [StationPage]
})
export class StationPageModule {}
