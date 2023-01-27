import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NotificationEffects } from './effects/notification.effects';
import { EffectsModule } from '@ngrx/effects';


@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([NotificationEffects]),
  ],
})
export class NotificationModule {}
