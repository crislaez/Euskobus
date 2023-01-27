import { Injectable } from '@angular/core';
import { NotificationActions } from '@euskobus/shared/notification';
import { EntityStatus } from '@euskobus/shared/utils/enum';
import { ToastController } from '@ionic/angular';
import { Actions, OnInitEffects, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as ScheduleActions from '../actions/schedule.actions';
import { ScheduleService } from '../services/schedule.service';


@Injectable()
export class SchedulesEffects implements OnInitEffects {

  loadSchedules$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScheduleActions.loadSchedules),
      switchMap(() => {
        return this._schedule.getSchedules().pipe(
          map(({schedules}) => ScheduleActions.saveSchedules({ schedules, error:undefined, status:EntityStatus.Loaded })),
          catchError(error => {
            return of(
              ScheduleActions.saveSchedules({ schedules:[], error, status:EntityStatus.Error }),
              NotificationActions.notificationFailure({message: 'ERRORS.ERROR_LOAD_SCHEDULES'})
            )
          })
        )
      })
    )
  });

  ngrxOnInitEffects() {
    return ScheduleActions.loadSchedules()
  };


  constructor(
    private actions$: Actions,
    private _schedule: ScheduleService,
    public toastController: ToastController,
  ) { }


}

