import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SpinnerComponentModule } from '../spinner/spinner.module';
import { InfiniteScrollComponent } from './infinite-scroll.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SpinnerComponentModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    InfiniteScrollComponent
  ],
  exports:[
    InfiniteScrollComponent
  ]
})
export class InfiniteScrollComponentModule {}
