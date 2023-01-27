import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NotificationModalModule } from '@euskobus/shared-ui/notification-modal/notification-modal.module';
import { StationEffects } from './effects/station.effects';
import { combineFeatureKey, reducer } from './reducers';

@NgModule({
  imports: [
    CommonModule,
    NotificationModalModule,
    StoreModule.forFeature(combineFeatureKey, reducer),
    EffectsModule.forFeature([StationEffects]),
  ]
})
export class StationModule {}
