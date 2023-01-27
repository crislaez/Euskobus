import { createAction, props } from '@ngrx/store';
import { EntityStatus } from '@euskobus/shared/utils/enum';
import { Schedule } from '../models/schedule.models';


export const loadSchedules = createAction(
  '[Schedule] Load Schedules'
);

export const saveSchedules = createAction(
  '[Schedule] Save Schedules',
  props<{ schedules: Schedule[], error:unknown, status:EntityStatus }>()
);
