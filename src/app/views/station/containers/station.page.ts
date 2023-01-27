import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Keyboard } from '@capacitor/keyboard';
import { StationActions, fromStation } from '@euskobus/shared/station';
import { APP_COLORS } from '@euskobus/shared/utils/constant';
import { APP_ENTITIES, EntityStatus } from '@euskobus/shared/utils/enum';
import { getLastNumber, gotToTop, trackById } from '@euskobus/shared/utils/funcionts';
import { ComponentState } from '@euskobus/shared/utils/models';
import { IonContent, Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { map, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-station',
  template:`
  <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">

    <div class="empty-header components-background-dark">
    </div>

    <div class="container components-background-dark">
      <h1 class="text-color-gradient">{{ 'COMMON.STATIONS' | translate }}</h1>

      <div class="displays-center width-max heigth-min">
        <!-- FORM  -->
        <form (submit)="searchSubmit($event)">
          <ion-searchbar [placeholder]="'FILTERS.BY_NAME' | translate" [formControl]="search" (ionClear)="clearSearch($event)"></ion-searchbar>
        </form>
      </div>

      <div class="empty-div"></div>

      <ng-container *ngIf="stationsInfo$ | async as stationsInfo">
        <ng-container *ngIf="stationStatus$ | async as stationStatus">
          <ng-container *ngIf="stationStatus !== EntityStatus.Pending; else loader">
            <ng-container *ngIf="stationStatus !== EntityStatus.Error; else serverError">
              <ng-container *ngIf="(stationsInfo?.stations?.length || []) > 0; else noData">

                <app-card
                  *ngFor="let item of stationsInfo?.stations; let i = index; trackBy: trackById"
                  [item]="item || ''"
                  [from]="APP_ENTITIES.Station"
                  [backgroundColor]="$any($any(appCorlors)?.[getLastNumber(i)])">
                </app-card>

                <app-infinite-scroll
                  [slice]="stationsInfo?.stations?.length || 0"
                  [status]="stationStatus|| EntityStatus.Loaded"
                  [total]="stationsInfo?.total || 0"
                  (loadDataTrigger)="loadData($event)">
                </app-infinite-scroll>

              </ng-container>
            </ng-container>
          </ng-container>
        </ng-container>
      </ng-container>

      <!-- REFRESH -->
      <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- IS ERROR -->
      <ng-template #serverError>
        <app-no-data [title]="'COMMON.ERROR'" [image]="'assets/images/error.png'" [top]="'35vh'"></app-no-data>
      </ng-template>

      <!-- IS NO DATA  -->
      <ng-template #noData>
        <app-no-data [title]="'COMMON.NORESULT'" [image]="'assets/images/empty.png'" [top]="'20vh'"></app-no-data>
      </ng-template>

      <!-- LOADER  -->
      <ng-template #loader>
        <app-skeleton-card *ngFor="let item of [1,2,3,4,5,6,7,8,9,10]; trackBy: trackById"></app-skeleton-card>
      </ng-template>
    </div>

    <!-- TO TOP BUTTON  -->
    <ion-fab *ngIf="showButton" vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button class="color-button-text" (click)="gotToTop(content)"> <ion-icon name="arrow-up-circle-outline"></ion-icon></ion-fab-button>
    </ion-fab>

    <!-- FILTER  -->
    <!-- <ion-fab *ngIf="sources$ | async as sources" vertical="bottom" horizontal="start" slot="fixed">
      <ion-fab-button *ngIf="sources$ | async"
        class="color-button-text ion-fab-button-filter"
        (click)="openFilterModal(sources)">
        <ion-icon name="options-outline"></ion-icon>
      </ion-fab-button>
    </ion-fab> -->
  </ion-content>
  `,
  styleUrls: ['./station.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StationPage {

  APP_ENTITIES = APP_ENTITIES;
  EntityStatus = EntityStatus;
  appCorlors = APP_COLORS;
  getLastNumber = getLastNumber;
  gotToTop = gotToTop;
  trackById = trackById;
  @ViewChild(IonContent, {static: true}) content!: IonContent;

  showButton: boolean = false;
  baseSlice: number = 10;
  search = new FormControl('');

  stationStatus$ = this.store.select(fromStation.selectStatus);
  componentState!: ComponentState;
  trigger = new EventEmitter<ComponentState>();
  stationsInfo$ = this.trigger.pipe(
    tap(({reload}) => {
      if(!reload) return;
      this.store.dispatch(StationActions.loadStations())
    }),
    switchMap(({search, slice}) =>
      this.store.select(fromStation.selectStations).pipe(
        // tap(d => console.log(d))
        map((stations) => {
          const searchLower = search?.toLocaleLowerCase() || '';
          const sliceStations = search
                              ? (stations || [])?.filter((station) => station?.['DESKRIPZIOA-DESCRIPCION']?.['_text']?.toLocaleLowerCase()?.includes(searchLower) || station?.['DESKRIPZIOA-DESCRIPCION']?.['_text']?.toLocaleLowerCase() === searchLower)
                              : [...(stations ?? [])];
          return {
            stations: sliceStations?.slice(0, slice),
            total: sliceStations?.length || 0
          }
        })
      )
    )
  )


  constructor(
    private store: Store,
    public platform: Platform,
  ) { }


  ionViewWillEnter(): void{
    this.componentState = {
      search: null,
      slice: this.baseSlice,
      reload: false
    };
    this.trigger.next(this.componentState);
  }

  // SEARCH
  searchSubmit(event: Event): void{
    event.preventDefault();
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.componentState = {
      ...this.componentState,
      slice: this.baseSlice,
      search: this.search.value,
      reload: false
    };
    this.trigger.next(this.componentState);
  }

  // DELETE SEARCH
  clearSearch(event: any): void{
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.search.reset();
    this.componentState = {
      ...this.componentState,
      slice: this.baseSlice,
      search: null,
      reload: false
    };
    this.trigger.next(this.componentState);
  }

  // REFRESH
  doRefresh(event: any) {
    setTimeout(() => {
      this.search.reset();
      this.componentState = {
        search: null,
        slice: this.baseSlice,
        reload: true
      };
      this.trigger.next(this.componentState);
      event.target.complete();
    }, 500);
  }

  // INIFINITE SCROLL
  loadData({event, total}:{event: any, total: number}) {
    this.componentState = {
      ...this.componentState,
      slice: (this.componentState.slice as number )+ this.baseSlice,
      reload: false
    };

    this.trigger.next(this.componentState);
    event.target.complete();
  }

  // SCROLL
  logScrolling({detail:{scrollTop = 0}}): void{
    if(scrollTop >= 300) this.showButton = true
    else this.showButton = false
  }


}
