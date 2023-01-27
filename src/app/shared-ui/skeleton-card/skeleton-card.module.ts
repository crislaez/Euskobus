import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SkeletonCardComponent } from './skeleton-card.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
  ],
  declarations: [
    SkeletonCardComponent
  ],
  exports:[
    SkeletonCardComponent
  ]
})
export class SkeletonCardComponentModule {}
