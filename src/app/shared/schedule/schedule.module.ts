import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NotificationModalModule } from '@euskobus/shared-ui/notification-modal/notification-modal.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SchedulesEffects } from './effects/schedule.effects';
import { combineFeatureKey, reducer } from './reducers';

@NgModule({
  imports: [
    CommonModule,
    NotificationModalModule,
    StoreModule.forFeature(combineFeatureKey, reducer),
    EffectsModule.forFeature([SchedulesEffects]),
  ]
})
export class ScheduleModule {}
