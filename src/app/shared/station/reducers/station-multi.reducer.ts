
import { createReducer, on } from '@ngrx/store';
import { EntityStatus } from '@euskobus/shared/utils/enum';
import * as StationActions from '../actions/station.actions';
import { Station } from '../models/station.models';

export const stationMultiFeatureKey = 'multi';

export interface State {
  status: EntityStatus;
  stations?: Station[];
  error?: unknown;
}

export const initialState: State = {
  status: EntityStatus.Initial,
  stations: [],
  error: null,
};

export const reducer = createReducer(
  initialState,
  on(StationActions.loadStations, (state): State => ({ ...state, error: undefined, status: EntityStatus.Pending })),
  on(StationActions.saveStations, (state, { stations, status, error }): State => {
    return {
      ...state,
      stations,
      status,
      error,
    }
  })
);
