
import { createReducer, on } from '@ngrx/store';
import { EntityStatus } from '@euskobus/shared/utils/enum';
import * as ScheduleActions from '../actions/schedule.actions';
import { Schedule } from '../models/schedule.models';

export const scheduleMultiFeatureKey = 'multi';

export interface State {
  status: EntityStatus;
  schedules?: Schedule[];
  error?: unknown;
}

export const initialState: State = {
  status: EntityStatus.Initial,
  schedules: [],
  error: null,
};

export const reducer = createReducer(
  initialState,
  on(ScheduleActions.loadSchedules, (state): State => ({ ...state, error: undefined, status: EntityStatus.Pending })),
  on(ScheduleActions.saveSchedules, (state, { schedules, status, error }): State => {
    return {
      ...state,
      schedules,
      status,
      error,
    }
  })
);
