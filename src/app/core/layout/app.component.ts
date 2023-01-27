import { Location } from "@angular/common";
import { Component, HostListener } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { NotificationModalComponent } from '@euskobus/shared-ui/notification-modal/notification-modal.component';
import { trackById } from '@euskobus/shared/utils/funcionts';
import { ModalController } from '@ionic/angular';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
  <ion-app>
    <!-- HEADER  -->
    <ion-header class="ion-no-border">    <!-- collapse="condense"  -->
      <ion-toolbar *ngIf="(currentSection$ | async) as currentSection">
        <!-- nav icon  -->
        <!-- <ion-menu-button *ngIf="!['pokemon','buildItem','battleItem']?.includes(currentSection?.route)" fill="clear" size="small" slot="start" (click)="open()" class="text-color-light"></ion-menu-button> -->
        <!-- back button  -->

        <!-- class="text-color-light" -->
        <ion-back-button
          *ngIf="!['home']?.includes(currentSection?.route!)"
          class="text-color-light"
          slot="start"
          [defaultHref]="redirectoTo(currentSection)"
          [text]="''">
        </ion-back-button>

        <!-- title  -->
        <!-- class="text-color-light" -->
        <ion-title class="text-color-light" slot="start">
          {{ currentSection?.label! | translate }}
        </ion-title>

        <!-- class="text-color" -->
        <ion-icon
          class="text-color-light"
          slot="end"
          name="ellipsis-horizontal-outline"
          (click)="presentModal()">
        </ion-icon>
      </ion-toolbar>
    </ion-header>


    <!-- MENU LATERAL  -->
    <!-- <ion-menu side="start" menuId="first" contentId="main">
      <ion-header  class="ion-no-border menu-header">
        <ion-toolbar >
          <ion-title class="text-color-light" >{{ 'COMMON.MENU' | translate}}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content >
        <ng-container *ngFor="let item of links; trackBy: trackById" >
          <ion-item detail class="text-color-light" [disabled]="item?.disabled" [routerLink]="['/'+item?.link]" (click)="openEnd()">{{ item?.text | translate }}</ion-item>
        </ng-container>
      </ion-content >
    </ion-menu> -->


    <!-- RUTER  -->
    <ion-router-outlet id="main"></ion-router-outlet>


    <!-- TAB FOOTER  -->
    <!-- <ion-tabs *ngIf="currentSection$ | async as currentSection">
      <ion-tab-bar [translucent]="true" slot="bottom">
        <ion-tab-button *ngFor="let item of links" [ngClass]="{'active-class': [item?.link]?.includes(currentSection?.route)}" class="text-color-light" [routerLink]="[item?.link]">
          <ion-icon [name]="item?.icon"></ion-icon>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs> -->
  </ion-app>
  `,
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  trackById = trackById;
  currentSection$ = this.router.events.pipe(
    filter((event: any) => event instanceof NavigationStart),
    map((event: NavigationEnd) => {
      const { url = ''} = event || {};
      const [, route = 'home', params = null ] = url?.split('/') || [];

      return {
        'home':{route, label: 'COMMON.TITLE'},
        'lines':{route, label: 'COMMON.TITLE'},
        'stations':{route, label: 'COMMON.TITLE'},
        'schedules':{route, label: 'COMMON.TITLE'},
        'map':{route, label: 'COMMON.TITLE'},
      }?.[route] || {route: 'home', label:'COMMON.TITLE'};
    })
    // ,tap(d => console.log('roter => ',d))
  );


  @HostListener('document:ionBackButton', ['$event'])
  private overrideHardwareBackAction($event: any) {
    $event.detail.register(100, () => console.log('--- DONT CLOSE APP ---'));
  }


  constructor(
    private router: Router,
    private location: Location,
    private modalController: ModalController,
  ) { }


  redirectoTo(currentSection: any): string{
    // this.location.back();
    const { route = null } = currentSection || {};
    const redirectTo: {[key:string]: string} = {
      'lines':'/home',
      'stations':'/home',
      'schedules':'/home',
      'map':'/home',
    };
    return redirectTo?.[route] || '/home';
  }

  // OPEN FILTER MODAL
  async presentModal() {
    const modal = await this.modalController.create({
      component: NotificationModalComponent,
    });

    modal.present();
    await modal.onDidDismiss();
  }

}
