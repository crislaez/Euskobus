import { Injectable } from '@angular/core';
import { NotificationActions } from '@euskobus/shared/notification';
import { EntityStatus } from '@euskobus/shared/utils/enum';
import { ToastController } from '@ionic/angular';
import { Actions, OnInitEffects, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as StationActions from '../actions/station.actions';
import { StationService } from '../services/station.service';


@Injectable()
export class StationEffects implements OnInitEffects {

  loadStations$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StationActions.loadStations),
      switchMap(() => {
        return this._station.getStations().pipe(
          map(({stations}) => StationActions.saveStations({ stations, error:undefined, status:EntityStatus.Loaded })),
          catchError(error => {
            return of(
              StationActions.saveStations({ stations:[], error, status:EntityStatus.Error }),
              NotificationActions.notificationFailure({message: 'ERRORS.ERROR_LOAD_STATIONS'})
            )
          })
        )
      })
    )
  });

  ngrxOnInitEffects() {
    return StationActions.loadStations()
  };


  constructor(
    private actions$: Actions,
    private _station: StationService,
    public toastController: ToastController,
  ) { }


}

