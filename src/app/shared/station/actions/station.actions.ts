import { createAction, props } from '@ngrx/store';
import { EntityStatus } from '@euskobus/shared/utils/enum';
import { Station } from '../models/station.models';


export const loadStations = createAction(
  '[Station] Load Stations'
);

export const saveStations = createAction(
  '[Station] Save Stations',
  props<{ stations: Station[], error:unknown, status:EntityStatus }>()
);
