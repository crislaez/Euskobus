
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CombineState, combineFeatureKey } from '../reducers';
import { stationMultiFeatureKey } from '../reducers/station-multi.reducer';

export const selectCombineState = createFeatureSelector<CombineState>(combineFeatureKey);


/* === MULTI === */
export const selectMultiState = createSelector(
  selectCombineState,
  (state) => state[stationMultiFeatureKey]
)

export const selectStatus = createSelector(
  selectMultiState,
  (state) => state?.status
);

export const selectStations = createSelector(
  selectMultiState,
  (state) => state?.stations
);

export const selectErrors = createSelector(
  selectMultiState,
  (state) => state?.error
);

export const selectStation = (stationId: string) => createSelector(
  selectStations,
  (stations) => (stations || [])?.find(item => item?.['KODEA-CODIGO']?.['_text'] === stationId)
);

