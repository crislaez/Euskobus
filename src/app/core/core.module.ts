import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotificationModalModule } from '@euskobus/shared-ui/notification-modal/notification-modal.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { AppComponent } from './layout/app.component';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    NotificationModalModule,
    TranslateModule.forChild(),
    RouterModule
  ],
  declarations: [AppComponent]
})
export class CoreModule {}
