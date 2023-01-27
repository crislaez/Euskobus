import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HomePage } from './containers/home.page';
import { HomePageRoutingModule } from './home-routing.module';

// const SHARED_MODULE = [
//   CameraModule,
//   IncidenceModule
// ];

// const SHARED_UI_MODULE = [
//   InfiniteScrollModule,
// ];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    // ...SHARED_MODULE,
    // ...SHARED_UI_MODULE,
    TranslateModule.forChild(),
    HomePageRoutingModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
