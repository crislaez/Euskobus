import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SpinnerComponentModule } from '@euskobus/shared-ui/spinner/spinner.module';
import { GeolocationModule } from '@euskobus/shared/geolocation/geolocation.module';
import { StationModule } from '@euskobus/shared/station/station.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { MapPage } from './containers/map.page';
import { MapPageRoutingModule } from './map-routing.module';

const SHARED_MODULE = [
  StationModule,
  // ScheduleModule,
  GeolocationModule
];

const SHARED_UI_MODULE = [
  SpinnerComponentModule
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ...SHARED_MODULE,
    ...SHARED_UI_MODULE,
    TranslateModule.forChild(),
    MapPageRoutingModule
  ],
  declarations: [MapPage]
})
export class MapPageModule {}
